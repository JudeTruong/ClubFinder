import { PrismaClient } from "@prisma/client";

// Attach the Prisma client to the global object so we dont connect multiple times 
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
