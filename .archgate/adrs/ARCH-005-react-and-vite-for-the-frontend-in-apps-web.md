---
id: ARCH-005
title: React and Vite for the frontend in apps/web
domain: architecture
rules: false
files: ['apps/web/**']
---

# React and Vite for the frontend in apps/web

## Context

The template gets a browser frontend next to the HTTP API (ARCH-003) in the same monorepo
(ARCH-004). It needs a UI library, a dev server and build tool, styles, and tests for
components.

Options considered (data from npm, October 2026):

- **React** (MIT): by far the most used UI library, so AI agents have seen the most React code
  and write it most reliably, and most libraries and answers target it. Chosen.
- **Svelte** (MIT): smaller and simpler, and the maintainer likes it, but much less used.
- A **framework picker** in the template: every framework would need its own lint rules, test
  setup and mutation config. Rejected as too much to maintain.
- **Next.js**: brings its own server, which would duplicate the Hono backend. Rejected in favor
  of a single-page app built with **Vite** (MIT).

## Decision

- `apps/web` is a React single-page app built with Vite. `src/main.tsx` mounts `App`;
  components receive what they need from outside as props (for example `getGreeting`), so tests
  pass fakes.
- In development, Vite serves the app on port 5173 and forwards `/api/…` to the backend
  (`API_URL`, default `http://localhost:3000`), so the two need no CORS setup. `npm run dev` at
  the root starts both.
- The frontend calls only `/api/…`, and validates every answer with Zod at the boundary
  (`src/api/`). Shared code, such as `Result`, comes from `@app/shared`.
- Styles: Tailwind CSS v4 through `@tailwindcss/vite`, with the design tokens in
  `src/index.css`.
- Tests: Vitest with jsdom and Testing Library, by role and label as a user finds things;
  the same coverage threshold and mutation testing as the backend.
- Lint: `@eslint-react` and the React hooks rules, on top of the shared rules.

## Do's and Don'ts

- **Do** find elements in tests by role, label or text, as a user does.
- **Do** give every input a label, use real buttons, and announce results with `role="status"`
  and errors with `role="alert"`.
- **Don't** call the backend with a full URL; use `/api/…`.
- **Don't** use `dangerouslySetInnerHTML` or build HTML from strings.

## Consequences

- VitePress at the root depends on React 18 (its search box), and npm hoisted it above the app's
  React 19, so Testing Library rendered with the wrong copy. The root therefore lists React 19 as
  a dev dependency to hoist one React; npm warns that DocSearch wants React below 19, which does
  not matter because the docs do not use DocSearch.
- `eslint-plugin-jsx-a11y` has had no release since 2024 and does not support ESLint 10, so
  accessibility is not linted yet; the Gherkin scenarios in the browser will check it with axe.
