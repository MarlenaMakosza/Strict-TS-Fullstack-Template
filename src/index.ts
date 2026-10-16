import { env } from './env.ts';
import { greet } from './greet.ts';
import { logger } from './logger.ts';

// The greeting is the output of the program, so it goes to stdout; logs go to stderr.
console.log(`${greet('world')} (${env.NODE_ENV})`);
logger.debug({ nodeEnvironment: env.NODE_ENV }, 'Greeting printed');
