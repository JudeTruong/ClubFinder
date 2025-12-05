"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Link from "next/link";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Fetch user events
  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    fetch(`/api/events?userId=${userId}`)
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
  }, [userId]);

  return (
    <>
      {/* GLOBAL GRADIENT BACKGROUND */}
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

        {/* NAVBAR (same across all pages) */}
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
        <header className="flex justify-between items-center w-full max-w-4xl px-6 mb-8">
          <h1 className="text-5xl font-extrabold text-violet-900 drop-shadow">
            Personal Calendar
          </h1>

          {userId ? (
            <p className="text-sm text-gray-700">
              Logged in as: <span className="font-medium">{userId}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">Loading user...</p>
          )}
        </header>

        {/* CALENDAR WRAPPER */}
        <div className="w-full max-w-4xl px-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
            />
          </div>
        </div>
      </main>
    </>
  );
}
