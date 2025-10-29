// /web/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query"], // uncomment to debug locally
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
