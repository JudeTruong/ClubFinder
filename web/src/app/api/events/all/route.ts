import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // uses shared prisma instance

export async function GET() {
  try {
    // Fetch all events with ID and date
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date: true,
      },
      orderBy: { date: "asc" },
    });

    // ✅ Format for FullCalendar
    const formatted = events.map((e) => ({
      id: e.id.toString(),                   // required for router.push()
      title: e.title,
      start: e.date.toISOString().split("T")[0], // use 'start' instead of 'date'
      allDay: true,                          // optional: makes it show as all-day
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
