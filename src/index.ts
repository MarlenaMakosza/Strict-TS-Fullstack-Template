import { env } from './env.ts';
import { greet } from './greet.ts';

console.log(`${greet('world')} (${env.NODE_ENV})`);
