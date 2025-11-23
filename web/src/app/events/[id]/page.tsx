import { prisma } from "@/lib/prisma";
import SubscribeButton from "@/components/SubscribeButton";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const eventId = Number(params.id);

  // rename to avoid DOM Event type collision
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      club: true,
      registrations: { include: { user: true } },
    },
  });

  if (!evt) {
    return <div className="text-center text-gray-500 mt-20">Event not found</div>;
  }

  return (
    <main className="min-h-screen flex justify-center bg-gray-50 text-gray-800 p-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{evt.title}</h1>
            <p className="text-gray-500">{evt.club?.name}</p>
          </div>

          {/* Use evt.id; button must be inside JSX */}
          <SubscribeButton kind="event" targetId={evt.id} />
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Date:</strong> {evt.date.toLocaleString()}</p>
          {evt.location && <p><strong>Location:</strong> {evt.location}</p>}
        </div>

        {evt.description && <p>{evt.description}</p>}
      </div>
    </main>
  );
}
