# 5. Bloki budulcowe

| Blok                | Gdzie                                           | Odpowiedzialność                                                                 |
| ------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| Aplikacje           | `apps/`                                         | Jeden npm workspace na aplikację; `apps/api` i `apps/web` (ARCH-004)             |
| Aplikacja           | `apps/api/src/`                                 | Kod projektu                                                                     |
| Serwer HTTP         | `apps/api/src/server/`, `apps/api/src/index.ts` | Aplikacja Hono z trasami i opisem OpenAPI; punkt wejścia ją uruchamia (ARCH-003) |
| Aplikacja webowa    | `apps/web/`                                     | Frontend w React: komponenty w `src/`, klient API w `src/api/` (ARCH-005)        |
| Wspólny kod         | `packages/shared/`                              | Kod używany przez obie aplikacje, np. `Result` (`@app/shared/result`)            |
| Środowisko          | `apps/api/src/env.ts`                           | Jedyny moduł, który czyta `process.env` (ARCH-001)                               |
| Logger              | `apps/api/src/logger.ts`                        | Logger pino: poziom, format, ukrywanie sekretów (ARCH-002)                       |
| Baza danych         | `apps/api/src/db/`, `apps/api/dev/db/`          | Schemat i klient Drizzle; migracje i dane testowe                                |
| Testy jednostkowe   | `apps/api/tests/unit/`                          | Testy Vitest publicznego API                                                     |
| Testy integracyjne  | `apps/api/tests/integration/`                   | Testy Vitest na prawdziwych usługach w kontenerach (Testcontainers)              |
| Scenariusze         | `tests/e2e/features/`, `tests/e2e/steps/`       | Specyfikacja Gherkin i jej step definitions                                      |
| Skrypty jakości     | `dev/quality/`                                  | Bramka CRAP                                                                      |
| Reguły architektury | `.archgate/adrs/`                               | ADR-y i reguły, które je sprawdzają                                              |
| Reguły dla agentów  | `AGENTS.md`, `.agents/roles/`, `.claude/`       | Co agenci mogą robić i jak                                                       |
| Dokumentacja        | `docs/`, `.vitepress/`                          | Ta strona                                                                        |
| Automatyzacja       | `.husky/`, `.github/workflows/`                 | Hooki gita, CI, wydania, publikacja dokumentacji                                 |
