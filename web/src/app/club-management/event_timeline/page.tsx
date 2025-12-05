"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubId = searchParams.get("clubId");

  useEffect(() => {
    if (!clubId) return;
    let ignore = false;

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
    <>
      {/* Soft Pastel Background */}
      <style>{`
        html, body {
          background: linear-gradient(135deg, #eef0ff, #f7eaff, #e7f0ff);
          background-attachment: fixed;
        }
      `}</style>

      <main className="min-h-screen flex flex-col items-center px-6 py-12 text-gray-800">
        
        {/* Page Header */}
        <header className="flex justify-between items-center w-full max-w-4xl mb-6">
          <h1 className="text-4xl font-bold text-indigo-900">
            Club Event Calendar
          </h1>

          <Link
            href={`/club-management/event_timeline/add_event?clubId=${clubId}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition font-medium"
          >
            + Add Event
          </Link>
        </header>

        {/* Calendar Container */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            eventClick={(info) => {
              router.push(`/club-management/event_timeline/${info.event.id}`);
              info.jsEvent.preventDefault();
            }}
          />
        </div>
      </main>
    </>
  );
}
