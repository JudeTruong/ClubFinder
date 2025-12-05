import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";

export default async function ClubDetailsPage({ params }: { params: { id: string } }) {
  const clubId = Number(params.id);

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      events: {
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!club) {
    return (
      <>
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #dee3ff, #f3e8ff, #dae8ff);
            background-attachment: fixed;
            height: 100%;
            width: 100%;
          }
        `}</style>

        <main className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 text-gray-600 text-center">
            Club not found.
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* GLOBAL GRADIENT */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #dee3ff, #f3e8ff, #dae8ff);
          background-attachment: fixed;
          height: 100%;
          width: 100%;
        }
      `}</style>

      <main className="min-h-screen flex justify-center px-4 py-12">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">

          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-violet-900 drop-shadow-sm">
                {club.name}
              </h1>

              {club.category && (
                <p className="text-gray-600 text-lg mt-1">{club.category}</p>
              )}

              {club.description && (
                <p className="text-gray-800 mt-3 leading-relaxed">
                  {club.description}
                </p>
              )}
            </div>

            {/* Subscribe Button */}
            <SubscribeButton kind="club" targetId={club.id} />
          </div>

          {/* UPCOMING EVENTS */}
          <h2 className="text-2xl font-bold text-violet-900 mt-6">Upcoming Events</h2>

          {club.events.length === 0 ? (
            <p className="text-gray-600 bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
              No upcoming events.
            </p>
          ) : (
            <ul className="space-y-3 mt-3">
              {club.events.map((e) => (
                <li
                  key={e.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition hover:-translate-y-1"
                >
                  <Link
                    href={`/events/${e.id}`}
                    className="text-violet-900 font-semibold text-lg hover:underline"
                  >
                    {e.title}
                  </Link>

                  <p className="text-sm text-gray-600 mt-1">
                    {e.date.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
