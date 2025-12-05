"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRouter } from "next/navigation";

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
    <>
      {/* Global full-page gradient */}
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: linear-gradient(135deg, #dee3ff, #f3e8ff, #dae8ff);
          background-attachment: fixed;
        }
      `}</style>

      <main className="min-h-screen w-full flex flex-col items-center">

        {/* NAVBAR */}
        <nav className="w-full flex justify-end px-10 py-6 gap-4">
          <Link href="/auth/login" className="px-5 py-2 rounded-full border shadow-sm font-semibold bg-orange-200 border-orange-300 text-orange-900 hover:shadow-lg hover:-translate-y-1 transition">
            Login
          </Link>
          <Link href="/auth/signup" className="px-5 py-2 rounded-full border shadow-sm font-semibold bg-rose-200 border-rose-300 text-rose-900 hover:shadow-lg hover:-translate-y-1 transition">
            Sign Up
          </Link>
          <Link href="/login" className="px-5 py-2 rounded-full border shadow-sm font-semibold bg-green-200 border-green-300 text-green-900 hover:shadow-lg hover:-translate-y-1 transition">
            Club Login
          </Link>
          <Link href="/admin/login" className="px-5 py-2 rounded-full border shadow-sm font-semibold bg-purple-200 border-purple-300 text-purple-900 hover:shadow-lg hover:-translate-y-1 transition">
            Admin Login
          </Link>
        </nav>

        {/* HEADER */}
        <header className="w-full max-w-4xl px-6 flex justify-between items-center mb-6">
          <h1 className="text-5xl font-extrabold text-violet-900 drop-shadow">
            Calendar
          </h1>

          <Link
            href="/calendar/my_calendar"
            className="px-5 py-2 rounded-full border shadow-sm font-semibold bg-blue-200 border-blue-300 text-blue-900 hover:shadow-lg hover:-translate-y-1 transition"
          >
            My Calendar
          </Link>
        </header>

        {/* CALENDAR CONTAINER */}
        <div className="w-full max-w-4xl px-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
              eventClick={(info) => {
                router.push(`/events/${info.event.id}`);
                info.jsEvent.preventDefault();
              }}
            />
          </div>
        </div>

      </main>
    </>
  );
}
