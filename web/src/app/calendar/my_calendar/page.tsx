"use client"; // tells Next.js this runs in the browser (not server-side)

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // main calendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // layout plugin for month grid


export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  useEffect(() => {
    // Fetch user's registered events from your API route
    fetch(`/api/events?userId=${userId}`)
      .then(async (res) => {
        const text = await res.text();
        if (!text) throw new Error("Empty response");
        return JSON.parse(text);
      })
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);
    return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <header className="flex justify-between items-center w-full max-w-4xl p-6">
        <h1 className="text-4xl font-bold">ClubFinder Personal Calendar</h1>
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