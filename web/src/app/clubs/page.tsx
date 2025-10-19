// ClubPage.jsx
// This file defines the Club Page UI using React (Next.js) + Tailwind CSS.
// It includes a header, logo, subscribe button, about section, and upcoming events list.

import Link from "next/link";

export default function ClubPage() {
  return (
    // MAIN PAGE CONTAINER — centers everything and gives background color
    <main className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-gray-800 p-8">

      {/* WHITE CARD CONTAINER */}
      <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-6">

        {/* HEADER SECTION — Club name, logo, and Subscribe button */}
        <div className="flex items-center justify-between mb-6">
          {/* Club name as clickable link */}
          <Link href="/clubs/lvsa" className="text-3xl font-bold hover:text-blue-600 transition">
            LVSA
          </Link>

          {/* Right side: logo + subscribe button */}
          <div className="flex items-center gap-4">
            {/* Club logo (clickable) */}
            <Link href="/clubs/lvsa">
              <img
                src="/lvsa-logo.png"     // Replace with your actual image path in /public folder
                alt="Club Logo"
                className="w-16 h-16 rounded-full object-cover border hover:opacity-80 transition"
              />
            </Link>

            {/* Subscribe button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <section>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600">
            The Laurier Vietnamese Student Association (LVSA) is dedicated to celebrating
            Vietnamese culture through food, community, and events that connect students.
          </p>
        </section>

        {/* UPCOMING EVENTS SECTION */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
          <ul className="space-y-3">
            <li className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <strong>Night Market</strong> — Oct 22, 2025 • Laurier Quad
            </li>
            <li className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <strong>Culture Night</strong> — Nov 5, 2025 • Science Atrium
            </li>
            <li className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <strong>Charity Gala</strong> — Dec 10, 2025 • Senate Hall
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

