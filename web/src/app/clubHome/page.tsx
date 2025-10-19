// src/app/clubHome/page.jsx
// Club Home Page — serves as a directory for users to browse all clubs.

import Link from "next/link";

export default function ClubHome() {
  // TEMPORARY DATA (replace with DB fetch later)
  const clubs = [
    {
      id: 1,
      name: "Laurier Vietnamese Student Association (LVSA)",
      logo: "/lvsa-logo.png",
      description:
        "Celebrating Vietnamese culture through food, community, and campus events.",
      slug: "lvsa",
    },
    {
      id: 2,
      name: "Laurier Debate Society",
      logo: "/debate-logo.png",
      description:
        "Improving public speaking and critical thinking through debate competitions.",
      slug: "debate",
    },
    {
      id: 3,
      name: "Laurier Computer Science Society (LCSS)",
      logo: "/lcss-logo.png",
      description:
        "A hub for tech enthusiasts to collaborate, learn, and build innovative projects.",
      slug: "lcss",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      {/* PAGE HEADER */}
      <h1 className="text-4xl font-bold mb-3 text-center text-blue-700">
        Discover Student Clubs
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
        Explore all clubs at Laurier — find communities that match your interests,
        passions, and goals.
      </p>

      {/* CLUB GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
          >
            {/* Club logo */}
            <img
              src={club.logo}
              alt={`${club.name} Logo`}
              className="w-20 h-20 rounded-full object-cover border mb-4"
            />

            {/* Club name */}
            <h2 className="text-xl font-semibold mb-2 text-blue-600">
              {club.name}
            </h2>

            {/* Club description */}
            <p className="text-gray-600 mb-4">{club.description}</p>

            {/* View button */}
            <Link
              href={`/clubs/${club.slug}`}
              className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View More
            </Link>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="mt-12 text-sm text-gray-500 text-center">
        Can’t find your club?{" "}
        <Link
          href="/clubs/new"
          className="text-blue-600 hover:underline font-medium"
        >
          Add a Club
        </Link>
      </footer>
    </main>
  );
}
