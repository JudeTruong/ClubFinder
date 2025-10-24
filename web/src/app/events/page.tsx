import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  // Load all events from DB, including their club name
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: {
      club: {
        select: { name: true },
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      {/* header row with title + create button */}
      <section className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Upcoming Events
          </h1>
          <p className="text-gray-600 text-base">
            Browse events from clubs on campus.
          </p>
        </div>

        <Link
          href="/events/new"
          className="inline-block bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-center"
        >
          Create Event
        </Link>
      </section>

      {/* your event cards stay here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
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
          events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col"
            >
              <h2 className="text-xl font-semibold text-blue-600">
                {ev.title ?? "Untitled Event"}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {ev.date
                  ? `${new Date(ev.date).toLocaleString()} · ${ev.location ?? "No location"}`
                  : ev.location ?? "No location"}
              </p>

              <p className="text-gray-700 mb-3">
                {ev.description ?? "No description"}
              </p>

              <p className="text-xs text-gray-500 mt-auto">
                Club:{" "}
                {ev.club?.name
                  ? ev.club.name
                  : ev.clubId
                  ? `Club #${ev.clubId}`
                  : "Unknown club"}
                {ev.imageUrl ? ` · Image: ${ev.imageUrl}` : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}




// src/app/events/page.tsx
//import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient();

//export default async function EventsPage() {
  // Fetch all events and include their related club info
  //const events = await prisma.event.findMany({
   //include: { club: true }, 
  //});

  //return (
    //<main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      //h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      //{events.length === 0 ? ( 
        //<p>No events yet.</p>
      //) : (
        //<ul className="space-y-4 w-full max-w-2xl">
          //{events.map((event) => (
            //<li
              //key={event.id}
              //className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            //>
             //<h2 className="text-xl font-semibold">{event.title}</h2>
              //<p className="text-gray-600">{event.description}</p>
              //<p>
                //<strong>Date:</strong>{" "}
                //{new Date(event.date).toLocaleDateString()}
              //</p>
              //<p>
                //<strong>Location:</strong> {event.location}
              //</p>
              //<p>
                //<strong>Club:</strong> {event.club?.name}
              //</p>
            //</li>
          //))}
        //</ul>
      //)}
    //</main>
  //);
//}

