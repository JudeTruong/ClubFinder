import { prisma } from "@/lib/prisma";

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      club: true,
      registrations: {
        include: {
          user: true, // pull attendee info
        },
      },
    },
  });

  if (!event) {
    return <div className="text-center text-gray-500 mt-20">Event not found</div>;
  }

  return (
    <main className="min-h-screen flex justify-center bg-gray-50 text-gray-800">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 m-6">
        {/* Header */}
        <img
          src={event.imageUrl || "/placeholder.jpg"}
          alt={event.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
        <h1 className="text-3xl font-bold mb-1">{event.title}</h1>
        <p className="text-gray-600 mb-2">Hosted by {event.club?.name}</p>

        {/* Details */}
        <div className="text-gray-500 mb-6">
          📅 {new Date(event.date).toLocaleDateString()} <br />
          🕓{" "}
          {new Date(event.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          <br />
          📍 {event.location || "Location TBA"}
        </div>

        {/* Description */}
        <p className="whitespace-pre-line text-lg leading-relaxed mb-8">
          {event.description || "No description provided."}
        </p>

        {/* Attendees */}
        <h2 className="text-xl font-semibold mb-3">
          Registrations ({event.registrations.length})
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {event.registrations.map((r) => (
            <li key={r.id}>{r.user.name}</li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold mb-3">
          Attendees ({event.attendees})
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {event.registrations.map((e) => (
            <li key={e.id}>{e.user.name}</li>
          ))}
        </ul>

        {/* Back */}
        <a
          href="/calendar"
          className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Calander
        </a>
      </div>
    </main>
  );
}
