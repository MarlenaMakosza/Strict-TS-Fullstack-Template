# Getting started

## Requirements

- Node.js 24 (the version is in `.nvmrc`; `npm install` refuses an older one), with the npm
  version from `packageManager` in `package.json` (Renovate updates it)
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
  **Dependabot security updates** off: it opens a pull request for each fix, and Renovate already
  updates the dependencies.

**Settings → Rules → Rulesets** (or **Settings → Branches**), for `main`

- Require a pull request before merging, and require the CI checks `validate`, `mutation` and `e2e`
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
