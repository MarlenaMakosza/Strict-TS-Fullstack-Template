# 8. Crosscutting concepts and coding conventions

The rules that apply across the whole code base (arc42 calls them crosscutting concepts): how
code is written in this project, by people and by AI agents. ESLint, Prettier and TypeScript
enforce most of the mechanics; this page covers the decisions they cannot check. Where a tool
already enforces a rule, the rule says so.

## Naming

- Names are **short but unambiguous**: `getUserByEmail`, not `getUserByEmailAddress`.
- Booleans start with `is`, `has`, `can` or `should` (`isActive`, `hasPermission`). ESLint
  (`unicorn/consistent-boolean-name`) checks it.
- Acronyms are written in upper case: `getUserID`, not `getUserId`.
- No abbreviations: `configuration`, not `cfg`. ESLint (`unicorn/name-replacements`) checks it and
  allows a few standard ones: `env`, `db`, `req`, `res`.

## Functions

- A function does **one thing**. Several steps of the same task are fine.
- Guard clauses may return early, and ESLint (`no-else-return`) pushes toward them. Apart from
  guard clauses, a function has one exit point.
- Length is not a quality metric. Complexity is: the CRAP gate fails a complex function that is
  not well tested (see [Quality gates](../quality-gates.md)).

## Comments

- Comment **why**, not **what**: the name says what, the comment explains intent and decisions.
- A comment on _what_ is a last resort, for example for a non-obvious algorithm.
- `TODO` and `FIXME` are allowed as temporary markers.
- Every exported function, type and constant has a **TSDoc** comment (`/** … */`). TypeDoc builds
  the API reference from them, and ESLint (`tsDoc/syntax`) checks the syntax.

```ts
/**
 * Calculates the discount for a user.
 * A trial user counts as premium for the first 30 days.
 *
 * @param user - The user to evaluate.
 * @returns The discount, from 0 to 1.
 */
export function getDiscount(user: User): number {
```

## Errors

- Application logic returns a **Result** from `@app/shared/result` (`packages/shared/src/result.ts`)
  for operations that may fail, instead of throwing. `success(value)` and `failure(error)` build
  it. The backend and the frontend use the same one:

  ```ts
  import { failure, type Result, success } from '@app/shared/result';

  function parseAge(input: string): Result<number> {
    const age = Number(input);

    return Number.isSafeInteger(age) && age >= 0 ? success(age) : failure(`Not an age: ${input}`);
  }

  const result = parseAge(text);
  if (result.ok) {
    logger.info({ age: result.value }, 'Parsed the age'); // `value` is allowed only after the check
  }
  ```

  The `ok` field lets TypeScript narrow the type, so the caller cannot use `value` without
  checking for an error first. The error is a message by default; pass a type for a structured
  one, such as `Result<User, 'not-found' | 'inactive'>`.

- Exceptions are caught **only at external boundaries** (database, network, file system,
  third-party libraries) and turned into a Result there.
- Two exceptions to "no throwing": invalid configuration at startup fails fast with an error (see
  `apps/api/src/env.ts` and ADR `ARCH-001`), and scripts in `dev/` may throw.
- The API answers every error in one JSON format: `{ "error": "Not found" }`. Invalid input also
  lists every invalid field, with status `400`:

  ```json
  { "error": "Invalid request", "issues": [{ "message": "…", "path": "range.from" }] }
  ```

  A route turns a failed Result into one of these answers with a fitting status. An unexpected
  error gets `500` and `{ "error": "Internal server error" }`; the details go only to the log.

## Tests

- **TDD** by default: flexible, not dogmatic.
- Test only the **public API** of a module, never private functions.
- Name a test by the behavior it checks. When the setup matters, use
  `given <state> when <action> then <expected result>`.
- Cover the normal case **and** the edge cases. The edge case lists in `docs/edge-cases/` help.
- Code that talks to the database gets an **integration test** in `apps/api/tests/integration/`: it
  runs against a real PostgreSQL that Testcontainers starts in Docker, with the committed
  migrations. Unit tests stay free of the database. `apps/api/tests/integration/db/users.test.ts`
  shows the setup.
- When a rule holds for every input of a kind ("any name gives a greeting that ends with `!`"),
  add a **property-based test** with [fast-check](https://fast-check.dev/). It generates many
  inputs, and when one fails, shrinks it to the smallest failing example. Example tests stay:
  they document the concrete cases. See `apps/api/tests/unit/greet.test.ts`.

## Dependencies and imports

- **Dependency injection**: a module receives its dependencies from outside and never creates
  them itself.

  ```ts
  class OrderService {
    public constructor(private readonly database: Database) {}
  }
  ```

- Import order: external packages first, then the project's modules. ESLint (`perfectionist`) sorts
  them.
- Relative imports with the `.ts` extension (`./greet.ts`). Path aliases (such as `@src/…`) are
  optional: turn them on with `aliasFlag` in `eslint.config.js` and `paths` in `tsconfig.json`
  together.

## File structure

Group code by feature: each feature owns its files.

```text
apps/api/src/
  user/
    user.model.ts
    user.service.ts
  order/
    order.model.ts
    order.service.ts
  shared/
    result.ts
```

Shared types and helpers go into `shared/`.

## Logging

- Log through `logger` from `apps/api/src/logger.ts`, a [pino](https://getpino.io/) logger (ADR
  `ARCH-002`). Pass context as an object, and the message as a short sentence:

  ```ts
  logger.info({ userID }, 'Signed in');
  ```

- The level comes from `LOG_LEVEL` (default `info`). Production and tests write JSON lines; in
  development, pino-pretty writes readable lines.
- Logs go to stderr. ESLint (`no-console`) rejects `console.*` in `apps/api/src/`; only the scripts
  in `dev/` print to the terminal.
- The server logs one line per request (`Request handled`) with the method, path, status,
  `durationMs` and `requestID`. Log inside a route with the same `requestID`, so that all lines of
  one request can be found together.
- `apps/api/dev/logger-example.ts` shows every common case (levels, context, errors, child loggers,
  redaction) and how to save the logs to a file. Run it with `npm run example:logger`.
- Secret fields (`DATABASE_URL`, `password`, `token`, `authorization`, `cookie`) are redacted. Add
  new ones to `SECRET_FIELDS` in `apps/api/src/logger.ts`, and never put a secret in the message
  string.

## Null and undefined

- `null` is an intentional absence in the domain: a user may have no avatar.

  ```ts
  interface User {
    avatar: null | string;
  }
  ```

- `undefined` is an optional or not-yet-set value.

  ```ts
  interface Config {
    timeout?: number;
  }
  ```

- Do not use `null` or `undefined` to signal an error: that is what Result is for.
- No `any`: use `unknown` when the type is truly unknown. ESLint and `strict` in `tsconfig.json`
  enforce it.

## Types and enums

- `interface` for object shapes, `type` for unions, aliases and other complex types. ESLint
  (`consistent-type-definitions`) checks it.

  ```ts
  interface User {
    name: string;
  }
  type Status = 'active' | 'inactive';
  type AdminUser = User & { role: string };
  ```

- **No `enum` and no `const enum`.** Node runs `.ts` files by stripping the types: it blanks out
  the annotations and runs what is left, without a build step. An `enum` is not an annotation but
  code that creates an object, so stripping cannot handle it, and Node stops with
  `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. `erasableSyntaxOnly` in `tsconfig.json` reports such syntax
  in the editor already. Use a union of literals, or an `as const` object when you need the values
  at runtime:

  ```ts
  const DIRECTION = { up: 'up', down: 'down' } as const;
  type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
  ```

- **Think this through before you change it in your project.** The choice affects how every file
  runs, and switching later means touching the whole code base:

  | Option                                                  | Enums | Cost                                                                                              |
  | ------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
  | Type stripping, no enums (the template)                 | no    | none; Node runs `.ts` directly, in development, tests and scenarios                               |
  | `node --experimental-transform-types`                   | yes   | the flag is experimental and may change; every `node` command and tool needs it                   |
  | Always compile with `tsc` (or a bundler) before running | yes   | a build step before every run, test and scenario; `erasableSyntaxOnly` and type stripping go away |

  `npm run build` compiles with `tsc` for production already, but development, the unit tests and
  the scenarios run the `.ts` files directly, so an enum would break them. See
  [Node.js: type stripping](https://nodejs.org/api/typescript.html#type-stripping) and
  [TypeScript 5.8: `--erasableSyntaxOnly`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option).

- Generic type parameters have descriptive names (`TItem`, `TValue`, `TResult`). A single letter is
  fine only when there is one parameter and its meaning is obvious.

## Formatting

Prettier formats everything, with the settings in `.prettierrc` (100 characters per line, single
quotes, trailing commas). `npm run format` applies them, and `npm run format:check` runs in CI.

## Git workflow

- **GitHub Flow**: `main` is always releasable, and every change goes through a branch and a pull
  request.
- Branch names follow the commit types: `feat/short-description`, `fix/…`, `docs/…`, `chore/…`.
- Never commit to `main` directly. GitHub deletes the branch after the merge; delete your local
  copy too (see [GitHub settings](../getting-started.md#github-settings)).

## Commits and pull requests

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) in English. `commitlint`
  checks the format, and the type sets the next version (see
  [Releases](../getting-started.md#releases)).
- One change: a one-line message. More context: a body after a blank line.

  ```text
  feat: add user discount calculation

  Trial users count as premium for the first 30 days.
  ```

- A pull request fills in `.github/PULL_REQUEST_TEMPLATE.md`: What, Why and How to test are
  required; Screenshots, Breaking changes and AI assistance are optional.
- Review comments use [Conventional Comments](../code-review.md).
