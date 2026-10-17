# Skrypty

Każdy uruchamiasz przez `npm run <nazwa>`. Najczęściej potrzebne:

- `dev`: uruchamia `src/index.ts` i restartuje go po każdej zmianie.
- `validate`: wszystkie szybkie bramki jakości. Uruchamia się też w CI.
- `validate:full`: wszystkie bramki, razem z mutation testing, scenariuszami Gherkin i budowaniem
  dokumentacji. Zobacz [Bramki jakości](./quality-gates.md).
- `autofix`: poprawia błędy wykryte przez ESLint i Prettier, jeśli mają automatyczną poprawkę.

## Wszystkie skrypty

| Skrypt                                               | Polecenie                                                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`                                                | `node --watch src/index.ts`                                                                                                                 |
| `build`                                              | `tsc --project tsconfig.build.json` + `css:build` (do `dist/`)                                                                              |
| `css:build` / `css:watch`                            | Tailwind CLI: `src/styles/app.css` → `dist/app.css`                                                                                         |
| `start`                                              | `node dist/index.js`                                                                                                                        |
| `prepare`                                            | husky (instaluje hooki po `npm install`)                                                                                                    |
| `validate`                                           | lint + ts-check + spellcheck + knip + test:coverage + quality:crap + quality:duplication + check:adrs                                       |
| `validate:full`                                      | validate + security:audit + test:integration + test:mutation (`--force`) + test:e2e + docs:build                                            |
| `security:audit`                                     | `npm audit --omit=dev --audit-level=high`: błąd przy znanej podatności o wysokiej albo krytycznej wadze w zależności runtime (wymaga sieci) |
| `lint` / `lint:fix`                                  | ESLint (`--max-warnings 0`)                                                                                                                 |
| `format` / `format:check`                            | Prettier (`--write` / `--check` do CI)                                                                                                      |
| `autofix`                                            | lint:fix + format                                                                                                                           |
| `ts-check`                                           | `tsc --noEmit`                                                                                                                              |
| `spellcheck`                                         | cspell                                                                                                                                      |
| `knip`                                               | knip                                                                                                                                        |
| `test` / `test:watch`                                | `vitest run` / `vitest`                                                                                                                     |
| `test:unit` / `test:unit:watch`                      | Vitest tylko dla `tests/unit`                                                                                                               |
| `test:coverage`                                      | `vitest run --coverage`                                                                                                                     |
| `test:mutation`                                      | `stryker run`                                                                                                                               |
| `test:integration`                                   | `vitest run --config vitest.integration.config.ts`: testy na prawdziwych usługach w kontenerach (wymaga Dockera)                            |
| `test:e2e` / `test:e2e:open`                         | `bddgen` + `playwright test` / z `--ui`                                                                                                     |
| `quality:crap`                                       | CRAP na podstawie `coverage/coverage-final.json`                                                                                            |
| `quality:duplication`                                | jscpd                                                                                                                                       |
| `commitlint`                                         | `commitlint --edit` (hook `commit-msg`)                                                                                                     |
| `check:adrs`                                         | archgate check                                                                                                                              |
| `docs:api`                                           | TypeDoc                                                                                                                                     |
| `docs:dev` / `docs:build` / `docs:preview`           | VitePress                                                                                                                                   |
| `db:start`                                           | docker compose up                                                                                                                           |
| `db:generate` / `db:migrate` / `db:sync`             | drizzle-kit generate (nazwy z datą przez `migrations.prefix`) / `dev/db/migrate.ts` / generate + migrate                                    |
| `db:studio` / `db:push` / `db:check`                 | drizzle-kit studio / push / check                                                                                                           |
| `seed:dev`                                           | `dev/db/seed.ts`                                                                                                                            |
| `example:logger`                                     | `node dev/logger-example.ts`: przykłady logowania przez `src/logger.ts`                                                                     |
| `firstrun:dev`                                       | install + ts-check + docker + db:sync + seed                                                                                                |
| `list-outdated-dependencies` / `update-dependencies` | npm-check-updates                                                                                                                           |
| `clean`                                              | `rimraf node_modules dist coverage reports .stryker-tmp`                                                                                    |
