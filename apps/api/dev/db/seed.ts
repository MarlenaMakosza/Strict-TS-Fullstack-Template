import { faker } from '@faker-js/faker';

import { connection, db } from '../../src/db/client.ts';
import { users } from '../../src/db/schema.ts';

const USER_COUNT = 10;
const FAKER_SEED = 1;

faker.seed(FAKER_SEED);

try {
  // Seed starts from a clean table on purpose.
  await db.delete(users);
  await db.insert(users).values(
    Array.from({ length: USER_COUNT }, () => {
      return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      };
    }),
  );
} finally {
  await connection.end();
}
