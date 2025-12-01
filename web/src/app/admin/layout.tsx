import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  // 1) Read user from cookie
  const sid = (await cookies()).get("sid")?.value;
  const userId = sid ? Number(sid) : NaN;

  // Not logged in → no admin
  if (!sid || Number.isNaN(userId)) {
    redirect("/");        // or "/login" if you prefer
  }

  // 2) Check if this user is an admin of any club
  // 🔧 Adjust this query to match your schema.

  // Option A: if your Membership model has a boolean `isAdmin`
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      role: "member",
    },
  });

  // Option B (comment out A, use this) if you store a `role` string:
  /*
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      role: "ADMIN", // or "PRESIDENT" / "EXEC" etc.
    },
  });
  */

  if (!membership) {
    // Logged in but not a club admin → hide admin dashboard
    redirect("/");        // or some "Not authorized" page
  }

  // 3) User *is* admin → show dashboard as usual
  return <>{children}</>;
}