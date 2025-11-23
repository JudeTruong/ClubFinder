import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";

export default async function ClubDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const clubId = Number(params.id);

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{club.name}</h1>
            <p className="text-gray-500">{club.category}</p>
            <p className="mt-2 text-gray-600">{club.description}</p>
          </div>

          {/* <-- The button belongs here, inside JSX, using club.id */}
          <SubscribeButton kind="club" targetId={club.id} />
        </div>

        <h2 className="mt-8 text-xl font-semibold">Upcoming Events</h2>
        {club.events.length === 0 ? (
          <p className="text-gray-500 mt-2">No upcoming events.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {club.events.map((e) => (
              <li key={e.id} className="border rounded-lg p-3">
                <Link href={`/events/${e.id}`} className="font-medium hover:underline">
                  {e.title}
                </Link>
                <div className="text-sm text-gray-600">
                  {e.date.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
