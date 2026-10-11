# Czysty start projektu (TypeScript)

Uniwersalny zestaw narzędzi dla projektu w czystym TypeScript, bez frameworka.
Wybrany z `tools.md`. Pozycje oznaczone `*` są spoza tej listy.

## Język i runtime

| Narzędzie | Rola |
|---|---|
| TypeScript | Język, `tsc` jako sprawdzanie typów i build |
| Node.js | Runtime, uruchamia `.ts` bezpośrednio (type stripping) |
| Zod | Walidacja danych na granicach (API, pliki, env) |
| dotenv | Ładowanie zmiennych z `.env` |

## Baza danych

| Narzędzie | Rola |
|---|---|
| PostgreSQL (Docker) | Baza (`docker-compose.yml`) |
| Docker Compose | Uruchamianie bazy (`npm run db:start`) |
| `drizzle-orm` | ORM |
| `drizzle-kit` | Migracje, studio (`drizzle.config.ts`) |
| `postgres` | Sterownik PostgreSQL |
| `@faker-js/faker` | Dane seedujące (`dev/db/seed*.ts`) |

## Style

| Narzędzie | Rola |
|---|---|
| Tailwind CSS v4 (`tailwindcss`) | Klasy utility; konfiguracja w CSS (`src/styles/app.css`, `@theme`), bez `tailwind.config.js` |
| `@tailwindcss/cli` | Buduje `dist/app.css` (`css:build`, `css:watch`) |

## Lintery i formatowanie

| Narzędzie | Rola |
|---|---|
| ESLint | Linter |
| `@eslint/js` | Reguły bazowe JS |
| `typescript-eslint` | Reguły TS, type-aware (`strictTypeChecked`) |
| `@eslint/json` | Pliki JSON |
| `@eslint/markdown` | Pliki Markdown |
| `eslint-plugin-unicorn` | Dobre praktyki, nowoczesne API |
| `eslint-plugin-sonarjs` | Code smells, złożoność, duplikaty |
| `eslint-plugin-import-x` + `eslint-import-resolver-typescript` | Cykle, błędne i zbędne importy |
| `eslint-plugin-perfectionist` | Sortowanie importów, kluczy, unii |
| `eslint-plugin-promise` | Błędy z Promise |
| `eslint-plugin-drizzle`, Drizzle, PostgreSQL, Testcontainers, Faker | Zależne od projektu (baza danych) |
| `eslint-plugin-n` | Reguły Node.js |
| `eslint-plugin-security` | Wzorce bezpieczeństwa |
| `eslint-plugin-regexp` `*` | Błędne i wolne wyrażenia regularne |
| `eslint-plugin-tsdoc` | Składnia komentarzy TSDoc |
| `@eslint-community/eslint-plugin-eslint-comments` | Pilnuje `eslint-disable` (rozwijana wersja `eslint-plugin-eslint-comments`) |
| `@vitest/eslint-plugin` | Reguły dla testów |
| `globals` | Definicje globali |
| Prettier | Formatowanie |
| `eslint-config-prettier` | Wyłącza reguły ESLint kolidujące z Prettier |
| cspell | Spellcheck wszystkich plików (nie tylko lintowanych) |
| knip `*` | Nieużywane pliki, eksporty i zależności |
| `eslint-plugin-better-tailwindcss` `*` | Klasy Tailwind w TS i `@apply`: nieznane, zdublowane, konfliktowe, kolejność |
| `@eslint/css` + `tailwind-csstree` `*` | Lintowanie plików CSS (ze składnią Tailwind v4) |

### Opcjonalne lintery

| Narzędzie | Kiedy |
|---|---|
| `eslint-plugin-functional` | Gdy zespół chce wymusić niemutowalność; bardzo restrykcyjny |
| `@dword-design/eslint-plugin-import-alias` | Gdy projekt używa aliasów ścieżek |
| `eslint-plugin-boundaries` | Gdy projekt ma warstwy (np. domain / application / infrastructure); pilnuje, kto może importować z kogo |

## Testy

| Narzędzie | Rola |
|---|---|
| Vitest | Test runner |
|`@testcontainers/postgresql` | PostgreSQL w kontenerze dla testów |
| `@vitest/coverage-v8` `*` | Pokrycie testami |
| Cypress | Testy end-to-end (`cypress.config.ts`) |
| Gherkin | Scenariusze BDD z perspektywy użytkownika (`.feature`, Given/When/Then), uruchamiane w Cypress |
| `@badeball/cypress-cucumber-preprocessor` | Uruchamia scenariusze Gherkin (`.feature`) w Cypress, mapuje kroki na definicje w TS |
| Stryker (`@stryker-mutator/core`) | Mutation testing: celowo psuje kod i sprawdza, czy testy to wykryją (mutation score zamiast samego coverage) |
| Stryker command runner (wbudowany w core) | Odpala `vitest run` dla każdego mutanta. `@stryker-mutator/vitest-runner` jest szybszy, ale nie działa z Vitest 5 (stryker-js #6210); wróć do niego po poprawce |
| jscpd `*` | Duplikacja kodu (`.jscpd.json`), bramka w `validate`: żaden klon niedozwolony |
| CRAP (`dev/quality/crap.ts`) `*` | Złożoność (ESLint `complexity`) × brak pokrycia (Vitest coverage); bramka w `validate`, próg 30 na funkcję |

## Git i CI

| Narzędzie | Rola |
|---|---|
| Husky | Hooki gita |
| lint-staged | Lint i format tylko zmienionych plików przy commicie |
| commitlint + `@commitlint/config-conventional` | Conventional Commits |
| GitHub Actions | CI: `validate`, mutation testing i e2e na każdym PR; opcjonalne AI review innym modelem (etykieta `ai-review`, OpenRouter) |

## Utrzymanie

| Narzędzie | Rola |
|---|---|
| Renovate `*` lub npm-check-updates | Aktualizacja zależności |
| rimraf | `npm run clean` działający też na Windowsie |

## Dokumentacja i architektura

| Narzędzie | Rola |
|---|---|
| TypeDoc | API docs z komentarzy TSDoc |
| VitePress | Strona z dokumentacją (arc42, ADR) |
| Archgate | Egzekwowanie ADR w kodzie |

## Skrypty npm

| Skrypt | Polecenie |
|---|---|
| `dev` | `node --watch src/index.ts` |
| `build` | `tsc --project tsconfig.build.json` + `css:build` (do `dist/`) |
| `css:build` / `css:watch` | Tailwind CLI: `src/styles/app.css` → `dist/app.css` |
| `start` | `node dist/index.js` |
| `prepare` | husky (instaluje hooki po `npm install`) |
| `validate` | lint + ts-check + spellcheck + knip + test:coverage + quality:crap + quality:duplication + check:adrs |
| `validate:full` | validate + test:mutation (`--force`) + test:e2e + docs:build |
| `lint` / `lint:fix` | ESLint (`--max-warnings 0`) |
| `format` / `format:check` | Prettier (`--write` / `--check` do CI) |
| `autofix` | lint:fix + format |
| `ts-check` | `tsc --noEmit` |
| `spellcheck` | cspell |
| `knip` | knip |
| `test` / `test:watch` | `vitest run` / `vitest` |
| `test:unit` / `test:unit:watch` | Vitest tylko dla `tests/unit` |
| `test:coverage` | `vitest run --coverage` |
| `test:mutation` | `stryker run` |
| `test:e2e` / `test:e2e:open` | `cypress run` / `cypress open` |
| `quality:crap` | CRAP na podstawie `coverage/coverage-final.json` |
| `quality:duplication` | jscpd |
| `commitlint` | `commitlint --edit` (hook `commit-msg`) |
| `check:adrs` | archgate check |
| `docs:api` | TypeDoc |
| `docs:dev` / `docs:build` / `docs:preview` | VitePress |
| `db:start` | docker compose up |
| `db:generate` / `db:migrate` / `db:sync` | drizzle-kit generate (nazwy z datą przez `migrations.prefix`) / `dev/db/migrate.ts` / generate + migrate |
| `db:studio` / `db:push` / `db:check` | drizzle-kit studio / push / check |
| `seed:dev` | `dev/db/seed.ts` |
| `firstrun:dev` | install + ts-check + docker + db:sync + seed |
| `list-outdated-dependencies` / `update-dependencies` | npm-check-updates |
| `clean` | `rimraf node_modules dist coverage reports .stryker-tmp` |

## Pomiń/opcjonalne

| Narzędzie | Powód |
|---|---|
| Svelte, SvelteKit, `svelte-check`, `eslint-plugin-svelte`, `prettier-plugin-svelte`, `@testing-library/*` | Specyficzne dla frameworka |
| `@html-eslint/*` | Brak plików HTML w czystym TS |
| `@stylistic/eslint-plugin` | Dubluje Prettier |
| `prettier-plugin-organize-imports` | Dubluje perfectionist |
| `@cspell/eslint-plugin` | Dubluje cspell CLI |
| `eslint-plugin-eslint-plugin` | Tylko do pisania własnych reguł ESLint |
| skott | knip + import-x pokrywają większość, ale do wglądu do grafów|
