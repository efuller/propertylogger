import { PrismaClient } from '@prisma/client';
import execSh from 'exec-sh';
import path from 'path';

export class Database {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  getClient() {
    return this.prismaClient;
  }

  async disconnect() {
    await this.prismaClient.$disconnect();
  }

  async isConnected(): Promise<boolean> {
    const result = await this.prismaClient.$queryRaw`SELECT 1`;

    if (!Array.isArray(result) || result.length !== 1) {
      return false;
    }
    return true;
  }

  async reset() {
    const schema = path.join(__dirname, '../../../../prisma/schema.prisma');
    await execSh.promise(
      `prisma db push --force-reset --schema=${schema}`,
      true,
    );
  }
}
