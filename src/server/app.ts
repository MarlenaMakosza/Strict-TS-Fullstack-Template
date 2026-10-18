import type { Logger } from 'pino';

import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { greet } from '../greet.ts';

/** Where the app describes its API in the OpenAPI format; the frontend generates types from it. */
const OPENAPI_PATH = '/api/openapi.json';

/** What the app needs from outside; tests pass their own. */
export interface AppDependencies {
  logger: Pick<Logger, 'error'>;
}

const JSON_TYPE = 'application/json';
const OK = 200;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const HealthSchema = z.object({ status: z.literal('ok') });
const GreetingSchema = z.object({ message: z.string() });

const healthRoute = createRoute({
  method: 'get',
  path: '/api/health',
  responses: {
    [OK]: { content: { [JSON_TYPE]: { schema: HealthSchema } }, description: 'The server is up' },
  },
});

const greetingRoute = createRoute({
  method: 'get',
  path: '/api/greeting',
  request: { query: z.object({ name: z.string().optional() }) },
  responses: {
    [OK]: { content: { [JSON_TYPE]: { schema: GreetingSchema } }, description: 'The greeting' },
  },
});

/**
 * Builds the HTTP app: the routes, their OpenAPI description, the 404 answer and the error handler. It does not listen on a
 * port, so tests call it directly with `app.request()`.
 *
 * @param dependencies - The logger for failed requests.
 * @returns The Hono app.
 */
export function createApp(dependencies: AppDependencies): OpenAPIHono {
  const app = new OpenAPIHono();

  app.openapi(healthRoute, context => context.json({ status: 'ok' as const }, OK));
  app.openapi(greetingRoute, context => {
    const { name = '' } = context.req.valid('query');

    return context.json({ message: greet(name) }, OK);
  });
  app.doc31(OPENAPI_PATH, {
    info: { title: 'API', version: '0.0.0' },
    openapi: '3.1.0',
  });
  app.notFound(context => context.json({ error: 'Not found' }, NOT_FOUND));
  // The details stay in the log; the client gets no internals.
  app.onError((failure, context) => {
    dependencies.logger.error({ err: failure, path: context.req.path }, 'Request failed');

    return context.json({ error: 'Internal server error' }, INTERNAL_SERVER_ERROR);
  });

  return app;
}
