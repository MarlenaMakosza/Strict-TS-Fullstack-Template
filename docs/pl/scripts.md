# Skrypty

Każdy uruchamiasz z katalogu głównego przez `npm run <nazwa>`. Większość odpala ten sam skrypt w
każdej aplikacji w `apps/` (`--workspaces`) albo w jednej (`-w apps/api`); tabela mówi, który. Najczęściej potrzebne:

- `dev`: uruchamia API i aplikację webową i odświeża je po każdej zmianie. Otwórz
  `http://localhost:5173`.
- `validate`: wszystkie szybkie bramki jakości. Uruchamia się też w CI.
- `validate:full`: wszystkie bramki, razem z mutation testing, scenariuszami Gherkin i budowaniem
  dokumentacji. Zobacz [Bramki jakości](./quality-gates.md).
- `autofix`: poprawia błędy wykryte przez ESLint i Prettier, jeśli mają automatyczną poprawkę.

## Wszystkie skrypty

| Skrypt                                               | Polecenie                                                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`                                                | API (`node --watch src/index.ts` w `apps/api`) i aplikacja webowa (`vite` w `apps/web`) razem, przez concurrently                           |
| `build`                                              | w każdej aplikacji: `tsc --project tsconfig.build.json` w `apps/api` (do `apps/api/dist/`), `vite build` w `apps/web` (do `apps/web/dist/`) |
| `start`                                              | w `apps/api`: `node dist/index.js`                                                                                                          |
| `prepare`                                            | husky (instaluje hooki po `npm install`)                                                                                                    |
| `validate`                                           | lint + ts-check + spellcheck + knip + test:coverage + quality:crap + quality:duplication + quality:one-react + check:adrs                   |
| `validate:full`                                      | validate + security:audit + test:integration + test:mutation (`--force`) + test:e2e + build + docs:api + docs:build                         |
| `security:audit`                                     | `npm audit --omit=dev --audit-level=high`: błąd przy znanej podatności o wysokiej albo krytycznej wadze w zależności runtime (wymaga sieci) |
| `lint` / `lint:fix`                                  | ESLint (`--max-warnings 0`)                                                                                                                 |
| `format` / `format:check`                            | Prettier (`--write` / `--check` do CI)                                                                                                      |
| `autofix`                                            | lint:fix + format                                                                                                                           |
| `ts-check`                                           | `tsc --noEmit` dla plików w katalogu głównym, potem w każdej aplikacji                                                                      |
| `spellcheck`                                         | cspell                                                                                                                                      |
| `knip`                                               | knip                                                                                                                                        |
| `test` / `test:watch`                                | `vitest run` dla wspólnych narzędzi, potem w każdej aplikacji / `vitest` tylko w `apps/api`                                                 |
| `test:unit` / `test:unit:watch`                      | w każdej aplikacji: Vitest tylko dla `tests/unit`                                                                                           |
| `test:coverage`                                      | testy narzędzi, potem `vitest run --coverage` w każdej aplikacji                                                                            |
| `test:mutation`                                      | w każdej aplikacji: `stryker run`; `npm run test:mutation -- --force` przekazuje `--force` dalej                                            |
| `test:integration`                                   | w każdej aplikacji: `vitest run --config vitest.integration.config.ts`, testy na prawdziwych usługach w kontenerach (wymaga Dockera)        |
| `test:e2e` / `test:e2e:open`                         | `bddgen` + `playwright test` / z `--ui`                                                                                                     |
| `quality:crap`                                       | w każdej aplikacji: CRAP z jej `coverage/coverage-final.json`                                                                               |
| `quality:duplication`                                | jscpd                                                                                                                                       |
| `quality:one-react`                                  | `dev/quality/one-version.ts react react-dom`: błąd, gdy zainstalowane są dwie wersje Reacta                                                 |
| `commitlint`                                         | `commitlint --edit` (hook `commit-msg`)                                                                                                     |
| `check:adrs`                                         | archgate check                                                                                                                              |
| `docs:api`                                           | TypeDoc dla `apps/api`, `apps/web` i `packages/shared` (każde ma `typedoc.json`), do `docs/api/public` i `docs/api/internal`                |
| `docs:dev` / `docs:build` / `docs:preview`           | VitePress                                                                                                                                   |
| `db:start`                                           | w `apps/api`: docker compose up                                                                                                             |
| `db:generate` / `db:migrate` / `db:sync`             | w `apps/api`: drizzle-kit generate (nazwy z datą przez `migrations.prefix`) / `dev/db/migrate.ts` / generate + migrate                      |
| `db:studio` / `db:push` / `db:check`                 | w `apps/api`: drizzle-kit studio / push / check                                                                                             |
| `seed:dev`                                           | w `apps/api`: `dev/db/seed.ts`                                                                                                              |
| `example:logger`                                     | w `apps/api`: `node dev/logger-example.ts`, przykłady logowania przez `src/logger.ts`                                                       |
| `firstrun:dev`                                       | install + Chromium dla scenariuszy w przeglądarce + ts-check, potem w `apps/api`: docker + db:sync + seed                                   |
| `list-outdated-dependencies` / `update-dependencies` | npm-check-updates, dla katalogu głównego i każdej aplikacji                                                                                 |
| `clean`                                              | `rimraf` dla `node_modules`, `dist`, `coverage`, `reports` i `.stryker-tmp`, w katalogu głównym i w każdej aplikacji                        |
