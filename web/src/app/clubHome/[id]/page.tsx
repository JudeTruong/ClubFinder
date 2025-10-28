import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ClubDetailsPage({ params }: { params: { id: string } }) {
  const clubId = parseInt(params.id);

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      events: {
        where: { date: { gte: new Date() } }, // upcoming only
        orderBy: { date: "asc" },
      },
    },
  });

  if (!club) {
    return (
      <main className="min-h-screen flex justify-center items-center text-gray-600">
        Club not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">{club.name}</h1>
        <p className="text-gray-500 mb-2">{club.category}</p>
        <p className="text-gray-700 mb-6">{club.description}</p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Upcoming Events
        </h2>

        {club.events.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <ul className="space-y-4">
            {club.events.map((ev) => (
              <li
                key={ev.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <Link
                  href={`/events/${ev.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {ev.title}
                </Link>
                <p className="text-sm text-gray-600">
                  📅 {new Date(ev.date).toLocaleDateString()}
                  {ev.location && <> · 📍 {ev.location}</>}
                </p>
                {ev.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {ev.description.slice(0, 100)}...
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <Link
            href="/clubHome"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to all clubs
          </Link>
        </div>
      </div>
    </main>
  );
}
