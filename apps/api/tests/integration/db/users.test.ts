import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { eq, sql } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

// eslint-disable-next-line sonarjs/no-wildcard-import -- Drizzle needs every table from the schema module
import * as schema from '../../../src/db/schema.ts';

const { users } = schema;

// The image matches docker-compose.yml, so the tests run on the same PostgreSQL as development.
const POSTGRES_IMAGE = 'postgres:18';
const UNIQUE_VIOLATION = '23505';
const ADA = { email: 'ada@example.com', name: 'Ada Lovelace' };
const ALAN = { email: 'alan@example.com', name: 'Alan Turing' };

describe('users table', () => {
  let container: StartedPostgreSqlContainer;
  let connection: postgres.Sql;
  let db: PostgresJsDatabase<typeof schema>;

  beforeAll(async () => {
    const postgresContainer = new PostgreSqlContainer(POSTGRES_IMAGE);

    container = await postgresContainer.start();
    connection = postgres(container.getConnectionUri());
    db = drizzle(connection, { schema, casing: 'snake_case' });
    // The committed migrations in drizzle/, the same ones `npm run db:migrate` applies.
    await migrate(db, { migrationsFolder: './drizzle' });
  });

  beforeEach(async () => {
    await db.execute(sql`truncate table ${users} restart identity`);
  });

  afterAll(async () => {
    await connection.end();
    await container.stop();
  });

  it('stores a user and fills in the id and the creation time', async () => {
    expect.assertions(3);

    const [user] = await db.insert(users).values(ADA).returning();

    expect(user?.id).toBe(1);
    expect(user?.name).toBe(ADA.name);
    expect(user?.createdAt).toBeInstanceOf(Date);
  });

  it('finds a user by email', async () => {
    expect.assertions(1);

    await db.insert(users).values([ADA, ALAN]);

    const found = await db.select().from(users).where(eq(users.email, ALAN.email));

    expect(found.map(user => user.name)).toStrictEqual([ALAN.name]);
  });

  it('rejects a second user with the same email', async () => {
    expect.assertions(1);

    await db.insert(users).values(ADA);

    await expect(db.insert(users).values({ ...ALAN, email: ADA.email })).rejects.toMatchObject({
      cause: { code: UNIQUE_VIOLATION },
    });
  });
});
