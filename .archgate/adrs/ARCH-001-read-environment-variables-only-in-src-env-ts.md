---
id: ARCH-001
title: Read environment variables only in src/env.ts
domain: architecture
rules: true
files: ['src/**/*.ts']
---

# Read environment variables only in src/env.ts

## Context

Configuration comes from environment variables. When any module reads `process.env` directly, a
missing or invalid value fails late, far from the cause, and the list of variables the app needs
is spread over the code. AI agents add such reads easily, because `process.env['X']` is the
shortest way to get a value.

## Decision

`src/env.ts` is the only module in `src/` that reads `process.env`. It validates every variable
with Zod when the app starts and exports the typed result as `env`. Every other module imports
`env` from `src/env.ts`.

## Do's and Don'ts

### Do

- Add a new variable to `EnvironmentSchema` in `src/env.ts`, with a default when one makes sense.
- Add the variable to `.env.example`.
- Import `env` from `src/env.ts` where you need a value.

### Don't

- Don't read `process.env` anywhere else in `src/`.
- Don't pass raw strings from the environment around without validation.

## Consequences

### Positive

- The app fails at start with one message that lists every missing or invalid variable.
- `src/env.ts` and `.env.example` document every variable in one place.
- Code that uses `env` gets typed values.

### Negative

- Tests that need other values must stub the environment and reload `src/env.ts`.

### Risks

- Tool configs and dev scripts outside `src/` still read `process.env` directly. This ADR does not
  cover them.

## Compliance and Enforcement

The companion rule `[1;33mARCH-001-read-environment-variables-only-in-src-env-ts.rules.ts[0m` reports every `process.env` in
`src/**/*.ts` outside `src/env.ts`. `npm run check:adrs` runs it in `validate` and in CI.

## References

- `src/env.ts`
- `tests/unit/env.test.ts`
