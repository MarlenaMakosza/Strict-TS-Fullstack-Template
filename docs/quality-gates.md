# Quality gates

A gate is an automated check that code must pass before it gets into the project. Every gate
works the same for code written by people and by AI agents.

## The gates

| Gate              | Tool                    | Fails when                                                      | Configured in                           |
| ----------------- | ----------------------- | --------------------------------------------------------------- | --------------------------------------- |
| Lint              | ESLint                  | any error or warning                                            | `eslint.config.js`                      |
| Types             | `tsc --noEmit`          | any type error                                                  | `tsconfig.json`                         |
| Formatting        | Prettier                | a file is not formatted                                         | `.prettierrc`                           |
| Spelling          | cspell                  | an unknown word                                                 | `cspell.json`                           |
| Unused code       | knip                    | an unused file, export or dependency                            | `knip.json`                             |
| Unit tests        | Vitest                  | a failing test, or coverage below 90%                           | `apps/api/vitest.config.ts`             |
| Integration tests | Vitest + Testcontainers | a test against the real database fails                          | `apps/api/vitest.integration.config.ts` |
| CRAP score        | `dev/quality/crap.ts`   | a function scores above 30                                      | `dev/quality/crap.ts`                   |
| Duplicated code   | jscpd                   | any clone of 50 tokens or more                                  | `.jscpd.json`                           |
| Architecture      | Archgate                | an ADR rule is broken                                           | `.archgate/adrs/`                       |
| Mutation testing  | Stryker                 | the mutation score is below 80%                                 | `apps/api/stryker.config.json`          |
| Acceptance tests  | Playwright + Gherkin    | a scenario fails                                                | `playwright.config.ts`                  |
| Documentation     | VitePress               | the docs do not build, or a link is dead                        | `.vitepress/config.ts`                  |
| Commit message    | commitlint              | the message is not a Conventional Commit                        | `commitlint.config.js`                  |
| Dependencies      | `npm audit`             | a runtime dependency has a known high or critical vulnerability | `security:audit` in `package.json`      |

## CRAP score

The CRAP (Change Risk Anti-Patterns) score combines cyclomatic complexity with coverage:

complexity² × (1 − coverage)³ + complexity

A function fails when it is both complex and poorly tested. A simple function or a fully tested
one always passes. Complexity comes from the ESLint `complexity` rule, and coverage from the last
`npm run test:coverage`.

## When the gates run

| Level              | Command                 | Runs                                                                                                                                              |
| ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every commit       | git hooks (Husky)       | lint-staged on the changed files, and commitlint on the message                                                                                   |
| Before you finish  | `npm run validate`      | all fast gates: lint, types, spelling, unused code, tests, CRAP, jscpd, ADRs                                                                      |
| Definition of done | `npm run validate:full` | `validate`, then the dependency audit, the integration tests, mutation testing, the Gherkin scenarios and the docs build                          |
| CI                 | GitHub Actions          | formatting, `validate`, the integration tests, mutation testing, the scenarios and the docs build, on every push to `main` and every pull request |

With Claude Code, a Stop hook also runs `npm run validate` before Claude may finish a task. See
[AI workflow](./ai-workflow.md).

CI is set up only for **GitHub Actions** (`.github/workflows/`). On another platform, such as
GitLab, nothing runs in CI until you add it there; the hooks and the `npm run` commands work the
same everywhere. Each job in `.github/workflows/ci.yml` is `npm ci` followed by a few `npm run`
commands, so a pipeline for another platform repeats those commands.
