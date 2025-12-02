// src/lib/auth.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Checks if the current logged-in user is an admin of any club
export async function isAdminUser(): Promise<boolean> {
  const sid = (await cookies()).get("sid")?.value;
  if (!sid) return false;

  const userId = Number(sid);
  if (!userId || Number.isNaN(userId)) return false;

  // Membership model:
  // model Membership {
  //   id     Int    @id @default(autoincrement())
  //   userId Int
  //   clubId Int
  //   role   String @default("member")
  //   ...
  // }

  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      role: "admin", 
    },
  });

  return !!membership;
}
