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

- Application logic returns a **Result** for operations that may fail, instead of throwing:

  ```ts
  type Result<TValue, TError = string> = { ok: true; value: TValue } | { ok: false; error: TError };
  ```

  The `ok` field lets TypeScript narrow the type, so the caller cannot use `value` without
  checking for an error first.

- Exceptions are caught **only at external boundaries** (database, network, file system,
  third-party libraries) and turned into a Result there.
- Two exceptions to "no throwing": invalid configuration at startup fails fast with an error (see
  `src/env.ts` and ADR `ARCH-001`), and scripts in `dev/` may throw.

## Tests

- **TDD** by default: flexible, not dogmatic.
- Test only the **public API** of a module, never private functions.
- Name a test by the behavior it checks. When the setup matters, use
  `given <state> when <action> then <expected result>`.
- Cover the normal case **and** the edge cases. The edge case lists in `docs/edge-cases/` help.

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
src/
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

- There is no logger yet. The CLI prints with `console.log`, and errors go to `console.error`.
- To decide later: a structured logger such as pino or winston, for storing and searching logs.
  Record the choice as an ADR.

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

- **No `enum` and no `const enum`.** Node runs `.ts` files by stripping the types, and
  `erasableSyntaxOnly` in `tsconfig.json` rejects any syntax that cannot be stripped, enums
  included. Use a union of literals, or an `as const` object when you need the values at runtime:

  ```ts
  const DIRECTION = { up: 'up', down: 'down' } as const;
  type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
  ```

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
