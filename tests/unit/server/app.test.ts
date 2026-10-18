import { createRoute, z } from '@hono/zod-openapi';
import { describe, expect, it, vi } from 'vitest';

import { createApp } from '../../../src/server/app.ts';

const BROKEN_PATH = '/api/broken';
const HEALTH_PATH = '/api/health';
const REQUEST_ID = 'abc-123';

// A route with a nested JSON body, to check the answer to invalid input.
const RANGE_PATH = '/api/range';
const RangeSchema = z.object({ from: z.number(), to: z.number() });
const rangeRoute = createRoute({
  method: 'post',
  path: RANGE_PATH,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ range: RangeSchema }),
        },
      },
    },
  },
  responses: { 200: { description: 'The range' } },
});

type LogCall = (fields: Record<string, unknown>, message: string) => void;

const GREETING_PATH = '/api/greeting';
const REQUEST_ID_HEADER = 'X-Request-Id';

interface TestApp {
  app: ReturnType<typeof createApp>;
  logError: ReturnType<typeof vi.fn<LogCall>>;
  logInfo: ReturnType<typeof vi.fn<LogCall>>;
}

function appWithLogger(): TestApp {
  const logError = vi.fn<LogCall>();
  const logInfo = vi.fn<LogCall>();

  return { app: createApp({ logger: { error: logError, info: logInfo } }), logError, logInfo };
}

describe('app', () => {
  it('reports that the server is up', async () => {
    expect.assertions(2);

    const response = await appWithLogger().app.request(HEALTH_PATH);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ status: 'ok' });
  });

  it.each([
    ['?name=Ada', 'Hello, Ada!'],
    ['?name=%20Ada%20', 'Hello, Ada!'],
    ['', 'Hello!'],
  ])('greets for the query %j', async (query, message) => {
    expect.assertions(2);

    const response = await appWithLogger().app.request(`${GREETING_PATH}${query}`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ message });
  });

  it('describes the API in the OpenAPI format', async () => {
    expect.assertions(1);

    // The path is part of the contract with the frontend, so the test spells it out.
    const response = await appWithLogger().app.request('/api/openapi.json');

    await expect(response.json()).resolves.toMatchObject({
      info: { title: 'API', version: '0.0.0' },
      openapi: '3.1.0',
      paths: {
        '/api/greeting': {
          get: {
            parameters: [
              { in: 'query', name: 'name', required: false, schema: { type: 'string' } },
            ],
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: { properties: { message: { type: 'string' } }, required: ['message'] },
                  },
                },
                description: 'The greeting',
              },
            },
          },
        },
        '/api/health': {
          get: {
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      properties: { status: { enum: ['ok'], type: 'string' } },
                      required: ['status'],
                    },
                  },
                },
                description: 'The server is up',
              },
            },
          },
        },
      },
    });
  });

  it('answers an unknown address with 404', async () => {
    expect.assertions(2);

    const response = await appWithLogger().app.request('/api/unknown');

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toStrictEqual({ error: 'Not found' });
  });

  it('answers a failing route with 500 and logs the error', async () => {
    expect.assertions(3);

    const { app, logError } = appWithLogger();
    const failure = new Error('Database is down');

    app.get(BROKEN_PATH, () => {
      throw failure;
    });

    const response = await app.request(BROKEN_PATH);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toStrictEqual({ error: 'Internal server error' });
    expect(logError.mock.lastCall).toStrictEqual([
      { err: failure, path: BROKEN_PATH, requestID: response.headers.get(REQUEST_ID_HEADER) },
      'Request failed',
    ]);
  });

  it('logs every request with its method, path, status, duration and request ID', async () => {
    expect.assertions(3);

    const { app, logInfo } = appWithLogger();

    await app.request(`${GREETING_PATH}?name=Ada`, {
      headers: { [REQUEST_ID_HEADER]: REQUEST_ID },
    });

    const [fields, message] = logInfo.mock.lastCall ?? [];
    const { durationMs, ...rest } = fields ?? {};

    expect(message).toBe('Request handled');
    expect(rest).toStrictEqual({
      method: 'GET',
      path: GREETING_PATH,
      requestID: REQUEST_ID,
      status: 200,
    });
    // A whole number of milliseconds, measured from the start of this request.
    expect(Number.isSafeInteger(durationMs) && Number(durationMs) < 1000).toBe(true);
  });

  it('logs a failed request with its 500 status', async () => {
    expect.assertions(1);

    const { app, logInfo } = appWithLogger();

    app.get(BROKEN_PATH, () => {
      throw new Error('Database is down');
    });
    await app.request(BROKEN_PATH);

    expect(logInfo).toHaveBeenCalledWith(
      expect.objectContaining({ path: BROKEN_PATH, status: 500 }),
      'Request handled',
    );
  });

  it('sends back the request ID it was given', async () => {
    expect.assertions(1);

    const response = await appWithLogger().app.request(HEALTH_PATH, {
      headers: { [REQUEST_ID_HEADER]: REQUEST_ID },
    });

    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(REQUEST_ID);
  });

  it('creates a request ID when the client sends none', async () => {
    expect.assertions(1);

    const response = await appWithLogger().app.request(HEALTH_PATH);

    expect(response.headers.get(REQUEST_ID_HEADER)).toMatch(/^[\da-f-]{36}$/u);
  });

  it('sends the security headers', async () => {
    expect.assertions(2);

    const response = await appWithLogger().app.request(HEALTH_PATH);

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
  });

  it('answers invalid input with 400 and lists every invalid field', async () => {
    expect.assertions(2);

    const { app } = appWithLogger();

    app.openapi(rangeRoute, context => context.body(null, 200));

    const response = await app.request(RANGE_PATH, {
      body: JSON.stringify({ range: { from: 'one', to: 'two' } }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toStrictEqual({
      error: 'Invalid request',
      issues: [
        { message: 'Invalid input: expected number, received string', path: 'range.from' },
        { message: 'Invalid input: expected number, received string', path: 'range.to' },
      ],
    });
  });
});
