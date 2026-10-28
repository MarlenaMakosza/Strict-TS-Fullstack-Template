# Narzędzia

Wszystkie narzędzia w szablonie i do czego służą. Pozycje oznaczone `*` wykraczają poza typowy
zestaw dla projektu w czystym TypeScript. Komendy, które je uruchamiają, są w
[Skryptach](./scripts.md). Jak sprawdzenia działają razem, opisują [Bramki jakości](./quality-gates.md).

## Język i runtime

| Narzędzie               | Rola                                                                          |
| ----------------------- | ----------------------------------------------------------------------------- |
| TypeScript              | Język, `tsc` jako sprawdzanie typów i build                                   |
| Node.js                 | Runtime, uruchamia `.ts` bezpośrednio (type stripping)                        |
| Zod                     | Walidacja danych na granicach (API, pliki, env)                               |
| Hono `*`                | Trasy HTTP pod `/api/` (`apps/api/src/server/app.ts`, ADR ARCH-003)           |
| `@hono/node-server` `*` | Uruchamia aplikację Hono na Node.js (`apps/api/src/index.ts`)                 |
| `@hono/zod-openapi` `*` | Sprawdza trasy przez Zod i buduje `/api/openapi.json` z tych samych schematów |
| dotenv                  | Ładowanie zmiennych z `.env`                                                  |
| pino `*`                | Logowanie strukturalne (`apps/api/src/logger.ts`, ADR ARCH-002)               |
| pino-pretty `*`         | Czytelne logi w development                                                   |

## Baza danych

| Narzędzie           | Rola                                            |
| ------------------- | ----------------------------------------------- |
| PostgreSQL (Docker) | Baza (`apps/api/docker-compose.yml`)            |
| Docker Compose      | Uruchamianie bazy (`npm run db:start`)          |
| `drizzle-orm`       | ORM                                             |
| `drizzle-kit`       | Migracje, studio (`apps/api/drizzle.config.ts`) |
| `postgres`          | Sterownik PostgreSQL                            |
| `@faker-js/faker`   | Dane seedujące (`apps/api/dev/db/seed*.ts`)     |

## Frontend

| Narzędzie                                                                | Rola                                                                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| React `*`                                                                | Biblioteka UI (`apps/web`, ADR ARCH-005)                                                         |
| Vite `*` + `@vitejs/plugin-react`                                        | Serwer deweloperski i build; w trybie development przekazuje `/api` do backendu                  |
| Tailwind CSS v4 + `@tailwindcss/vite`                                    | Klasy utility; konfiguracja w CSS (`apps/web/src/index.css`, `@theme`), bez `tailwind.config.js` |
| Testing Library (`@testing-library/react`, `user-event`, `jest-dom`) `*` | Testy komponentów, które szukają elementów po roli i etykiecie, jak użytkownik                   |
| jsdom `*`                                                                | DOM przeglądarki dla Vitest                                                                      |
| `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks` `*`           | Reguły Reacta i hooków                                                                           |
| concurrently `*`                                                         | `npm run dev` uruchamia razem API i aplikację webową                                             |

## Lintery i formatowanie

| Narzędzie                                                           | Rola                                                                         |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ESLint                                                              | Linter                                                                       |
| `@eslint/js`                                                        | Reguły bazowe JS                                                             |
| `typescript-eslint`                                                 | Reguły TS, type-aware (`strictTypeChecked`)                                  |
| `@eslint/json`                                                      | Pliki JSON                                                                   |
| `@eslint/markdown`                                                  | Pliki Markdown                                                               |
| `eslint-plugin-unicorn`                                             | Dobre praktyki, nowoczesne API                                               |
| `eslint-plugin-sonarjs`                                             | Code smells, złożoność, duplikaty                                            |
| `eslint-plugin-import-x` + `eslint-import-resolver-typescript`      | Cykle, błędne i zbędne importy                                               |
| `eslint-plugin-perfectionist`                                       | Sortowanie importów, kluczy, unii                                            |
| `eslint-plugin-promise`                                             | Błędy z Promise                                                              |
| `eslint-plugin-drizzle`, Drizzle, PostgreSQL, Testcontainers, Faker | Zależne od projektu (baza danych)                                            |
| `eslint-plugin-n`                                                   | Reguły Node.js                                                               |
| `eslint-plugin-security`                                            | Wzorce bezpieczeństwa                                                        |
| `eslint-plugin-regexp` `*`                                          | Błędne i wolne wyrażenia regularne                                           |
| `eslint-plugin-tsdoc`                                               | Składnia komentarzy TSDoc                                                    |
| `@eslint-community/eslint-plugin-eslint-comments`                   | Pilnuje `eslint-disable` (rozwijana wersja `eslint-plugin-eslint-comments`)  |
| `@vitest/eslint-plugin`                                             | Reguły dla testów                                                            |
| `globals`                                                           | Definicje globali                                                            |
| Prettier                                                            | Formatowanie                                                                 |
| `eslint-config-prettier`                                            | Wyłącza reguły ESLint kolidujące z Prettier                                  |
| cspell                                                              | Spellcheck wszystkich plików (nie tylko lintowanych)                         |
| knip `*`                                                            | Nieużywane pliki, eksporty i zależności                                      |
| `eslint-plugin-better-tailwindcss` `*`                              | Klasy Tailwind w TS i `@apply`: nieznane, zdublowane, konfliktowe, kolejność |
| `@eslint/css` + `tailwind-csstree` `*`                              | Lintowanie plików CSS (ze składnią Tailwind v4)                              |

### Opcjonalne lintery

| Narzędzie                                  | Kiedy                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `eslint-plugin-functional`                 | Gdy zespół chce wymusić niemutowalność; bardzo restrykcyjny                                             |
| `@dword-design/eslint-plugin-import-alias` | Gdy projekt używa aliasów ścieżek                                                                       |
| `eslint-plugin-boundaries`                 | Gdy projekt ma warstwy (np. domain / application / infrastructure); pilnuje, kto może importować z kogo |

## Testy

| Narzędzie                                 | Rola                                                                                                                                                            |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitest                                    | Test runner                                                                                                                                                     |
| fast-check                                | Testy property-based: generuje wiele wejść dla reguły i zmniejsza to, które nie przechodzi, do najmniejszego przykładu                                          |
| `@testcontainers/postgresql`              | PostgreSQL w kontenerze dla testów integracyjnych (`apps/api/tests/integration/`)                                                                               |
| `@vitest/coverage-v8` `*`                 | Pokrycie testami                                                                                                                                                |
| Playwright (`@playwright/test`)           | Testy end-to-end (`playwright.config.ts`)                                                                                                                       |
| Gherkin                                   | Scenariusze BDD z perspektywy użytkownika (`.feature`, Given/When/Then), uruchamiane w Playwright                                                               |
| `playwright-bdd`                          | Zamienia scenariusze Gherkin (`.feature`) w testy Playwright, mapuje kroki na definicje w TS                                                                    |
| `@axe-core/playwright` `*`                | Sprawdzanie dostępności w scenariuszach strony (WCAG 2.1 AA); MPL-2.0                                                                                           |
| Stryker (`@stryker-mutator/core`)         | Mutation testing: celowo psuje kod i sprawdza, czy testy to wykryją (mutation score zamiast samego coverage)                                                    |
| Stryker command runner (wbudowany w core) | Odpala `vitest run` dla każdego mutanta. `@stryker-mutator/vitest-runner` jest szybszy, ale nie działa z Vitest 5 (stryker-js #6210); wróć do niego po poprawce |
| jscpd `*`                                 | Duplikacja kodu (`.jscpd.json`), bramka w `validate`: żaden klon niedozwolony                                                                                   |
| CRAP (`dev/quality/crap.ts`) `*`          | Złożoność (ESLint `complexity`) × brak pokrycia (Vitest coverage); bramka w `validate`, próg 30 na funkcję                                                      |

## Git i CI

| Narzędzie                                      | Rola                                                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Husky                                          | Hooki gita                                                                                                                       |
| lint-staged                                    | Lint i format tylko zmienionych plików przy commicie                                                                             |
| commitlint + `@commitlint/config-conventional` | Conventional Commits                                                                                                             |
| GitHub Actions                                 | CI: `validate`, testy integracyjne, mutation testing i e2e na każdym PR                                                          |
| `npm audit`                                    | Bramka w CI: znane podatności o wysokiej albo krytycznej wadze w zależnościach runtime (`security:audit`)                        |
| release-please `*`                             | Wersje i `CHANGELOG.md` z Conventional Commits: utrzymuje otwarty release PR, a jego merge taguje wersję i tworzy GitHub Release |

<!-- ai:start -->

GitHub Actions uruchamia też opcjonalne AI review innym modelem dla PR z etykietą `ai-review`
(OpenRouter).

<!-- ai:end -->

## Utrzymanie

| Narzędzie         | Rola                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| npm-check-updates | Aktualizacja zależności (`list-outdated-dependencies`, `update-dependencies`) |
| rimraf            | `npm run clean` działający też na Windowsie                                   |

## Dokumentacja i architektura

| Narzędzie | Rola                                                                        |
| --------- | --------------------------------------------------------------------------- |
| TypeDoc   | Spis komentarzy TSDoc z `apps/api` i `packages/shared` (`npm run docs:api`) |
| VitePress | Strona z dokumentacją (arc42, ADR)                                          |
| Archgate  | Egzekwowanie ADR w kodzie                                                   |

## Do rozważenia w innych projektach i inne notki

Narzędzia, które pasują do innych projektów albo dublują to, co szablon już ma. Kolumna „Powód”
mówi, kiedy mogą się przydać.

| Narzędzie                                                                                                 | Powód                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Svelte, SvelteKit, `svelte-check`, `eslint-plugin-svelte`, `prettier-plugin-svelte`, `@testing-library/*` | Specyficzne dla frameworka                                                                                                                            |
| `@html-eslint/*`                                                                                          | Brak plików HTML w czystym TS                                                                                                                         |
| `@stylistic/eslint-plugin`                                                                                | Dubluje Prettier                                                                                                                                      |
| `prettier-plugin-organize-imports`                                                                        | Dubluje perfectionist                                                                                                                                 |
| `@cspell/eslint-plugin`                                                                                   | Dubluje cspell CLI                                                                                                                                    |
| `eslint-plugin-eslint-plugin`                                                                             | Tylko do pisania własnych reguł ESLint                                                                                                                |
| skott                                                                                                     | knip + import-x pokrywają większość, ale do wglądu do grafów                                                                                          |
| CodeQL                                                                                                    | Analiza bezpieczeństwa śledząca dane przez kod. Darmowa tylko dla publicznych repozytoriów, także lokalnie; podstawy pokrywa `eslint-plugin-security` |
| Renovate                                                                                                  | Odrzucony: za mocno wiąże projekt z infrastrukturą GitHuba (aplikacja GitHub otwierająca PR-y); zamiast niego lokalnie działa npm-check-updates       |
