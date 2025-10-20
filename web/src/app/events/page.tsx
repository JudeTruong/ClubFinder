// src/app/events/page.tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function EventsPage() {
  // Fetch all events and include their related club info
  const events = await prisma.event.findMany({
    include: { club: true }, 
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {events.length === 0 ? ( 
        <p>No events yet.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-2xl">
          {events.map((event) => (
            <li
              key={event.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Club:</strong> {event.club?.name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

