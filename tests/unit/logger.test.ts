import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { createLogger, loggerOptions, type LoggerSettings, settingsFor } from '../../src/logger.ts';

const jsonAtInfo: LoggerSettings = { level: 'info', pretty: false };
const CENSOR = '[REDACTED]';
const LogLineSchema = z.record(z.string(), z.unknown());

interface Capture {
  lines(): Array<Record<string, unknown>>;
  stream: { write(line: string): void };
}

function capture(): Capture {
  const written: string[] = [];

  return {
    lines: () => written.map(line => LogLineSchema.parse(JSON.parse(line))),
    stream: {
      write(line: string): void {
        written.push(line);
      },
    },
  };
}

describe('loggerOptions', () => {
  it('writes JSON without a transport when pretty is off', () => {
    expect.assertions(2);

    const options = loggerOptions(jsonAtInfo);

    expect(options.level).toBe('info');
    expect(options.transport).toBeUndefined();
  });

  it('uses pino-pretty on stderr when pretty is on', () => {
    expect.assertions(1);
    expect(loggerOptions({ level: 'debug', pretty: true }).transport).toStrictEqual({
      options: { destination: 2 },
      target: 'pino-pretty',
    });
  });

  it('redacts secret fields at the top level and one level down', () => {
    expect.assertions(1);
    expect(loggerOptions(jsonAtInfo).redact).toStrictEqual({
      censor: CENSOR,
      paths: [
        'DATABASE_URL',
        '*.DATABASE_URL',
        'password',
        '*.password',
        'token',
        '*.token',
        'authorization',
        '*.authorization',
        'cookie',
        '*.cookie',
      ],
    });
  });
});

describe('createLogger', () => {
  it('writes a JSON line with the level and the message', () => {
    expect.assertions(1);

    const output = capture();
    createLogger(jsonAtInfo, output.stream).info({ user: 'ada' }, 'Signed in');

    expect(output.lines()).toMatchObject([{ level: 30, msg: 'Signed in', user: 'ada' }]);
  });

  it('skips messages below the configured level', () => {
    expect.assertions(1);

    const output = capture();
    const logger = createLogger({ level: 'warn', pretty: false }, output.stream);
    logger.info('not written');
    logger.warn('written');

    expect(output.lines().map(line => String(line.msg))).toStrictEqual(['written']);
  });

  it('hides secrets in the written line', () => {
    expect.assertions(1);

    const output = capture();
    createLogger(jsonAtInfo, output.stream).info(
      { config: { DATABASE_URL: 'postgres://user:secret@db/app' }, password: 'hunter2' },
      'Connecting',
    );

    expect(output.lines()).toMatchObject([{ config: { DATABASE_URL: CENSOR }, password: CENSOR }]);
  });
});

describe('settingsFor', () => {
  it.each([
    ['development', true],
    ['test', false],
    ['production', false],
  ] as const)('in %s, pretty is %s', (nodeEnvironment, pretty) => {
    expect.assertions(1);
    expect(settingsFor({ LOG_LEVEL: 'warn', NODE_ENV: nodeEnvironment })).toStrictEqual({
      level: 'warn',
      pretty,
    });
  });
});

describe('pretty logger', () => {
  it('starts with the pino-pretty transport', () => {
    expect.assertions(1);

    const logger = createLogger({ level: 'debug', pretty: true });

    expect(logger.level).toBe('debug');
  });
});

describe('logger', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('takes its level from LOG_LEVEL', async () => {
    expect.assertions(1);
    vi.stubEnv('DATABASE_URL', 'postgres://user:password@localhost:5432/database');
    vi.stubEnv('LOG_LEVEL', 'error');
    vi.resetModules();

    const { logger } = await import('../../src/logger.ts');

    expect(logger.level).toBe('error');
  });
});
