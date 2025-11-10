import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

const prisma_con = new PrismaClient();
//function to get events for a specific user
export async function GET(request: Request) {
  try {
    //pull clubID
  const { searchParams } = new URL(request.url);
  const clubId = Number(searchParams.get("clubId"));

  const events = await prisma.event.findMany({
      where: { clubId }, // Filter by club
      orderBy: { date: "asc" }, // Optional: sort by date ascending
      select: {
        id: true,
        title: true,
        date: true,
        description: true,
        location: true,
      },
    });


//add the events which the user has registered for into an array of events
  const myevents = events.map((e) => ({
    id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      date: e.date ? e.date.toISOString().split("T")[0] : null,
  }));

  return NextResponse.json({ events: myevents });
  } catch (err) {
    console.error("Error fetching club events:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}