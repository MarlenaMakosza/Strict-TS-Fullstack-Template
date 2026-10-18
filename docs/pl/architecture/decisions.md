# Decyzje

Decyzje architektoniczne to ADR-y w `.archgate/adrs/`. Archgate sprawdza te, które mają reguły
(`npm run check:adrs`). W konfiguracji z AI nowe decyzje przygotowuje agent `architect`.

| ID       | Decyzja                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| ARCH-001 | Tylko `src/env.ts` czyta `process.env`; przy starcie sprawdza każdą zmienną przez Zod                             |
| ARCH-002 | Logujemy przez pino w `src/logger.ts`, na stderr, z ukrytymi sekretami; ESLint zabrania `console.*` gdzie indziej |
| ARCH-003 | Serwujemy HTTP przez Hono w `src/server/`: trasy ze schematami Zod, opis OpenAPI, bez portu w testach             |
| GEN-001  | Przykładowy ADR z `archgate init`, do usunięcia, gdy projekt będzie miał własne                                   |
