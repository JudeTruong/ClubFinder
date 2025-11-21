
import { prisma } from "@/lib/prisma";
import EventChartClient from "./EventChartClient"; 

import { Bar } from "react-chartjs-2";

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register the components used by Bar charts
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

  const registrationCount = event.registrations.length;
  const attendeeCount = event.attendees ?? 0; // make sure your event model has this field

  const data = {
    labels: ["Registrations", "Attendees"],
    datasets: [
      {
        label: "Count",
        data: [registrationCount, attendeeCount],
        backgroundColor: ["#3B82F6", "#10B981"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

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

        <h1>{event.title}</h1>

 <p className="text-gray-600 mb-4">Hosted by {event.club?.name}</p>
      {/* ✅ Pass computed data as props to the client component */}
      <EventChartClient
        registrationCount={event.registrations.length}
        attendeeCount={event.attendees ?? 0}
      />
        
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
