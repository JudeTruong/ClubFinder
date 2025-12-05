"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EventItem = {
  id: number;
  title: string;
  description?: string | null;
  date: string | Date;
  location?: string | null;
};

export default function ClubManagementPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/events/all");
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-semibold text-blue-600 mb-4">Club Management</h1>
        <div className="text-gray-500">Loading events…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-600">Club Management</h1>
        <Link
          href="/event_timeline/new"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
        >
          + Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-gray-500 text-center col-span-full border border-dashed border-gray-300 rounded-xl p-8 bg-white shadow-sm">
          <p className="font-medium text-lg mb-1">No events yet</p>
          <p className="text-sm text-gray-500">
            Be the first to{" "}
            <Link
              href="/events/new"
              className="text-blue-600 underline hover:text-blue-700"
            >
              create one
            </Link>
            .
          </p>
        </div>
      ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
      >
      <h2 className="font-semibold text-lg text-blue-600">{ev.title}</h2>
      {ev.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {ev.description}
        </p>
      )}
    </div>
  ))}
</div>
      )}
    </div>
  );
}
