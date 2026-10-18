# 6. Runtime view

How the parts work together in the scenarios that matter.

## The server starts and stops

1. `node src/index.ts` loads `src/env.ts`.
2. `src/env.ts` reads `.env` with dotenv and validates `process.env` with Zod.
3. Invalid or missing variables: the process stops with an error that lists every bad key (see
   ADR `ARCH-001`).
4. Valid variables: `src/index.ts` builds the app with `createApp()` and listens on `PORT`
   (ADR `ARCH-003`). The log says `Server started`.
5. On `SIGINT` or `SIGTERM`, the server stops taking new requests, finishes the open ones and
   exits.

## A request

1. Hono matches the path to a route in `src/server/app.ts`.
2. The route's Zod schema validates the input, for example the query string.
3. The handler answers with JSON. An unknown path gets `404` with `{"error":"Not found"}`.
4. An error in a handler is logged with its details; the client gets `500` with a generic message.

## A change goes from a commit to a release

```text
commit ──▶ pre-commit: lint-staged (ESLint, Prettier, cspell on staged files)
       ──▶ commit-msg: commitlint (Conventional Commits)
push   ──▶ pull request ──▶ CI: format:check, validate, docs:build · mutation · e2e
merge  ──▶ squash commit on main ──▶ release-please updates the release pull request
                                 ──▶ Docs workflow publishes the documentation
merge of the release pull request ──▶ tag vX.Y.Z, GitHub Release with the source ZIP
```

## An AI agent finishes a task (Claude Code)

1. The agent tries to stop.
2. The Stop hook (`.claude/hooks/stop-validate.sh`) skips the check when no file changed since the
   last green run. Otherwise it runs `npm run validate` and `npm run format:check`.
3. Red gates: the hook sends the errors back and the agent keeps working, up to 3 times. After
   that, the agent stops and reports the failure.
4. Green gates: the agent writes its final report (see `AGENTS.md`).
