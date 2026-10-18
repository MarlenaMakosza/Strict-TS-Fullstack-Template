# Scripts

Run each one from the root with `npm run <name>`. Most of them run the same script in every app
in `apps/` (`--workspaces`), or in one app (`-w apps/api`); the table says which. The ones you need most often:

- `dev`: start the API and the web app, and reload them on every change. Open
  `http://localhost:5173`.
- `validate`: all fast quality gates. Also runs in CI.
- `validate:full`: every gate, including mutation testing, the Gherkin scenarios and the docs
  build. See [Quality gates](./quality-gates.md).
- `autofix`: fix lint and formatting problems that have an automatic fix.

## All scripts

| Script                                               | Command                                                                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`                                                | the API (`node --watch src/index.ts` in `apps/api`) and the web app (`vite` in `apps/web`) together, with concurrently                      |
| `build`                                              | in every app: `tsc --project tsconfig.build.json` in `apps/api` (into `apps/api/dist/`), `vite build` in `apps/web` (into `apps/web/dist/`) |
| `start`                                              | in `apps/api`: `node dist/index.js`                                                                                                         |
| `prepare`                                            | husky (installs hooks after `npm install`)                                                                                                  |
| `validate`                                           | lint + ts-check + spellcheck + knip + test:coverage + quality:crap + quality:duplication + check:adrs                                       |
| `validate:full`                                      | validate + security:audit + test:integration + test:mutation (`--force`) + test:e2e + docs:build                                            |
| `security:audit`                                     | `npm audit --omit=dev --audit-level=high`: fails on a known high or critical vulnerability in a runtime dependency (needs the network)      |
| `lint` / `lint:fix`                                  | ESLint (`--max-warnings 0`)                                                                                                                 |
| `format` / `format:check`                            | Prettier (`--write` / `--check` for CI)                                                                                                     |
| `autofix`                                            | lint:fix + format                                                                                                                           |
| `ts-check`                                           | `tsc --noEmit` for the root files, then in every app                                                                                        |
| `spellcheck`                                         | cspell                                                                                                                                      |
| `knip`                                               | knip                                                                                                                                        |
| `test` / `test:watch`                                | `vitest run` for the shared tooling, then in every app / `vitest` in `apps/api` only                                                        |
| `test:unit` / `test:unit:watch`                      | in every app: Vitest for `tests/unit` only                                                                                                  |
| `test:coverage`                                      | the tooling tests, then `vitest run --coverage` in every app                                                                                |
| `test:mutation`                                      | in every app: `stryker run`; `npm run test:mutation -- --force` passes `--force` on                                                         |
| `test:integration`                                   | in every app: `vitest run --config vitest.integration.config.ts`, tests against real services in containers (needs Docker)                  |
| `test:e2e` / `test:e2e:open`                         | `bddgen` + `playwright test` / with `--ui`                                                                                                  |
| `quality:crap`                                       | in every app: CRAP from its `coverage/coverage-final.json`                                                                                  |
| `quality:duplication`                                | jscpd                                                                                                                                       |
| `commitlint`                                         | `commitlint --edit` (`commit-msg` hook)                                                                                                     |
| `check:adrs`                                         | archgate check                                                                                                                              |
| `docs:api`                                           | TypeDoc                                                                                                                                     |
| `docs:dev` / `docs:build` / `docs:preview`           | VitePress                                                                                                                                   |
| `db:start`                                           | in `apps/api`: docker compose up                                                                                                            |
| `db:generate` / `db:migrate` / `db:sync`             | in `apps/api`: drizzle-kit generate (date-stamped names via `migrations.prefix`) / `dev/db/migrate.ts` / generate + migrate                 |
| `db:studio` / `db:push` / `db:check`                 | in `apps/api`: drizzle-kit studio / push / check                                                                                            |
| `seed:dev`                                           | in `apps/api`: `dev/db/seed.ts`                                                                                                             |
| `example:logger`                                     | in `apps/api`: `node dev/logger-example.ts`, examples of logging with `src/logger.ts`                                                       |
| `firstrun:dev`                                       | install + ts-check, then in `apps/api`: docker + db:sync + seed                                                                             |
| `list-outdated-dependencies` / `update-dependencies` | npm-check-updates, for the root and every app                                                                                               |
| `clean`                                              | `rimraf` of `node_modules`, `dist`, `coverage`, `reports` and `.stryker-tmp`, at the root and in every app                                  |
