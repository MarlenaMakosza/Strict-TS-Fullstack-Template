# 5. Building blocks

| Block              | Where                                           | Responsibility                                                                             |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Apps               | `apps/`                                         | One npm workspace per app; `apps/api` and `apps/web` (ARCH-004)                            |
| Application        | `apps/api/src/`                                 | The code of the project                                                                    |
| HTTP server        | `apps/api/src/server/`, `apps/api/src/index.ts` | The Hono app with its routes and OpenAPI description; the entry point starts it (ARCH-003) |
| Web app            | `apps/web/`                                     | The React frontend: components in `src/`, the API client in `src/api/` (ARCH-005)          |
| Shared code        | `packages/shared/`                              | Code both apps use, such as `Result` (`@app/shared/result`)                                |
| Environment        | `apps/api/src/env.ts`                           | The only module that reads `process.env` (ARCH-001)                                        |
| Logger             | `apps/api/src/logger.ts`                        | The pino logger: level, format, redaction (ARCH-002)                                       |
| Database           | `apps/api/src/db/`, `apps/api/dev/db/`          | Drizzle schema and client; migrations and seeds                                            |
| Unit tests         | `apps/api/tests/unit/`                          | Vitest tests of the public API                                                             |
| Integration tests  | `apps/api/tests/integration/`                   | Vitest tests against real services in containers (Testcontainers)                          |
| Scenarios          | `tests/e2e/features/`, `tests/e2e/steps/`       | Gherkin specification and its step definitions                                             |
| Quality scripts    | `dev/quality/`                                  | The CRAP gate                                                                              |
| Architecture rules | `.archgate/adrs/`                               | ADRs and the rules that check them                                                         |
| Agent rules        | `AGENTS.md`, `.agents/roles/`, `.claude/`       | What agents may do, and how                                                                |
| Documentation      | `docs/`, `.vitepress/`                          | This site                                                                                  |
| Automation         | `.husky/`, `.github/workflows/`                 | Git hooks, CI, releases, docs publishing                                                   |
