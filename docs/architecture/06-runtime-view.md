# 6. Runtime view

How the parts work together in the scenarios that matter.

## The server starts and stops

1. `node src/index.ts` loads `apps/api/src/env.ts`.
2. `apps/api/src/env.ts` reads `.env` with dotenv and validates `process.env` with Zod.
3. Invalid or missing variables: the process stops with an error that lists every bad key (see
   ADR `ARCH-001`).
4. Valid variables: `apps/api/src/index.ts` builds the app with `createApp()` and listens on `PORT`
   (ADR `ARCH-003`). The log says `Server started`.
5. On `SIGINT` or `SIGTERM`, the server stops taking new requests, finishes the open ones and
   exits.

## The app in development

`npm run dev` starts the API on port 3000 and Vite on port 5173. The browser loads the app from
Vite; every request to `/api/…` goes to Vite, which forwards it to the API (ADR `ARCH-005`). So the
browser sees one origin and needs no CORS. The app validates every answer with Zod before it uses
it.

## A request

1. The request gets a request ID: the one from the `X-Request-Id` header, or a new one.
2. Hono matches the path to a route in `apps/api/src/server/app.ts`.
3. The route's Zod schema validates the input. Invalid input gets `400` with
   `{"error":"Invalid request","issues":[…]}`, one issue per invalid field.
4. The handler answers with JSON. An unknown path gets `404` with `{"error":"Not found"}`.
5. An error in a handler is logged with its details; the client gets `500` with a generic message.
6. The answer carries the request ID and the security headers, and one log line records the
   method, path, status, duration and request ID.

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
