"use client"; // tells Next.js this runs in the browser (not server-side)

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // main calendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // layout plugin for month grid


export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch user's registered events from your API route
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

    return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Welcome to ClubFinder Calendar</h1> //header
      <p className="text-lg text-gray-600"> 
        This is the Calendar Page — clean and ready to build on.
      </p>
      
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />

    </main>
  );
}