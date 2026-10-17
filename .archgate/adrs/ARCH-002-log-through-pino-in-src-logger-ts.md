---
id: ARCH-002
title: Log through pino in src/logger.ts
domain: architecture
rules: false
files: ['src/**/*.ts']
---

# Log through pino in src/logger.ts

## Context

The template had no logger: code wrote to the console directly. That gives no levels, no
structured fields for searching, and no protection against secrets in the output. A CLI also mixes
its logs with its output when both go to stdout.

Options considered (data from npm and GitHub, October 2026):

- **pino**: MIT, about 54 million downloads a week, structured JSON, fast (writes off the main
  thread), built-in redaction, pino-pretty for development. Chosen.
- **LogTape**: MIT, zero dependencies, runs on every runtime and suits libraries, about 0.6 million
  downloads a week. Rejected: a much smaller community, and the template targets apps first.
- **winston**: MIT, very flexible, but several times slower than pino and with over 500 open issues.
- **consola**: pretty CLI messages rather than structured logging.
- **bunyan**, **signale**: no release since 2021 and 2019.

## Decision

Log through the `logger` exported by `src/logger.ts`, a pino logger configured in one place:

- the level comes from `LOG_LEVEL` (validated in `src/env.ts`, default `info`),
- JSON lines in production and tests, readable lines (pino-pretty) in development,
- logs go to **stderr**, so stdout stays free for the output of the program,
- secret fields (`DATABASE_URL`, `password`, `token`, `authorization`, `cookie`) are redacted.

Other modules never call `console.*`. Only `src/index.ts` prints the output of the CLI with
`console.log`.

## Do's and Don'ts

### Do

- Import `logger` from `src/logger.ts`, and pass context as an object: `logger.info({ userID }, 'Signed in')`.
- Add the name of every new secret field to `SECRET_FIELDS` in `src/logger.ts`.
- Use `createLogger` with a test stream to check what a module logs.

### Don't

- Don't call `console.*` outside `src/index.ts`.
- Don't put secrets in the message string: redaction only covers fields.

## Consequences

### Positive

- Logs have levels and structured fields that log tools (Loki, OpenSearch, Datadog) can search.
- Secrets in known fields never reach the logs.
- The output of the CLI and its logs stay separate.

### Negative

- Two dependencies: pino at runtime, pino-pretty in development.

### Risks

- pino-pretty is a dev dependency: running with `NODE_ENV=development` without dev dependencies
  fails to start the transport.

## Compliance and Enforcement

ESLint enforces it: `no-console` is an error everywhere except `src/index.ts` (program output) and
`dev/` (scripts). `npm run validate` and CI run ESLint. The tests in `tests/unit/logger.test.ts`
check the level, the format and the redaction.

## References

- `src/logger.ts`, `tests/unit/logger.test.ts`
- ADR `ARCH-001` (environment variables)
