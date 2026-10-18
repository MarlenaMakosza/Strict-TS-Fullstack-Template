# Scripts

Run each one with `npm run <name>`. The ones you need most often:

- `dev`: start the server from `src/index.ts` and restart it on every change.
- `validate`: all fast quality gates. Also runs in CI.
- `validate:full`: every gate, including mutation testing, the Gherkin scenarios and the docs
  build. See [Quality gates](./quality-gates.md).
- `autofix`: fix lint and formatting problems that have an automatic fix.

## All scripts

| Script                                               | Command                                                                                                                                |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`                                                | `node --watch src/index.ts`                                                                                                            |
| `build`                                              | `tsc --project tsconfig.build.json` + `css:build` (into `dist/`)                                                                       |
| `css:build` / `css:watch`                            | Tailwind CLI: `src/styles/app.css` → `dist/app.css`                                                                                    |
| `start`                                              | `node dist/index.js`                                                                                                                   |
| `prepare`                                            | husky (installs hooks after `npm install`)                                                                                             |
| `validate`                                           | lint + ts-check + spellcheck + knip + test:coverage + quality:crap + quality:duplication + check:adrs                                  |
| `validate:full`                                      | validate + security:audit + test:integration + test:mutation (`--force`) + test:e2e + docs:build                                       |
| `security:audit`                                     | `npm audit --omit=dev --audit-level=high`: fails on a known high or critical vulnerability in a runtime dependency (needs the network) |
| `lint` / `lint:fix`                                  | ESLint (`--max-warnings 0`)                                                                                                            |
| `format` / `format:check`                            | Prettier (`--write` / `--check` for CI)                                                                                                |
| `autofix`                                            | lint:fix + format                                                                                                                      |
| `ts-check`                                           | `tsc --noEmit`                                                                                                                         |
| `spellcheck`                                         | cspell                                                                                                                                 |
| `knip`                                               | knip                                                                                                                                   |
| `test` / `test:watch`                                | `vitest run` / `vitest`                                                                                                                |
| `test:unit` / `test:unit:watch`                      | Vitest for `tests/unit` only                                                                                                           |
| `test:coverage`                                      | `vitest run --coverage`                                                                                                                |
| `test:mutation`                                      | `stryker run`                                                                                                                          |
| `test:integration`                                   | `vitest run --config vitest.integration.config.ts`: tests against real services in containers (needs Docker)                           |
| `test:e2e` / `test:e2e:open`                         | `bddgen` + `playwright test` / with `--ui`                                                                                             |
| `quality:crap`                                       | CRAP from `coverage/coverage-final.json`                                                                                               |
| `quality:duplication`                                | jscpd                                                                                                                                  |
| `commitlint`                                         | `commitlint --edit` (`commit-msg` hook)                                                                                                |
| `check:adrs`                                         | archgate check                                                                                                                         |
| `docs:api`                                           | TypeDoc                                                                                                                                |
| `docs:dev` / `docs:build` / `docs:preview`           | VitePress                                                                                                                              |
| `db:start`                                           | docker compose up                                                                                                                      |
| `db:generate` / `db:migrate` / `db:sync`             | drizzle-kit generate (date-stamped names via `migrations.prefix`) / `dev/db/migrate.ts` / generate + migrate                           |
| `db:studio` / `db:push` / `db:check`                 | drizzle-kit studio / push / check                                                                                                      |
| `seed:dev`                                           | `dev/db/seed.ts`                                                                                                                       |
| `example:logger`                                     | `node dev/logger-example.ts`: examples of logging with `src/logger.ts`                                                                 |
| `firstrun:dev`                                       | install + ts-check + docker + db:sync + seed                                                                                           |
| `list-outdated-dependencies` / `update-dependencies` | npm-check-updates                                                                                                                      |
| `clean`                                              | `rimraf node_modules dist coverage reports .stryker-tmp`                                                                               |
