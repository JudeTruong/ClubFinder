import { prisma } from "@/lib/prisma";
import SubscribeButton from "@/components/SubscribeButton";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const eventId = Number(params.id);

  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      club: true,
      registrations: { include: { user: true } },
    },
  });

  if (!evt) {
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

        <main className="min-h-screen flex items-center justify-center text-gray-500">
          <div className="bg-white rounded-xl shadow p-10 border border-gray-200 text-center w-full max-w-md">
            Event not found
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

          {/* Title + Button */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-violet-900 drop-shadow-sm">
                {evt.title}
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                {evt.club?.name}
              </p>
            </div>

            <SubscribeButton kind="event" targetId={evt.id} />
          </div>

          {/* Event Info */}
          <div className="text-gray-700 space-y-1 text-base bg-violet-50 border border-violet-200 rounded-lg p-4">
            <p>
              <strong className="text-violet-900">Date:</strong>{" "}
              {evt.date.toLocaleString()}
            </p>

            {evt.location && (
              <p>
                <strong className="text-violet-900">Location:</strong>{" "}
                {evt.location}
              </p>
            )}
          </div>

          {/* Description */}
          {evt.description && (
            <p className="text-gray-800 leading-relaxed bg-white rounded-lg p-2">
              {evt.description}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
