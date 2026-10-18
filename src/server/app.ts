import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { requestId, type RequestIdVariables } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

import { greet } from '../greet.ts';

/** Where the app describes its API in the OpenAPI format; the frontend generates types from it. */
const OPENAPI_PATH = '/api/openapi.json';

/** The part of the logger the app uses; the pino logger fits it, and tests pass a fake. */
interface RequestLogger {
  error(fields: object, message: string): void;
  info(fields: object, message: string): void;
}

/** What the app needs from outside; tests pass their own. */
export interface AppDependencies {
  logger: RequestLogger;
}

/** The values a request carries through the middleware: the request ID. */
interface AppEnvironment {
  Variables: RequestIdVariables;
}

const JSON_TYPE = 'application/json';
const OK = 200;
const BAD_REQUEST = 400;
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

type ValidationIssue = z.ZodError['issues'][number];

/**
 * Describes one invalid field of a request.
 *
 * @param issue - One issue from the Zod validation error.
 * @returns The message, and the path of the field with dots between its parts.
 */
function describeIssue(issue: ValidationIssue): { message: string; path: string } {
  return { message: issue.message, path: issue.path.map(String).join('.') };
}

/**
 * Builds the HTTP app: a request ID, security headers and a log line for every request; the routes
 * and their OpenAPI description; one JSON error format for invalid input, unknown paths and
 * failures. It does not listen on a port, so tests call it directly with `app.request()`.
 *
 * @param dependencies - The logger for requests and failures.
 * @returns The Hono app.
 */
export function createApp(dependencies: AppDependencies): OpenAPIHono<AppEnvironment> {
  const app = new OpenAPIHono<AppEnvironment>({
    // Invalid input gets the same error format as every other error, with what was wrong.
    defaultHook: (result, context) => {
      return result.success
        ? undefined
        : context.json(
            { error: 'Invalid request', issues: result.error.issues.map(describeIssue) },
            BAD_REQUEST,
          );
    },
  });

  // The ID comes from the X-Request-Id header, or is created; the answer carries it back.
  app.use(requestId());
  app.use(secureHeaders());
  // Named for what it does: the rest of the chain, ending in the route.
  app.use(async (context, runRoute) => {
    const started = performance.now();

    await runRoute();
    dependencies.logger.info(
      {
        durationMs: Math.round(performance.now() - started),
        method: context.req.method,
        path: context.req.path,
        requestID: context.get('requestId'),
        status: context.res.status,
      },
      'Request handled',
    );
  });

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
    dependencies.logger.error(
      { err: failure, path: context.req.path, requestID: context.get('requestId') },
      'Request failed',
    );

    return context.json({ error: 'Internal server error' }, INTERNAL_SERVER_ERROR);
  });

  return app;
}
