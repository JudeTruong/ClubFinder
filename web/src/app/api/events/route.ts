import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, date, location, clubId, imageUrl, userId } = body;

  // 1. Basic required fields
  if (!title || !description || !date || !location || !clubId || !userId) {
    return NextResponse.json(
      { error: "title, description, date, location, clubId, userId required" },
      { status: 400 }
    );
  }

  // 2. Parse date
  const when = new Date(date);
  if (Number.isNaN(when.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  // 3. Check club exists
  const club = await prisma.club.findUnique({
    where: { id: Number(clubId) },
  });
  if (!club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  // 4. Check membership
  const member = await prisma.membership.findFirst({
    where: {
      userId: Number(userId),
      clubId: Number(clubId),
    },
  });

  if (!member) {
    // User is not allowed to post to this club
    return NextResponse.json(
      { error: "User is not a member of this club" },
      { status: 403 }
    );
  }

  // 5. Create event
  const ev = await prisma.event.create({
    data: {
      title,
      description,
      date: when,
      location,
      imageUrl,
      clubId: Number(clubId),
    },
  });

  return NextResponse.json(
    { id: ev.id, ok: true },
    { status: 201 }
  );
}

