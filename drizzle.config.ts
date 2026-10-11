import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env['DATABASE_URL'];
if (databaseUrl === undefined) throw new Error('DATABASE_URL is not set');

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: databaseUrl },
  // Migration files named by date, e.g. 20261011120000_initial.sql
  migrations: { prefix: 'timestamp' },
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
