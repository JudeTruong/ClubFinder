"use client"; // tells Next.js this runs in the browser (not server-side)

import FullCalendar from "@fullcalendar/react"; // main calendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // layout plugin for month grid


export default function CalendarPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Welcome to ClubFinder Calendar</h1> //header
      <p className="text-lg text-gray-600"> 
        This is the Calendar Page — clean and ready to build on.
      </p>
      
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "Poker Club Event", date: "2025-10-07" },
          { title: "Debate Club Orientation", date: "2025-10-09" },
        ]}
        height="auto"
      />

    </main>
  );
}
