"use client"; // tells Next.js this runs in the browser (not server-side)

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react"; // main calendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // layout plugin for month grid
import { useRouter } from "next/navigation"; // for client-side navigation


export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubId = searchParams.get("clubId");


  useEffect(() => {
      let ignore = false;
    // Fetch user's registered events from your API route
    fetch(`/api/events/club?clubId=${clubId}`)
      .then(async (res) => {
        const text = await res.text();
        if (!text) throw new Error("Empty response");
        return JSON.parse(text);
      })
      .then((data) => {
        if (!ignore) setEvents(data);
    })
      .catch((err) => console.error("Error fetching events:", err));
      return () => {
      ignore = true;
    };
  }, [clubId]);
    return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <header className="flex justify-between items-center w-full max-w-4xl p-6">
        <h1 className="text-4xl font-bold">ClubFinder Event</h1>
         <Link
          href={`/club-management/event_timeline/add_event`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
        >
          + Add Event
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
            router.push(`/club-management/event_timeline/${info.event.id}`);
     
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