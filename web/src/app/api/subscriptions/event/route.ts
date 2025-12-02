// web/src/app/api/subscriptions/event/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// read user id from cookie "sid"
function readSid(req: NextRequest): number | null {
  const raw = req.cookies.get("sid")?.value ?? null;
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

// POST /api/subscriptions/event
// body: { eventId:number, action:"subscribe"|"unsubscribe" }
export async function POST(req: NextRequest) {
  const userId = readSid(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId, action } = (await req.json()) as {
    eventId?: number;
    action?: "subscribe" | "unsubscribe";
  };

  if (!eventId || !["subscribe", "unsubscribe"].includes(String(action))) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (action === "subscribe") {
    // No @@unique on (userId,eventId), so guard manually to avoid duplicates
    const existing = await prisma.registration.findFirst({ where: { userId, eventId } });
    if (!existing) {
      await prisma.registration.create({
        data: { userId, eventId, status: "registered" },
      });
    }
    return NextResponse.json({ ok: true, subscribed: true });
  } else {
    await prisma.registration.deleteMany({ where: { userId, eventId } });
    return NextResponse.json({ ok: true, subscribed: false });
  }
}

// GET /api/subscriptions/event?eventId=123  -> { subscribed: boolean }
export async function GET(req: NextRequest) {
  const userId = readSid(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const eventId = Number(new URL(req.url).searchParams.get("eventId") ?? "");
  if (!eventId) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const row = await prisma.registration.findFirst({
    where: { userId, eventId },
    select: { id: true },
  });

  return NextResponse.json({ subscribed: !!row });
}
