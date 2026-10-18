import 'dotenv/config';
import { z } from 'zod';

const MAX_PORT = 65_535;
const DEFAULT_PORT = 3000;

const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  PORT: z.coerce.number().int().positive().max(MAX_PORT).default(DEFAULT_PORT),
  DATABASE_URL: z.url(),
});

const result = EnvironmentSchema.safeParse(process.env);

if (!result.success) {
  const keys = result.error.issues.map(issue => String(issue.path[0])).join('\n');
  throw new Error(`Missing or invalid values in .env:\n${keys}`);
}

/** Validated environment variables. */
export const env = result.data;
