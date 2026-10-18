import { serve } from '@hono/node-server';

import { env } from './env.ts';
import { logger } from './logger.ts';
import { createApp } from './server/app.ts';

const server = serve({ fetch: createApp({ logger }).fetch, port: env.PORT }, info => {
  logger.info({ port: info.port }, 'Server started');
});

// Stop taking new requests and let the open ones finish, so a restart drops no request.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    logger.info({ signal }, 'Server stopping');
    server.close();
  });
}
