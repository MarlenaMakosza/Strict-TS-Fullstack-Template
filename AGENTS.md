# Agent instructions

These rules apply to every coding agent working in this repository (Claude Code, Codex, Cursor,
Copilot, Gemini CLI, Aider and others). Humans follow them too.

The human owns the specification and the quality gates. The agent owns the implementation. Code is
accepted only when it passes every gate. Nobody reviews the code line by line, so the gates are
the review. Do not try to get around them.

The human does read two things: the Gherkin scenarios and the changes to existing tests. Keep both
easy to review (see [Final report](#final-report)).

## Project

- TypeScript on Node.js, no framework. Node runs `.ts` files directly.
- Source code in `src/`, unit tests in `tests/unit/`, end-to-end scenarios in `tests/e2e/features/`.
- PostgreSQL through Drizzle (`src/db/`). Start the database with `npm run db:start`.
- Architecture decisions (ADRs) live in `.archgate/adrs/`. Read the relevant ones before you change
  the structure of the code.

## Definition of done

A task is done only when all of these are true:

1. `npm run validate:full` exits with code 0. It runs `npm run validate`, then mutation testing
   (score of 80% or more), then the Gherkin end-to-end scenarios, then the documentation build. `npm run validate` checks lint,
   types, spelling, unused code, unit tests with a 90% coverage threshold, CRAP score (30 or less
   per function), duplicated code (none allowed) and ADRs.
2. `npm run format:check` exits with code 0. Run `npm run autofix` to fix formatting.
3. Every new or changed behavior has a unit test in `tests/unit/`.
4. If the change is visible to a user, a Gherkin scenario in `tests/e2e/features/` describes it.

Never report a task as done without running these commands yourself.

## Final report

End every task with a report in this shape:

1. **Commands**: each gate command you ran and its result. If a gate fails and you cannot fix it,
   say so plainly and quote the shortest decisive error line.
2. **Changed existing tests**: every assertion in an existing test that you changed or removed,
   as `file:line`, the old and the new expectation, and why the old one was wrong. If there are
   none, write "No existing assertions changed." New tests do not go here.
3. **Open questions**: anything in the specification that was unclear or seems wrong.

Changing an existing assertion is allowed only when the specified behavior changed. Never change
one only to make your code pass.

## Workflow

Follow this order for every change in behavior:

1. Read the Gherkin scenario (`tests/e2e/features/**/*.feature`) or the task description. If the expected
   behavior is unclear, ask before you write code.
2. Write a failing unit test in `tests/unit/`.
3. Write the smallest code in `src/` that makes the test pass.
4. Refactor while the tests stay green.
5. Run the full definition of done.

## Which command to run

| When                                  | Run                                                   |
| ------------------------------------- | ----------------------------------------------------- |
| After each edit (fast feedback)       | `npx vitest run <test file>` and `npx eslint <files>` |
| Before you say you are done           | `npm run validate:full` and `npm run format:check`    |
| Lint or formatting errors             | `npm run autofix`, then fix what is left by hand      |
| You changed logic in `src/` or tests  | `npm run test:mutation -- --force`                    |
| You need coverage numbers             | `npm run test:coverage`                               |
| User-visible behavior changed         | `npm run test:e2e`                                    |
| You changed `src/db/schema.ts`        | `npm run db:generate`, then `npm run db:check`        |
| `cspell` reports a real project word  | Add the word to `.cspell/custom-words.txt`            |
| `knip` reports unused code or exports | Remove the unused code. Do not add ignores            |
| `quality:crap` reports a function     | Add tests for it, or split it into simpler functions  |
| `quality:duplication` finds a clone   | Extract the shared code into one function or module   |

## Roles

A task can be split between agents with separate roles. Each role has its own instructions in
`.agents/roles/`. When you are given a role, read its file and follow it in addition to this file.

| Role               | File                                | Owns                                         |
| ------------------ | ----------------------------------- | -------------------------------------------- |
| `specifier`        | `.agents/roles/specifier.md`        | Draft Gherkin scenarios for the human        |
| `edge-case-hunter` | `.agents/roles/edge-case-hunter.md` | List edge cases, from common to extreme      |
| `architect`        | `.agents/roles/architect.md`        | ADRs and Archgate rules                      |
| `implementer`      | `.agents/roles/implementer.md`      | Unit tests, code and step definitions        |
| `reviewer`         | `.agents/roles/reviewer.md`         | Check tests against the spec, clean the code |
| `documenter`       | `.agents/roles/documenter.md`       | VitePress docs, arc42, ADR index, TSDoc      |

The roles work in this order: specifier, edge-case hunter, architect (only when the task needs an
architecture decision), implementer, reviewer, documenter. They hand work to each other through
files: the scenarios in `tests/e2e/features/`, the edge case lists in `docs/edge-cases/` and the ADRs in
`.archgate/adrs/`.

Without a role, do the work of the implementer.

## Gherkin scenarios

The human owns the scenarios in `tests/e2e/features/**/*.feature`. The specifier may draft them, but only
the human accepts them. The implementer writes the step definitions in
`tests/e2e/steps/` and the code that makes the scenarios pass.

- `tests/e2e/features/greeting.feature` with `tests/e2e/steps/app.steps.ts` is the reference
  example. Follow its style. Import `Given`, `When` and `Then` from `tests/e2e/steps/fixtures.ts`.
- Reuse existing steps before you add new ones. One step text maps to exactly one definition.
- Steps describe behavior, not implementation: "When I start the app", not "When I call main()".
- The app is a CLI for now: steps start it through the `app` fixture in
  `tests/e2e/steps/fixtures.ts`. When the app gets an HTTP server, add `webServer` and
  `use.baseURL` to `playwright.config.ts`, and use the `page` and `request` fixtures.
- If a scenario seems wrong or incomplete, do not change it. Ask the human.

## Protected files

The human owns these files. Do not edit, rename or delete them:

- `tests/e2e/features/**/*.feature`: the specification
- `eslint.config.js`, `tsconfig*.json`, `vitest.config.ts`, `stryker.config.json`, `knip.json`,
  `playwright.config.ts`, `cspell.json`, `commitlint.config.js`, `.jscpd.json`, `dev/quality/**` and
  the `scripts` in `package.json`: the gates and their thresholds
- `.husky/**`, `.github/**`: the hooks and CI
- `CHANGELOG.md`, `release-please-config.json`, `.release-please-manifest.json` and the `version`
  in `package.json`: release-please writes them
- `.archgate/adrs/**`: architecture decisions. The architect may draft them, but only the human
  accepts them
- `AGENTS.md`, `CLAUDE.md`, `.agents/**`, `.claude/**`: the agent rules

If you think one of them must change, stop. Explain what should change and why, and wait for the
human to decide.

## Forbidden ways to make a gate pass

- Deleting, skipping or weakening a test (`it.skip`, `it.only`, empty assertions, removing
  `expect.assertions`).
- Adding `eslint-disable`, `@ts-ignore`, `@ts-expect-error` or `as any` to silence an error.
- Lowering a threshold or adding exclusions in a gate config.
- Hardcoding a value only because a test expects it.
- Committing with `--no-verify` or `HUSKY=0`.

Fix the cause of the failure instead.

## Commits

- Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`). `commitlint`
  checks the message. The type sets the next version: `fix:` patch, `feat:` minor, `!` or
  `BREAKING CHANGE:` major. Pick it by what changed for the user, not by the size of the diff.
- The pre-commit hook runs `lint-staged`. CI runs `npm run format:check`, `npm run validate`,
  mutation testing and the end-to-end scenarios. A pull request with the `ai-review` label also
  gets a review from a second AI model.
