// Prisma client (optional for MVP). Seed fallback works without DATABASE_URL.
// Run `npx prisma generate && npm run db:push` after `docker compose up -d`.
type AnyClient = Record<string, unknown> | null;

const globalForPrisma = globalThis as unknown as { prisma?: AnyClient };

function createClient(): AnyClient {
  if (!process.env.DATABASE_URL) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client") as { PrismaClient: new () => AnyClient };
    if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient() as AnyClient;
    return globalForPrisma.prisma ?? null;
  } catch {
    return null;
  }
}

export const prisma: AnyClient = globalForPrisma.prisma ?? createClient();
export const hasDb = () => Boolean(prisma);
