// force Node runtime (Prisma won't run on Edge)
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

// POST /api/subscriptions/club  body: { clubId:number, action:"subscribe"|"unsubscribe" }
export async function POST(req: NextRequest) {
  const userId = readSid(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clubId, action } = (await req.json()) as {
    clubId?: number;
    action?: "subscribe" | "unsubscribe";
  };

  if (!clubId || !["subscribe", "unsubscribe"].includes(String(action)))
    return NextResponse.json({ error: "Bad request" }, { status: 400 });

  if (action === "subscribe") {
    await prisma.subscriptions.upsert({
      // uses @@unique([userId, clubId]) in your schema
      where: { userId_clubId: { userId, clubId } },
      update: {},
      create: { userId, clubId },
    });
    return NextResponse.json({ ok: true, subscribed: true });
  } else {
    await prisma.subscriptions.deleteMany({ where: { userId, clubId } });
    return NextResponse.json({ ok: true, subscribed: false });
  }
}

// GET /api/subscriptions/club?clubId=123  -> { subscribed: boolean }
export async function GET(req: NextRequest) {
  const userId = readSid(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clubId = Number(new URL(req.url).searchParams.get("clubId") ?? "");
  if (!clubId) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const row = await prisma.subscriptions.findUnique({
    where: { userId_clubId: { userId, clubId } },
    select: { id: true },
  });

  return NextResponse.json({ subscribed: !!row });
}
