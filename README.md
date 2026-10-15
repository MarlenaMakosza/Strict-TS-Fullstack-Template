# Ultimate TS project

English | [Polski](README-pl.md)

A production-ready template for a plain TypeScript project on Node.js, with no framework.

Writing non-trivial TypeScript well is hard. The language has many small gotchas that cause real
problems in the right circumstances, so linters and other code quality tools matter a lot. This
template gives you a large set of them, configured strictly and ready to use, so you can write
professional-quality code from the first commit.

The same gates work whether people or AI agents write the code. For people, they catch mistakes
before code review. For AI agents, they go further. The idea comes from Robert C. Martin (Uncle
Bob): do not read every line the agents write. Surround them with constraints instead (unit tests,
Gherkin scenarios, coverage, mutation testing, quality metrics), and accept only code that passes
all of them. The human owns the specification and the gates. The agents own the implementation.

## What you get

- **TypeScript on Node.js 24.** Node runs `.ts` files directly, with no build step in
  development. Zod validates the environment and other input at the boundaries.
- **PostgreSQL with Drizzle.** Docker Compose runs the database. You also get migrations and a
  Faker seed script.
- **Strict lint.** ESLint with type-aware rules and about 20 plugins, Prettier, cspell (English and
  Polish) and knip for unused code.
- **Tests at three levels.** Vitest for unit tests, Playwright with Gherkin scenarios
  (playwright-bdd) for end-to-end tests, and Stryker for mutation testing.
- **Quality metrics.** A coverage threshold, a CRAP score per function and duplicated-code
  detection.
- **Architecture rules.** ADRs in `.archgate/adrs/`, checked by Archgate.
- **An AI agent setup that works with any tool.** `AGENTS.md` holds the rules, there are roles for
  separate agents, and an optional adapter connects Claude Code.
- **CI on GitHub Actions.** Git hooks, Conventional Commits and an optional review by a second AI
  model.

## Quick start

You need Node.js 24 (see `.nvmrc`) and Docker.

```sh
nvm use
cp .env.example .env
npm run firstrun:dev
```

`firstrun:dev` installs the dependencies and checks the types. It then starts PostgreSQL, runs the
migrations and seeds the database. After that:

```sh
npm run dev        # run src/index.ts in watch mode
npm run validate   # run the quality gates
```

## Quality gates

| Gate             | Tool                  | Fails when                               |
| ---------------- | --------------------- | ---------------------------------------- |
| Lint             | ESLint                | any error or warning                     |
| Types            | `tsc --noEmit`        | any type error                           |
| Formatting       | Prettier              | a file is not formatted                  |
| Spelling         | cspell                | an unknown word                          |
| Unused code      | knip                  | an unused file, export or dependency     |
| Unit tests       | Vitest                | a failing test, or coverage below 90%    |
| CRAP score       | `dev/quality/crap.ts` | a function scores above 30               |
| Duplicated code  | jscpd                 | any clone of 50 tokens or more           |
| Architecture     | Archgate              | an ADR rule is broken                    |
| Mutation testing | Stryker               | the mutation score is below 80%          |
| Acceptance tests | Playwright + Gherkin  | a scenario fails                         |
| Commit message   | commitlint            | the message is not a Conventional Commit |

The CRAP (Change Risk Anti-Patterns) score combines cyclomatic complexity with coverage:
complexity² × (1 − coverage)³ + complexity. A function fails when it is both complex and poorly
tested. A simple function or a fully tested one always passes.

Run the gates at three levels:

- `npm run validate`: all fast gates. The Claude Code Stop hook runs this command.
- `npm run validate:full`: `validate`, then mutation testing, the Gherkin scenarios and the
  documentation build. This is the definition of done.
- CI: the same gates on every push to `main` and on every pull request.

## Working with AI agents

Not using AI agents? Skip this section. The gates, git hooks and CI work the same without it.

For a step-by-step walkthrough with example prompts, see [`GUIDE.md`](GUIDE.md).

The rules for every agent live in [`AGENTS.md`](AGENTS.md). Codex, Cursor, Copilot and most other
tools read this file directly. Claude Code reads `CLAUDE.md`, which only imports `AGENTS.md`.

- **Specification first.** You write the behavior as Gherkin scenarios in `tests/e2e/features/*.feature`.
  An agent makes them pass with TDD. See `tests/e2e/features/greeting.feature` for an example.
- **What you review.** You do not review the implementation. You review the scenarios, and the
  changes to existing test assertions that each agent lists in its final report.
- **Roles.** `.agents/roles/` defines four main roles that work in this order:
  1. `specifier`: drafts the scenarios.
  2. `edge-case-hunter`: lists edge cases from common to extreme in `docs/edge-cases/`, and asks
     you about the cases the specification does not cover.
  3. `implementer`: writes the tests, including one for each edge case, and the code.
  4. `reviewer`: checks the tests against the scenarios and the edge cases, and cleans the code.

  Two more roles work when needed: the `architect` records decisions as ADRs and enforces them
  with Archgate rules, and the `documenter` keeps the VitePress docs, the arc42 pages, the ADR
  index and the TSDoc comments up to date.

- **Protected files.** Agents must not change the scenarios, the gate configs, the hooks, CI or
  the agent rules.

Each part of the setup enforces the rules at a different level:

| Layer               | Where                         | Works with                     |
| ------------------- | ----------------------------- | ------------------------------ |
| Instructions        | `AGENTS.md`, `.agents/roles/` | any agent                      |
| Git hooks           | `.husky/`                     | any agent and any human        |
| CI and code owners  | `.github/`                    | everything that reaches `main` |
| Claude Code adapter | `.claude/`                    | Claude Code only               |

The Claude Code adapter adds three things:

- A Stop hook. Claude cannot finish while `validate` fails.
- Permission rules that block edits to protected files.
- One subagent for each role.

The adapter is optional: the git hooks and CI enforce the same rules without it.

### Optional AI review

Pull requests with the `ai-review` label get a review comment from a second model through
OpenRouter. This model should be a different one from the model that wrote the code. Its review
looks for problems the gates cannot see: tests that do not match the scenarios, and behavior that
no scenario describes. To enable it, add the `OPENROUTER_API_KEY` secret and the
`AI_REVIEW_MODEL` variable (an OpenRouter model id) in the GitHub repository settings.

## Project structure

```text
src/                  application code
  db/                 Drizzle schema and client
tests/unit/           Vitest unit tests
tests/e2e/features/   Gherkin scenarios (the specification)
tests/e2e/steps/      step definitions and fixtures
dev/db/               migration and seed scripts
dev/quality/          CRAP gate
docs/                 VitePress documentation (arc42, ADRs)
.archgate/adrs/       architecture decision records
.agents/roles/        role instructions for AI agents
.claude/              Claude Code adapter (hooks, permissions, subagents)
.github/              CI workflows, code owners, pull request template
```

## Scripts

| Script                                 | What it does                                   |
| -------------------------------------- | ---------------------------------------------- |
| `dev` / `start`                        | run in watch mode / run the build              |
| `build`                                | compile TypeScript and Tailwind CSS to `dist/` |
| `validate` / `validate:full`           | fast gates / all gates                         |
| `autofix`                              | fix lint and formatting                        |
| `test` / `test:coverage`               | unit tests / with coverage                     |
| `test:mutation`                        | Stryker mutation testing                       |
| `test:e2e` / `test:e2e:open`           | Gherkin scenarios in Playwright, run / UI mode |
| `quality:crap` / `quality:duplication` | CRAP score / duplicated code                   |
| `db:start` / `db:sync` / `seed:dev`    | start PostgreSQL / generate and migrate / seed |
| `docs:dev` / `docs:api`                | documentation site / API docs from TSDoc       |
| `update-dependencies`                  | update all dependencies to the latest versions |

The full list of tools, with the reason for each one, is in
[docs/clean-start.en.md](docs/clean-start.en.md) ([Polish version](docs/clean-start.md)).

## License

[MIT](LICENSE)
