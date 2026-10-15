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

## Starting your own project

`CHANGELOG.md` and the version in `package.json` describe releases of this template. In a project
created from it, delete `CHANGELOG.md`, set `version` in `package.json` and in
`.release-please-manifest.json` to `0.0.0`, and change `name` in `package.json`.

## Every day

```sh
npm run dev             # run src/index.ts and restart it on every change
npm run validate        # the fast quality gates
npm run validate:full   # every gate: run it before you call a task done
```

The other commands are in [Scripts](./scripts.md), and what each gate checks is in
[Quality gates](./quality-gates.md).

## Releases

Versions follow [SemVer](https://semver.org/) and come from the commit messages, which
`commitlint` already keeps in the Conventional Commits format: `fix:` bumps the patch version,
`feat:` the minor one, and a breaking change (`feat!:` or `BREAKING CHANGE:`) the major one. Before
1.0.0 a breaking change bumps the minor version.

After every merge into `main`, release-please updates an open release pull request with the next
version and the new `CHANGELOG.md` entries. Merging that pull request tags the version and creates a
GitHub Release. Never edit `CHANGELOG.md` or the version by hand.

One-time setup on GitHub: Settings → Actions → General → Workflow permissions → enable **Allow
GitHub Actions to create and approve pull requests**. Without it, release-please cannot open the
release pull request. CI does not run on that pull request, because GitHub does not start workflows
for changes made with the default `GITHUB_TOKEN`; it only changes the version and `CHANGELOG.md`.

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
