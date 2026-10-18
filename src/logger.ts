import pino from 'pino';

import { env } from './env.ts';

/** Log levels, from the most to the least severe; `silent` turns logging off. */
type LogLevel = 'debug' | 'error' | 'fatal' | 'info' | 'silent' | 'trace' | 'warn';

/** What a logger needs to know about its environment. */
export interface LoggerSettings {
  /** The least severe level that is written. */
  level: LogLevel;
  /** Human-readable lines (pino-pretty) instead of JSON, for local development. */
  pretty: boolean;
}

/** Field names whose values never reach the logs, at the top level or one level down. */
const SECRET_FIELDS = ['DATABASE_URL', 'password', 'token', 'authorization', 'cookie'];
const STDERR = 2;

/**
 * Builds the pino options for the given settings.
 *
 * @param settings - The level and the output format.
 * @returns Options with the level, the redaction of secrets and, for `pretty`, the pino-pretty
 *   transport.
 */
export function loggerOptions(settings: LoggerSettings): pino.LoggerOptions {
  const redact = {
    censor: '[REDACTED]',
    paths: SECRET_FIELDS.flatMap(field => [field, `*.${field}`]),
  };
  const transport = { options: { destination: STDERR }, target: 'pino-pretty' };

  return settings.pretty
    ? { level: settings.level, redact, transport }
    : { level: settings.level, redact };
}

/**
 * Creates a logger.
 *
 * Logs go to stderr, the usual place for the logs of a server process.
 *
 * @param settings - The level and the output format.
 * @param destination - Where JSON lines go; stderr by default. Ignored with `pretty`.
 * @returns A pino logger.
 */
export function createLogger(
  settings: LoggerSettings,
  destination: pino.DestinationStream = pino.destination(STDERR),
): pino.Logger {
  return settings.pretty
    ? pino(loggerOptions(settings))
    : pino(loggerOptions(settings), destination);
}

/**
 * Picks the logger settings for an environment.
 *
 * @param environment - The validated environment variables.
 * @returns The level from `LOG_LEVEL`; readable lines only in development.
 */
export function settingsFor(
  environment: Pick<typeof env, 'LOG_LEVEL' | 'NODE_ENV'>,
): LoggerSettings {
  return { level: environment.LOG_LEVEL, pretty: environment.NODE_ENV === 'development' };
}

/** The app logger: JSON in production and tests, readable lines in development. */
export const logger = createLogger(settingsFor(env));
