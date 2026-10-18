# Decisions

Architecture decisions are ADRs in `.archgate/adrs/`. Archgate checks the ones that have rules
(`npm run check:adrs`). With the AI setup, the architect agent drafts new ones.

| ID       | Decision                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| ARCH-001 | Only `apps/api/src/env.ts` reads `process.env`; it validates every variable with Zod at startup                   |
| ARCH-002 | Log through pino in `apps/api/src/logger.ts`, to stderr, with secrets redacted; ESLint bans `console.*` elsewhere |
| ARCH-003 | Serve HTTP with Hono in `apps/api/src/server/`: routes with Zod schemas, an OpenAPI description, no port in tests |
| ARCH-004 | One monorepo with npm workspaces: apps in `apps/`, shared tooling and scenarios at the root                       |
| GEN-001  | Example ADR from `archgate init`, to delete once the project has its own                                          |
