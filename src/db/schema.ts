import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Example table — replace with the real schema.
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
});
