# Strict TS Fullstack Template

English | [Polski](./pl/index.md)

> [!NOTE]
> **AI is optional.** The quality gates, git hooks and CI work the same when people write the
> code. See [Use without AI](./without-ai.md).

A production-ready fullstack TypeScript template: an HTTP API with Hono on Node.js and a React
frontend with Vite, in one monorepo.

Writing non-trivial TypeScript well is hard. The language has many small gotchas that cause real
problems in the right circumstances, so linters and other code quality tools matter a lot. This
template gives you a large set of them, configured strictly and ready to use, so you can write
professional-quality code from the first commit.

The same gates work whether people or AI agents write the code. For people, they catch mistakes
before code review. For AI agents, they go further: only the code that passes every constraint
stays. The agent workflow was inspired by a
[post by Robert C. Martin (Uncle Bob)](https://x.com/unclebobmartin/status/2080257779395154409).

## What you get

- **TypeScript fullstack in one monorepo.** The backend (`apps/api`) runs on Node.js 24 straight
  from `.ts` files: Hono serves the routes under `/api/`, Zod validates their input and the
  environment, and `/api/openapi.json` describes the API. The frontend (`apps/web`) is React with
  Vite and Tailwind CSS. Shared code lives in `packages/shared`.
- **Strict lint.** ESLint with type-aware rules and about 20 plugins, Prettier, cspell (English and
  Polish) and knip for unused code.
- **PostgreSQL with Drizzle.** Docker Compose runs the database. You also get migrations and a
  Faker seed script.
- **Security checks.** `npm audit` fails CI on a known high or critical vulnerability in a runtime
  dependency, `eslint-plugin-security` catches risky patterns in the code, and `SECURITY.md` tells
  people how to report a vulnerability privately.
- **Tests at every level.** Vitest for unit tests, with fast-check for property-based tests;
  integration tests against a real PostgreSQL in Docker (Testcontainers); Playwright with Gherkin
  scenarios (playwright-bdd) for the API and for the web app in a browser, with an axe
  accessibility check; and Stryker for mutation testing.
- **Quality metrics.** A coverage threshold, a CRAP score per function and duplicated-code
  detection.
- **Architecture rules and docs.** ADRs in `.archgate/adrs/`, checked by Archgate, and a VitePress
  site with the arc42 architecture in English and Polish, published on GitHub Pages.
- **Logging with pino.** One logger in `apps/api/src/logger.ts`: JSON lines in production, readable
  lines in development, the level from `LOG_LEVEL`, and secrets such as passwords and tokens hidden.
  Logs go to stderr.
- **Automatic releases.** release-please reads the
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), keeps a release pull
  request with the next version and the `CHANGELOG.md` up to date, and tags the release when you
  merge it.
- **An AI agent setup that works with any tool.** `AGENTS.md` holds the rules, there are roles for
  separate agents, and an optional adapter connects Claude Code.
- **CI on GitHub Actions.** Git hooks, issue forms that ask for Gherkin scenarios, and an optional
  review by a second AI model.

## How to install

```sh
git clone https://github.com/MarlenaMakosza/Strict-TS-Fullstack-Template.git
cd Strict-TS-Fullstack-Template
```

## Quick start

You need Node.js 24 (see `.nvmrc`) and Docker.

```sh
nvm use
cp apps/api/.env.example apps/api/.env
npm run firstrun:dev
npm run validate
npm run dev   # the app on http://localhost:5173, the API on http://localhost:3000
```

## Working with AI agents

The rules for every agent are in `AGENTS.md`, and six roles in `.agents/roles/` split a task from
the specification to the documentation. An optional adapter in `.claude/` connects Claude Code.
Not using AI agents? Everything else works the same without them. See
[AI workflow](./ai-workflow.md) for the step-by-step guide, and
[Use without AI](./without-ai.md) for how to remove the AI setup.

## Documentation

- [Getting started](./getting-started.md): requirements, install, project structure
- [Quality gates](./quality-gates.md): what each gate checks, and when it runs
- [Scripts](./scripts.md): every npm script
- [Tools](./tools.md): every tool, and why it is here
- [AI workflow](./ai-workflow.md): working with AI agents, step by step
- [Use without AI](./without-ai.md): how to remove the AI setup
