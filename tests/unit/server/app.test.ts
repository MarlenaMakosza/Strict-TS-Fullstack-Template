import { describe, expect, it, vi } from 'vitest';

import { createApp } from '../../../src/server/app.ts';

const BROKEN_PATH = '/api/broken';

function appWithLogger(): {
  app: ReturnType<typeof createApp>;
  logError: ReturnType<typeof vi.fn>;
} {
  const logError = vi.fn();

  return { app: createApp({ logger: { error: logError } }), logError };
}

describe('app', () => {
  it('reports that the server is up', async () => {
    expect.assertions(2);

    const response = await appWithLogger().app.request('/api/health');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ status: 'ok' });
  });

  it.each([
    ['?name=Ada', 'Hello, Ada!'],
    ['?name=%20Ada%20', 'Hello, Ada!'],
    ['', 'Hello!'],
  ])('greets for the query %j', async (query, message) => {
    expect.assertions(2);

    const response = await appWithLogger().app.request(`/api/greeting${query}`);

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
    expect(logError).toHaveBeenCalledWith({ err: failure, path: BROKEN_PATH }, 'Request failed');
  });
});
