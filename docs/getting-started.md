# Getting started

## Requirements

- Node.js 24 (the version is in `.nvmrc`; `npm install` refuses an older one)
- Docker, for PostgreSQL
- git

## Install

```sh
git clone https://github.com/MarlenaMakosza/Ultimate-TS-AI-project.git
cd Ultimate-TS-AI-project
nvm use
cp .env.example .env
npm run firstrun:dev
```

`firstrun:dev` installs the dependencies and checks the types. It then starts PostgreSQL, runs the
migrations and seeds the database.

## Every day

```sh
npm run dev             # run src/index.ts and restart it on every change
npm run validate        # the fast quality gates
npm run validate:full   # every gate: run it before you call a task done
```

The other commands are in [Scripts](./scripts.md), and what each gate checks is in
[Quality gates](./quality-gates.md).

## Project structure

```text
src/                  application code
  db/                 Drizzle schema and client
tests/unit/           Vitest unit tests
tests/e2e/features/   Gherkin scenarios (the specification)
tests/e2e/steps/      step definitions and fixtures
dev/db/               migration and seed scripts
dev/quality/          CRAP gate
docs/                 this documentation (VitePress); Polish version in docs/pl/
.archgate/adrs/       architecture decision records
.agents/roles/        role instructions for AI agents
.claude/              Claude Code adapter (hooks, permissions, subagents)
.github/              CI workflows, code owners, pull request template
```
