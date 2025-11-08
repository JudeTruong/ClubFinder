import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sid = (await cookies()).get("sid")?.value;
    const userId = sid ? Number(sid) : undefined;
    const now = new Date();

    let events;

    if (userId) {
      // 1) find clubs the user is subscribed to
      const memberships = await prisma.membership.findMany({
        where: { userId },
        select: { clubId: true },
      });
      const clubIds = memberships.map(m => m.clubId);

      if (clubIds.length > 0) {
        // 2) upcoming events from those clubs
        events = await prisma.event.findMany({
          where: {
            clubId: { in: clubIds },
            date: { gte: now },
          },
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            club: { select: { id: true, name: true } },
          },
          orderBy: { date: "asc" },
          take: 12,
        });
      }
    }

    // Fallback: general upcoming events if not logged in or no subs found
    if (!events || events.length === 0) {
      events = await prisma.event.findMany({
        where: { date: { gte: new Date() } },
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          location: true,
          club: { select: { id: true, name: true } },
        },
        orderBy: { date: "asc" },
        take: 12,
      });
    }

    // Normalize date to ISO strings for client safety
    const payload = events.map(e => ({
      ...e,
      date: e.date ? e.date.toISOString() : null,
    }));

    return NextResponse.json({ events: payload });
  } catch (e) {
    return NextResponse.json({ events: [] }, { status: 200 });
  }
}
