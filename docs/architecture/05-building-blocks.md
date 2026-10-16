# 5. Building blocks

| Block              | Where                                     | Responsibility                                      |
| ------------------ | ----------------------------------------- | --------------------------------------------------- |
| Application        | `src/`                                    | The code of the project                             |
| Environment        | `src/env.ts`                              | The only module that reads `process.env` (ARCH-001) |
| Database           | `src/db/`, `dev/db/`                      | Drizzle schema and client; migrations and seeds     |
| Unit tests         | `tests/unit/`                             | Vitest tests of the public API                      |
| Scenarios          | `tests/e2e/features/`, `tests/e2e/steps/` | Gherkin specification and its step definitions      |
| Quality scripts    | `dev/quality/`                            | The CRAP gate                                       |
| Architecture rules | `.archgate/adrs/`                         | ADRs and the rules that check them                  |
| Agent rules        | `AGENTS.md`, `.agents/roles/`, `.claude/` | What agents may do, and how                         |
| Documentation      | `docs/`, `.vitepress/`                    | This site                                           |
| Automation         | `.husky/`, `.github/workflows/`           | Git hooks, CI, releases, docs publishing            |
