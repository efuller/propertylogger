import { PrismaDbClient } from './prismaDbClient';

describe('Database', () => {
  let db: PrismaDbClient;

  beforeAll(() => {
    db = new PrismaDbClient();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should verify that the DB is online', async () => {
    const result = await db.isConnected();

    expect(result).toBe(true);
  });
});

describe('Reset DB', () => {
  let db: PrismaDbClient;

  beforeAll(() => {
    db = new PrismaDbClient();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should reset the DB', async () => {
    const dbClient = db.getClient();

    await dbClient.dBHealth.create({
      data: {
        name: 'test',
      },
    });

    const count = await dbClient.dBHealth.count();

    // Anchor
    expect(count).toBeGreaterThan(0);

    await db.reset();

    const countAfterReset = await dbClient.dBHealth.count();

    expect(countAfterReset).toBe(0);
  });
});
