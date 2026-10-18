// How to log with src/logger.ts (ADR ARCH-002): every common case in one runnable file.
// Run it with `npm run example:logger`; the comment at the bottom shows more ways.
import { logger } from '../src/logger.ts';

// 1. A message with context: put the data in an object, keep the message short.
logger.info({ userID: 42, plan: 'trial' }, 'User signed in');

// 2. Levels, from the least to the most severe. With LOG_LEVEL=info (the default),
//    trace and debug are skipped.
logger.trace('Very detailed step, usually off');
logger.debug({ cacheHit: false }, 'Cache lookup');
logger.info('Normal event');
logger.warn({ retriesLeft: 1 }, 'Request was slow, retrying');

// 3. Errors: pass the error under the `err` key, so pino prints its type, message and stack.
try {
  JSON.parse('{ not json');
} catch (error) {
  logger.error({ err: error }, 'Could not read the settings file');
}

// 4. A child logger adds the same fields to every line it writes.
const requestLogger = logger.child({ requestID: 'abc-123' });
requestLogger.info('Request started');
requestLogger.info({ durationMs: 87 }, 'Request finished');

// 5. Secrets in known fields are hidden: DATABASE_URL, password, token, authorization, cookie.
logger.info(
  { password: 'hunter2', config: { DATABASE_URL: 'postgres://u:secret@db/app' } },
  'Login attempt',
);

/*
Ways to run it. Logs go to stderr, so `2>` sends them to a file.

  npm run example:logger                                        readable lines (NODE_ENV=development in .env)
  LOG_LEVEL=debug npm run example:logger                        also the debug lines
  LOG_LEVEL=trace npm run example:logger                        everything
  NODE_ENV=production npm run example:logger                    JSON lines, as in production
  NODE_ENV=production npm run --silent example:logger 2> app.log   JSON lines saved to app.log
  npx pino-pretty < app.log                                     read a saved log file nicely
*/
