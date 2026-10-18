# Decisions

Architecture decisions are ADRs in `.archgate/adrs/`. Archgate checks the ones that have rules
(`npm run check:adrs`). With the AI setup, the architect agent drafts new ones.

| ID       | Decision                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------- |
| ARCH-001 | Only `src/env.ts` reads `process.env`; it validates every variable with Zod at startup                   |
| ARCH-002 | Log through pino in `src/logger.ts`, to stderr, with secrets redacted; ESLint bans `console.*` elsewhere |
| ARCH-003 | Serve HTTP with Hono in `src/server/`: routes with Zod schemas, an OpenAPI description, no port in tests |
| GEN-001  | Example ADR from `archgate init`, to delete once the project has its own                                 |
