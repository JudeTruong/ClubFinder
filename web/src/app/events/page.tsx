// Events.jsx
// This component displays a list of upcoming events.
// Later you'll fetch these from your database (e.g., Supabase, Firestore).

export default function Events() {
  // TEMPORARY DATA — replace this later with real DB fetch
  const events = [
    {
      title: "Night Market",
      date: "Oct 22, 2025",
      location: "Laurier Quad",
      description: "A lively outdoor market with food, games, and cultural performances.",
    },
    {
      title: "Culture Night",
      date: "Nov 5, 2025",
      location: "Science Atrium",
      description: "Showcasing Vietnamese traditions, art, and music.",
    },
    {
      title: "Charity Gala",
      date: "Dec 10, 2025",
      location: "Senate Hall",
      description: "A formal event to raise funds for student scholarships.",
    },
  ];

  return (
    // MAIN CONTAINER — centers the page
    <main className="min-h-screen bg-blue-50 text-gray-800 p-8 flex flex-col items-center">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold mb-2 text-center">
        Upcoming Event for CLUB
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        this event page will be club specific
      </p>

      {/* GRID CONTAINER — displays event cards side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {events.map((event, index) => (
          // SINGLE EVENT CARD
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-1">
              <strong>Date:</strong> {event.date}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-gray-700 mb-4">{event.description}</p>

            {/* Details button (you can later link this to /events/[id]) */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
