# Ultimate TS project

English | [Polski](docs/pl/index.md)

A production-ready template for a plain TypeScript project on Node.js, with no framework.

Writing non-trivial TypeScript well is hard. The language has many small gotchas that cause real
problems in the right circumstances, so linters and other code quality tools matter a lot. This
template gives you a large set of them, configured strictly and ready to use, so you can write
professional-quality code from the first commit.

The same gates work whether people or AI agents write the code. For people, they catch mistakes
before code review. For AI agents, they go further: only the code that passes every constraint
stays. The agent workflow was inspired by a
[post by Robert C. Martin (Uncle Bob)](https://x.com/unclebobmartin/status/2080257779395154409).

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

## How to install

```sh
git clone https://github.com/MarlenaMakosza/Ultimate-TS-AI-project.git
cd Ultimate-TS-AI-project
```

## Quick start

You need Node.js 24 (see `.nvmrc`) and Docker.

```sh
nvm use
cp .env.example .env
npm run firstrun:dev
npm run validate
```

## Working with AI agents

The rules for every agent are in `AGENTS.md`, and six roles in `.agents/roles/` split a task from
the specification to the documentation. An optional adapter in `.claude/` connects Claude Code.
Not using AI agents? Everything else works the same without them. See
[AI workflow](docs/ai-workflow.md) for the step-by-step guide and for how to remove the AI setup.

## Documentation

- [Getting started](docs/getting-started.md): requirements, install, project structure
- [Quality gates](docs/quality-gates.md): what each gate checks, and when it runs
- [Scripts](docs/scripts.md): every npm script
- [Tools](docs/tools.md): every tool, and why it is here
- [AI workflow](docs/ai-workflow.md): working with AI agents, step by step

## License

[MIT](LICENSE)
