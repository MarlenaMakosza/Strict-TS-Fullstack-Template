# Getting started

## Requirements

- Node.js 24 (the version is in `.nvmrc`; `npm install` refuses an older one), with the npm
  version from `packageManager` in `package.json` (update it together with Node)
- Docker, for PostgreSQL
- git

## Install

```sh
git clone https://github.com/MarlenaMakosza/Ultimate-TS-AI-project.git
cd Ultimate-TS-AI-project
nvm use
cp apps/api/.env.example apps/api/.env
npm run firstrun:dev
```

`firstrun:dev` installs the dependencies and checks the types. It then starts PostgreSQL, runs the
migrations and seeds the database.

## Optional: codebase-memory-mcp for AI agents

You can install it, but you do not have to: everything in the template works without it.

[codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) (MIT, free) builds a map of
the code: which functions exist, who calls them, and what imports what. An AI agent (Claude Code,
Codex CLI, Gemini CLI and others) can then ask the map "where is this defined" or "what calls
this", instead of opening file after file. It finds the code faster and uses fewer tokens, which
matters more as the project grows. The map stays on your computer.

```sh
# Install (Linux and macOS); the script also connects it to the agents it finds
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
codebase-memory-mcp --version
```

Then ask the agent once: "Index this repository with codebase-memory-mcp." `AGENTS.md` already
tells the agents to use it when it is installed. More in
[AI workflow](./ai-workflow.md#optional-a-code-graph-for-the-agents).

## Starting your own project

Create your repository from this one: on GitHub with **Use this template**, or clone it, delete
`.git` and run `git init`. Then go through this list. Each group fits in one commit, and
`npm run validate:full` should pass after each.

**1. Name and owner**

- `package.json`: change `name`, and set `version` to `0.0.0`. Set the version in
  `.release-please-manifest.json` to `0.0.0` too.
- Delete `CHANGELOG.md`: it describes releases of the template. release-please starts a new one
  with your first release.
- `LICENSE`: put in your name and the year, or choose another license.
- `.github/CODEOWNERS`: replace `@MarlenaMakosza` with your account.
- `README.md`, `docs/index.md` and `docs/pl/index.md`: the title, the description, the
  `git clone` URL and the link to the docs site.
- `.vitepress/config.ts`: `title` and `description`.

**2. Example code: replace it with your first feature**

The examples are the patterns that the agents follow, so keep each one until your own code
replaces it.

- The greeting: `apps/api/src/greet.ts`, `apps/api/tests/unit/greet.test.ts`, the `/api/greeting`
  route in `apps/api/src/server/app.ts` and its tests, the greeting scenarios in
  `tests/e2e/features/http-api.feature` and `docs/edge-cases/greeting.md`. Keep `/api/health`, the
  server fixture and the steps in `tests/e2e/steps/`: they fit any API. The roles, `AGENTS.md` and
  the docs name these files as style references: `git grep -n -E "greet|http-api"` lists every place
  to update.
- The database: the `users` table in `apps/api/src/db/schema.ts`, the migrations in
  `apps/api/drizzle/`, `apps/api/dev/db/seed.ts` and `apps/api/tests/integration/db/users.test.ts`.
  Delete `apps/api/drizzle/` and run `npm run db:generate` once your schema is in place, so the
  first migration is yours.
- `apps/api/dev/logger-example.ts` and the `example:logger` script: delete them once you know the
  logger.
- `.archgate/adrs/GEN-001-example.md`: delete it. Keep `ARCH-001` and `ARCH-002` for as long as
  they hold.

**3. Docs about the template**

- `docs/architecture/`: the arc42 pages describe the template. Rewrite the introduction and goals,
  the context, and the glossary for your project; keep the conventions and the decisions you
  still follow. See [Architecture](./architecture/index.md) for which sections pay off.
- Polish docs: if you do not need them, delete `docs/pl/` and the `pl` entry in `locales` in
  `.vitepress/config.ts`.

**4. Parts you may not need**

- No database: delete `apps/api/src/db/`, `apps/api/dev/db/`, `apps/api/drizzle/`,
  `apps/api/drizzle.config.ts`, `apps/api/docker-compose.yml`, `apps/api/tests/integration/` and
  `apps/api/vitest.integration.config.ts`; the `db:*`, `seed:dev` and `test:integration` scripts,
  and the database steps in `firstrun:dev`; the `integration` job in `.github/workflows/ci.yml`;
  `DATABASE_URL` in `apps/api/src/env.ts` and `apps/api/.env.example`; and the Drizzle, postgres and
  Testcontainers packages. knip then lists what is left over.
- No AI agents: see [Removing the AI setup](./ai-workflow.md#removing-the-ai-setup).

**5. Check**

Run `npm run validate:full` and `npm run format:check`, then apply the
[GitHub settings](#github-settings).

## Every day

```sh
npm run dev             # start the server (http://localhost:3000) and restart it on every change
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

release-please needs a few repository settings: see [GitHub settings](#github-settings).

## GitHub settings

If you host the project on GitHub, set these once in the repository settings.

**Settings → General → Pull Requests**

- Turn off **Allow merge commits** and **Allow rebase merging**, and keep **Allow squash merging**.
- Under squash merging, set **Default commit message** to **Pull request title and description**.
- Turn on **Automatically delete head branches**.

With these settings, every pull request lands on `main` as one commit: the pull request title is
its first line and the description is its body. It gets one entry in `CHANGELOG.md`. So:

- **The pull request title must be a Conventional Commit** (`feat: …`, `fix: …`, `docs: …`): it
  decides the next version.
- The `Assisted-by` lines at the end of the description become trailers of that commit, so the
  [AI statistics](./ai-workflow.md#ai-attribution-and-statistics) can count them.
- Write `BREAKING CHANGE:` in the description only for a real breaking change: it bumps the major
  version. A merge
  commit would put every change in the CHANGELOG twice: once for the commit, and once for the merge
  commit, which repeats the pull request title.

**Settings → Pages → Build and deployment**

- Set **Source** to **GitHub Actions**. The Docs workflow (`.github/workflows/pages.yml`) then
  publishes this documentation on every push to `main`.

**Settings → Actions → General → Workflow permissions**

- Turn on **Allow GitHub Actions to create and approve pull requests**. Without it, release-please
  cannot open the release pull request.

**Settings → Advanced Security**

`npm run security:audit` and `eslint-plugin-security` need no setting. `SECURITY.md` needs one:

- Turn on **Private vulnerability reporting**. `SECURITY.md` asks people to report a vulnerability
  privately, with **Security → Report a vulnerability**. Without this setting, that button does not
  exist.
- Optional: **Dependabot alerts**. GitHub then lists known vulnerabilities in every dependency,
  the development tools included; `npm run security:audit` checks only the runtime dependencies
  (see [Quality gates](./quality-gates.md)). Expect a few dozen alerts at once, almost all in
  development tools that never run in production, and an email for each by default. Turn the
  emails off in your personal **Settings → Notifications → Dependabot alerts**. Leave
  **Dependabot security updates** off: it opens a pull request for each fix, and `npm run update-dependencies`
  updates the dependencies.

**Settings → Rules → Rulesets** (or **Settings → Branches**), for `main`

- Require a pull request before merging, and require the CI checks `validate`, `integration`, `mutation` and `e2e`
  to pass. `validate` includes `npm run security:audit`.
- CI does not run on the release pull request, because GitHub does not start workflows for changes
  made with the default `GITHUB_TOKEN`. With required checks, add yourself to the bypass list, or
  give release-please a personal access token (the `token` input of the action).

After a merge, GitHub deletes the remote branch, but your local copy stays. Delete it too, or the
next `git push --all` brings it back:

```sh
git switch main && git pull
git fetch --prune
git branch -D <branch>   # -D: after a squash merge, git does not see the branch as merged
```

## Project structure

```text
apps/api/             the backend: an HTTP API with Hono
  src/                application code
    db/               Drizzle schema and client
    server/           the Hono app and its routes
  tests/unit/         Vitest unit tests
  tests/integration/  Vitest tests against a real database (Testcontainers, needs Docker)
  drizzle/            database migrations, generated by npm run db:generate
  dev/db/             migration and seed scripts
tests/e2e/features/   Gherkin scenarios (the specification)
tests/e2e/steps/      step definitions and fixtures
dev/quality/          CRAP gate, shared by all apps
docs/                 this documentation (VitePress); Polish version in docs/pl/
.archgate/adrs/       architecture decision records
.agents/roles/        role instructions for AI agents
.claude/              Claude Code adapter (hooks, permissions, subagents)
.github/              CI workflows, code owners, pull request template
```

The repository is an npm workspaces monorepo. Each app in `apps/` has its own `package.json`, its
dependencies, its Vitest and Stryker configs and its own scripts. The root holds what all apps
share: ESLint, Prettier, cspell, knip, jscpd, Archgate, the git hooks, the Gherkin scenarios and
the docs. Run the root scripts: they run the same script in every app (`--workspaces`), or in one
app (`-w apps/api`).
