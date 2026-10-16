# 5. Bloki budulcowe

| Blok                | Gdzie                                     | Odpowiedzialność                                   |
| ------------------- | ----------------------------------------- | -------------------------------------------------- |
| Aplikacja           | `src/`                                    | Kod projektu                                       |
| Środowisko          | `src/env.ts`                              | Jedyny moduł, który czyta `process.env` (ARCH-001) |
| Baza danych         | `src/db/`, `dev/db/`                      | Schemat i klient Drizzle; migracje i dane testowe  |
| Testy jednostkowe   | `tests/unit/`                             | Testy Vitest publicznego API                       |
| Scenariusze         | `tests/e2e/features/`, `tests/e2e/steps/` | Specyfikacja Gherkin i jej step definitions        |
| Skrypty jakości     | `dev/quality/`                            | Bramka CRAP                                        |
| Reguły architektury | `.archgate/adrs/`                         | ADR-y i reguły, które je sprawdzają                |
| Reguły dla agentów  | `AGENTS.md`, `.agents/roles/`, `.claude/` | Co agenci mogą robić i jak                         |
| Dokumentacja        | `docs/`, `.vitepress/`                    | Ta strona                                          |
| Automatyzacja       | `.husky/`, `.github/workflows/`           | Hooki gita, CI, wydania, publikacja dokumentacji   |
