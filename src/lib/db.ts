import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL
    ? new PrismaClient()
    : (null as unknown as PrismaClient));

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export const hasDb = () => Boolean(process.env.DATABASE_URL && prisma);
