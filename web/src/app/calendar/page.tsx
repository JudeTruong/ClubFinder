"use client"; // tells Next.js this runs in the browser (not server-side)

import { useEffect, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react"; // main calendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // layout plugin for month grid


export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  
    useEffect(() => {
      // Fetch user's registered events from your API route
      fetch("/api/events/all")
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => console.error("Error fetching events:", err));
    }, []);
  return (
    
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <header className="flex justify-between items-center w-full max-w-4xl p-6">
        <h1 className="text-4xl font-bold">ClubFinder General Calendar</h1>

        <Link
          href="/calendar/my_calendar" // this is where your personal calendar page lives
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          My Calendar
        </Link>
      </header>

      <div className="w-full max-w-4xl p-6">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
        />
      </div>

    </main>
  );
}
