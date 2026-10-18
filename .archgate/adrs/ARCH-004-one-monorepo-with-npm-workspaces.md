---
id: ARCH-004
title: One monorepo with npm workspaces
domain: architecture
rules: false
files: ['apps/**', 'package.json']
---

# One monorepo with npm workspaces

## Context

The template grows from a backend into a fullstack app: an HTTP API now, a React and Vite
frontend next. The two could live in two repositories or in one.

Options considered:

- **Two repositories**, joined by the OpenAPI contract. Each stays small and usable alone, but a
  feature that touches the API and the UI, which is most of them, needs two pull requests, every
  gate is configured twice, and an agent sees only half of the system.
- **One monorepo with npm workspaces**. One clone and one pull request per feature; the gates,
  the agent rules and the Gherkin scenarios are shared. npm workspaces come with npm, so no new
  tool is needed. Chosen.
- **A monorepo tool** (Turborepo, Nx): task caching and affected-only runs. Not needed while the
  repository has two apps; add one when CI gets slow.

## Decision

- Each app lives in `apps/<name>/` with its own `package.json`, dependencies, scripts, Vitest
  config, coverage threshold and Stryker config. The backend is `apps/api`.
- The root holds what every app shares: ESLint, Prettier, cspell, knip, jscpd, Archgate, the git
  hooks, commitlint, release-please, the Gherkin scenarios in `tests/e2e/`, the CRAP gate in
  `dev/quality/` and the docs.
- Root scripts are the entry point. They run the same script in every app (`--workspaces
--if-present`) or in one app (`-w apps/api`), so CI and the agents keep using `npm run …` at
  the root.
- Shared development tools are root dev dependencies; an app lists only what it uses itself.
- The repository has one version and one `CHANGELOG.md`; the apps are private and unversioned.

## Do's and Don'ts

- **Do** run scripts from the root.
- **Do** put a dependency in the app that imports it.
- **Don't** import from another app's `src/`. Share code through a package in `packages/` once
  there is something to share.
- **Don't** add a monorepo tool before the gates are measurably slow.

## Consequences

- A project without a frontend deletes `apps/web` once it exists; a project without a backend
  deletes `apps/api`.
- Paths in the docs and the agent rules name the app (`apps/api/src/…`).
