# Decyzje

Decyzje architektoniczne to ADR-y w `.archgate/adrs/`. Archgate sprawdza te, które mają reguły
(`npm run check:adrs`). W konfiguracji z AI nowe decyzje przygotowuje agent `architect`.

| ID       | Decyzja                                                                               |
| -------- | ------------------------------------------------------------------------------------- |
| ARCH-001 | Tylko `src/env.ts` czyta `process.env`; przy starcie sprawdza każdą zmienną przez Zod |
| GEN-001  | Przykładowy ADR z `archgate init`, do usunięcia, gdy projekt będzie miał własne       |
