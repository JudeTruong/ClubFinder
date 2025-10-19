// src/app/events/[slug]/page.jsx
// Event Detail Page — shows full details about a single event.
// Replace the static `event` object later with data fetched from a database.

import Link from "next/link";

export default function EventDetail() {
  // TEMPORARY DATA — later you’ll fetch this using the slug (e.g., params.slug)
  const event = {
    title: "Night Market",
    date: "October 22, 2025",
    location: "Laurier Quad",
    image: "/night-market.jpg", // optional placeholder
    description: `
      The Laurier Vietnamese Student Association invites you to our annual Night Market!
      Enjoy a vibrant evening filled with cultural performances, traditional food booths,
      and interactive games. Bring your friends, meet new people, and experience
      the best of Laurier’s multicultural community.
    `,
  };

  return (
    <main className="min-h-screen bg-blue-50 text-gray-800 p-8 flex flex-col items-center">
      {/* CONTAINER CARD */}
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-3xl">
        {/* Event Image (optional) */}
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        {/* Event Title */}
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-700">
          {event.title}
        </h1>

        {/* Date and Location */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6 text-gray-600 text-center">
          <p>
            <strong>Date:</strong> {event.date}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        </div>

        {/* Event Description */}
        <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
          {event.description}
        </p>

        {/* Back button */}
        <div className="flex justify-center">
          <Link
            href="/events"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    </main>
  );
}
