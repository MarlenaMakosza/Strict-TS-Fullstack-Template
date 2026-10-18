# Decyzje

Decyzje architektoniczne to ADR-y w `.archgate/adrs/`. Archgate sprawdza te, które mają reguły
(`npm run check:adrs`). W konfiguracji z AI nowe decyzje przygotowuje agent `architect`.

| ID       | Decyzja                                                                                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| ARCH-001 | Tylko `apps/api/src/env.ts` czyta `process.env`; przy starcie sprawdza każdą zmienną przez Zod                                          |
| ARCH-002 | Logujemy przez pino w `apps/api/src/logger.ts`, na stderr, z ukrytymi sekretami; ESLint zabrania `console.*` gdzie indziej              |
| ARCH-003 | Serwujemy HTTP przez Hono w `apps/api/src/server/`: trasy ze schematami Zod, opis OpenAPI, bez portu w testach                          |
| ARCH-004 | Jedno monorepo z npm workspaces: aplikacje w `apps/`, wspólne narzędzia i scenariusze w katalogu głównym                                |
| ARCH-005 | React i Vite dla frontendu w `apps/web`: aplikacja jednostronicowa, Tailwind, Testing Library, `/api` przekazywane w trybie development |
| GEN-001  | Przykładowy ADR z `archgate init`, do usunięcia, gdy projekt będzie miał własne                                                         |
