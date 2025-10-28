import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all events including ID
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        description: true,
      },
      orderBy: { date: "asc" },
    });

    // Format for FullCalendar — date-only (no time)
    const formatted = events.map((e) => ({
      id: e.id.toString(),             // must be string for routing
      title: e.title,
      start: e.date.toISOString().split("T")[0], // ✅ only YYYY-MM-DD
      allDay: true,                    // ✅ tells FullCalendar to treat as all-day
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
