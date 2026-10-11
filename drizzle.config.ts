import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// No throw here: tools that only read this config (knip, `drizzle-kit generate`) must work without .env.
// Commands that connect (push, studio, check) fail with a connection error when the URL is empty.
const databaseUrl = process.env['DATABASE_URL'] ?? '';

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
