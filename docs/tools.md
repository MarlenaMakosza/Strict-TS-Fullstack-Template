# Tools

Every tool in the template, and what it is for. Items marked `*` go beyond the usual toolset for
a plain TypeScript project. For the commands that run them, see [Scripts](./scripts.md). For how
the checks work together, see [Quality gates](./quality-gates.md).

## Language and runtime

| Tool       | Role                                            |
| ---------- | ----------------------------------------------- |
| TypeScript | Language, `tsc` for type checking and build     |
| Node.js    | Runtime, runs `.ts` directly (type stripping)   |
| Zod        | Data validation at boundaries (API, files, env) |
| dotenv     | Loads variables from `.env`                     |

## Database

| Tool                | Role                                     |
| ------------------- | ---------------------------------------- |
| PostgreSQL (Docker) | Database (`docker-compose.yml`)          |
| Docker Compose      | Starts the database (`npm run db:start`) |
| `drizzle-orm`       | ORM                                      |
| `drizzle-kit`       | Migrations, studio (`drizzle.config.ts`) |
| `postgres`          | PostgreSQL driver                        |
| `@faker-js/faker`   | Seed data (`dev/db/seed*.ts`)            |

## Styles

| Tool                            | Role                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| Tailwind CSS v4 (`tailwindcss`) | Utility classes; config lives in CSS (`src/styles/app.css`, `@theme`), no `tailwind.config.js` |
| `@tailwindcss/cli`              | Builds `dist/app.css` (`css:build`, `css:watch`)                                               |

## Linters and formatting

| Tool                                                                | Role                                                                         |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ESLint                                                              | Linter                                                                       |
| `@eslint/js`                                                        | Base JS rules                                                                |
| `typescript-eslint`                                                 | TS rules, type-aware (`strictTypeChecked`)                                   |
| `@eslint/json`                                                      | JSON files                                                                   |
| `@eslint/markdown`                                                  | Markdown files                                                               |
| `eslint-plugin-unicorn`                                             | Best practices, modern APIs                                                  |
| `eslint-plugin-sonarjs`                                             | Code smells, complexity, duplicates                                          |
| `eslint-plugin-import-x` + `eslint-import-resolver-typescript`      | Cycles, broken and redundant imports                                         |
| `eslint-plugin-perfectionist`                                       | Sorting of imports, keys, unions                                             |
| `eslint-plugin-promise`                                             | Promise mistakes                                                             |
| `eslint-plugin-drizzle`, Drizzle, PostgreSQL, Testcontainers, Faker | Project-dependent (database)                                                 |
| `eslint-plugin-n`                                                   | Node.js rules                                                                |
| `eslint-plugin-security`                                            | Security patterns                                                            |
| `eslint-plugin-regexp` `*`                                          | Broken and slow regular expressions                                          |
| `eslint-plugin-tsdoc`                                               | TSDoc comment syntax                                                         |
| `@eslint-community/eslint-plugin-eslint-comments`                   | Guards `eslint-disable` (maintained fork of `eslint-plugin-eslint-comments`) |
| `@vitest/eslint-plugin`                                             | Test rules                                                                   |
| `globals`                                                           | Global variable definitions                                                  |
| Prettier                                                            | Formatting                                                                   |
| `eslint-config-prettier`                                            | Turns off ESLint rules that clash with Prettier                              |
| cspell                                                              | Spellcheck of all files (not only linted ones)                               |
| knip `*`                                                            | Unused files, exports and dependencies                                       |
| `eslint-plugin-better-tailwindcss` `*`                              | Tailwind classes in TS and `@apply`: unknown, duplicate, conflicting, order  |
| `@eslint/css` + `tailwind-csstree` `*`                              | Linting CSS files (with Tailwind v4 syntax)                                  |

### Optional linters

| Tool                                       | When                                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `eslint-plugin-functional`                 | When the team wants to enforce immutability; very strict                                                    |
| `@dword-design/eslint-plugin-import-alias` | When the project uses path aliases                                                                          |
| `eslint-plugin-boundaries`                 | When the project has layers (e.g. domain / application / infrastructure); controls who may import from whom |

## Tests

| Tool                                     | Role                                                                                                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitest                                   | Test runner                                                                                                                                               |
| `@testcontainers/postgresql`             | PostgreSQL in a container for tests                                                                                                                       |
| `@vitest/coverage-v8` `*`                | Test coverage                                                                                                                                             |
| Playwright (`@playwright/test`)          | End-to-end tests (`playwright.config.ts`)                                                                                                                 |
| Gherkin                                  | BDD scenarios from the user's point of view (`.feature`, Given/When/Then), run in Playwright                                                              |
| `playwright-bdd`                         | Turns Gherkin scenarios (`.feature`) into Playwright tests, maps steps to TS definitions                                                                  |
| Stryker (`@stryker-mutator/core`)        | Mutation testing: deliberately breaks the code and checks that tests catch it (mutation score instead of plain coverage)                                  |
| Stryker command runner (built into core) | Runs `vitest run` for every mutant. `@stryker-mutator/vitest-runner` is faster but does not work with Vitest 5 (stryker-js #6210); switch back once fixed |
| jscpd `*`                                | Duplicated code (`.jscpd.json`), a gate in `validate`: no clone allowed                                                                                   |
| CRAP (`dev/quality/crap.ts`) `*`         | Complexity (ESLint `complexity`) × missing coverage (Vitest coverage); a gate in `validate`, limit 30 per function                                        |

## Git and CI

| Tool                                           | Role                                                                                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Husky                                          | Git hooks                                                                                                                     |
| lint-staged                                    | Lint and format only changed files on commit                                                                                  |
| commitlint + `@commitlint/config-conventional` | Conventional Commits                                                                                                          |
| GitHub Actions                                 | CI: `validate`, mutation testing and e2e on every PR; optional AI review by a different model (`ai-review` label, OpenRouter) |

## Maintenance

| Tool                              | Role                                       |
| --------------------------------- | ------------------------------------------ |
| Renovate `*` or npm-check-updates | Dependency updates                         |
| rimraf                            | `npm run clean` that also works on Windows |

## Documentation and architecture

| Tool      | Role                            |
| --------- | ------------------------------- |
| TypeDoc   | API docs from TSDoc comments    |
| VitePress | Documentation site (arc42, ADR) |
| Archgate  | Enforces ADRs in code           |

## Worth considering in other projects, and other notes

Tools that fit other kinds of projects, or that duplicate what the template already has. The
Reason column says when they can still be useful.

| Tool                                                                                                      | Reason                                                                        |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Svelte, SvelteKit, `svelte-check`, `eslint-plugin-svelte`, `prettier-plugin-svelte`, `@testing-library/*` | Framework-specific                                                            |
| `@html-eslint/*`                                                                                          | No HTML files in plain TS                                                     |
| `@stylistic/eslint-plugin`                                                                                | Duplicates Prettier                                                           |
| `prettier-plugin-organize-imports`                                                                        | Duplicates perfectionist                                                      |
| `@cspell/eslint-plugin`                                                                                   | Duplicates cspell CLI                                                         |
| `eslint-plugin-eslint-plugin`                                                                             | Only for writing custom ESLint rules                                          |
| skott                                                                                                     | knip + import-x cover most of it, but useful for viewing the dependency graph |
