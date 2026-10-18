# 5. Building blocks

| Block              | Where                                     | Responsibility                                                                             |
| ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Application        | `src/`                                    | The code of the project                                                                    |
| HTTP server        | `src/server/`, `src/index.ts`             | The Hono app with its routes and OpenAPI description; the entry point starts it (ARCH-003) |
| Environment        | `src/env.ts`                              | The only module that reads `process.env` (ARCH-001)                                        |
| Logger             | `src/logger.ts`                           | The pino logger: level, format, redaction (ARCH-002)                                       |
| Result             | `src/shared/result.ts`                    | The Result type for operations that may fail                                               |
| Database           | `src/db/`, `dev/db/`                      | Drizzle schema and client; migrations and seeds                                            |
| Unit tests         | `tests/unit/`                             | Vitest tests of the public API                                                             |
| Integration tests  | `tests/integration/`                      | Vitest tests against real services in containers (Testcontainers)                          |
| Scenarios          | `tests/e2e/features/`, `tests/e2e/steps/` | Gherkin specification and its step definitions                                             |
| Quality scripts    | `dev/quality/`                            | The CRAP gate                                                                              |
| Architecture rules | `.archgate/adrs/`                         | ADRs and the rules that check them                                                         |
| Agent rules        | `AGENTS.md`, `.agents/roles/`, `.claude/` | What agents may do, and how                                                                |
| Documentation      | `docs/`, `.vitepress/`                    | This site                                                                                  |
| Automation         | `.husky/`, `.github/workflows/`           | Git hooks, CI, releases, docs publishing                                                   |
