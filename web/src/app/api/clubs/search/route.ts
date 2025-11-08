import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const filter = (searchParams.get("filter") || "all").toLowerCase(); // 'all' | 'my'

  // If you don't have memberships, set filter to 'all' only and remove the memberships clause below.
  let where: any = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : undefined;

  // Optional: "My Clubs" based on session cookie "sid" → userId
  const sid = (await cookies()).get("sid")?.value;
  const userId = sid ? Number(sid) : undefined;

  const query =
    filter === "my" && userId
      ? {
          where: {
            ...where,
            memberships: { some: { userId } }, // remove if you don’t have this relation yet
          },
          select: { id: true, name: true, description: true },
          orderBy: { name: "asc" },
          take: 100,
        }
      : {
          where,
          select: { id: true, name: true, description: true },
          orderBy: { name: "asc" },
          take: 100,
        };

  const clubs = await prisma.club.findMany(query);
  return NextResponse.json({ clubs });
}

