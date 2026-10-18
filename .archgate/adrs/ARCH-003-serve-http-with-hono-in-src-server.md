---
id: ARCH-003
title: Serve HTTP with Hono in src/server/
domain: architecture
rules: false
files: ['src/**/*.ts']
---

# Serve HTTP with Hono in src/server/

## Context

The template was a CLI: it printed a greeting and exited. A frontend could not talk to it. The
template is now the backend half of a pair; a separate frontend template (React and Vite) calls it
over HTTP and generates its types from an OpenAPI description.

Options considered (data from npm and GitHub, October 2026):

- **Hono**: MIT, about 45 million downloads a week, small and built on web standards (`Request`,
  `Response`, `fetch`), so `app.request()` tests a route without a port. `@hono/zod-openapi`
  validates requests with the Zod schemas the template already uses and builds the OpenAPI
  description from the same schemas. Chosen.
- **Fastify**: MIT, about 9 million downloads a week, fast and mature, with OpenAPI through
  plugins; it uses its own request and reply objects and JSON Schema first, so the Zod schemas
  would need an adapter.
- **Express**: MIT, the most downloaded, but no built-in validation, types or OpenAPI, and an
  older design around callbacks.

## Decision

- `src/server/app.ts` builds the app with `createApp(dependencies)`: the routes, the OpenAPI
  description at `/api/openapi.json`, a JSON 404 answer and an error handler. It does not listen
  on a port.
- Every route is defined with `createRoute` and Zod schemas, so its input is validated and it
  appears in the OpenAPI description.
- `src/index.ts` only starts the server on `PORT` (validated in `src/env.ts`, default 3000) with
  `@hono/node-server`, and closes it on `SIGINT` and `SIGTERM`.
- Routes live under `/api/`, so a frontend dev server can forward that prefix to the backend.
- Every request gets a request ID (taken from the `X-Request-Id` header, or created) that the
  answer carries back, the standard security headers (`secureHeaders`), and one log line with
  the method, path, status, duration and request ID.
- Every error has one JSON format, `{ "error": "…" }`. Invalid input also lists what was wrong:
  `{ "error": "Invalid request", "issues": [{ "path": "range.from", "message": "…" }] }`, with
  status `400`.

## Do's and Don'ts

- **Do** add a route with `createRoute` and `app.openapi()`, and test it with `app.request()`.
- **Do** pass what a route needs (a logger, a repository) through `createApp(dependencies)`.
- **Don't** add routes with `app.get()` and the like: they skip validation and the OpenAPI
  description.
- **Don't** return error details to the client: the error handler logs them and answers with a
  generic message.

## Consequences

- Unit tests call the app in memory; the Gherkin scenarios start the real server on a free port.
- The OpenAPI description is always in sync with the code, because both come from one schema.
- Hono is a small framework, so the template is no longer framework-free; its routing and
  validation are the only parts that depend on it.
