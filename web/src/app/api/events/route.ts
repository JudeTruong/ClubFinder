// src/app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const runtime = "nodejs";

function readSid(req: NextRequest): number | null {
  const sid = req.cookies.get("sid")?.value ?? null;
  if (!sid) return null;
  const userId = Number(sid);
  return Number.isFinite(userId) ? userId : null;
}

export async function POST(req: NextRequest) {
  const { title, description, date, location, clubId, imageUrl } = await req.json();

  const userId = readSid(req);
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!title || !description || !date || !location || !clubId) {
    return NextResponse.json(
      { error: "title, description, date, location, clubId required" },
      { status: 400 }
    );
  }

  const when = new Date(date);
  if (Number.isNaN(when.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const club = await prisma.club.findUnique({ where: { id: Number(clubId) } });
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  const member = await prisma.membership.findFirst({
    where: { userId, clubId: Number(clubId) },
  });
  if (!member) {
    return NextResponse.json({ error: "User is not a member of this club" }, { status: 403 });
  }

  const ev = await prisma.event.create({
    data: {
      title,
      description,
      date: when,
      location,
      imageUrl: imageUrl ?? null,
      clubId: Number(clubId),
      // If you add createdById to schema, store it here.
      // createdById: userId,
    },
  });
  
  return NextResponse.json({ id: ev.id, ok: true }, { status: 201 });
}

