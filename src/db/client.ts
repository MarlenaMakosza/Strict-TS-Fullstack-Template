import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '../env.ts';
// eslint-disable-next-line sonarjs/no-wildcard-import -- Drizzle needs every table from the schema module
import * as schema from './schema.ts';

/** Raw postgres.js connection. Call `connection.end()` before the process exits. */
export const connection = postgres(env.DATABASE_URL);

/** Drizzle client with the project schema. */
export const db = drizzle(connection, { schema, casing: 'snake_case' });
