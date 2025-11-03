"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRouter } from "next/navigation"; // for client-side navigation

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
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
          href="/calendar/my_calendar"
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
          eventClick={(info) => {
            // Option A: Navigate to a Next.js route
            router.push(`/events/${info.event.id}`);
     
            // Option B: Open external link (if event has one)
            // window.open(info.event.url, "_blank");

            // Prevent the default browser navigation
            info.jsEvent.preventDefault();
          }}
        />
      </div>
    </main>
  );
}

