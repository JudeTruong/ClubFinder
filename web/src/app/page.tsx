import Link from "next/link";

import { PrismaClient } from "@prisma/client";
 {/* importing database client*/}
const prisma = new PrismaClient();

export default async function Home() {
  const users= await prisma.user.findMany();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 text-gray-800 p-8">
      
      {/* HEADER SECTION */}
      <h1 className="text-5xl font-extrabold mb-4 text-center text-blue-700">
        ClubFinder
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-xl">
        Discover student clubs, explore upcoming events, and stay connected with your campus community.
      </p>

      {/* NAVIGATION GRID — now includes ClubHome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl text-center">
        
        {/* ClubHome Card */}
        <Link
          href="/clubHome"
          className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-purple-400 transition"
        >
          <h2 className="text-2xl font-bold mb-2 text-purple-600">Club Home</h2>
          <p className="text-gray-600">
            this is where people browse for clubs
          </p>
        </Link>

        {/* Clubs Card */}
        <Link
          href="/clubs"
          className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-blue-400 transition"
        >
          <h2 className="text-2xl font-bold mb-2 text-blue-600">Clubs</h2>
          <p className="text-gray-600">
            this is the individual club pages
          </p>
        </Link>

        {/* Calendar Card */}
        <Link
          href="/calendar"
          className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-yellow-400 transition"
        >
          <h2 className="text-2xl font-bold mb-2 text-yellow-600">Calendar</h2>
          <p className="text-gray-600">
            View all events across campus in one place.
          </p>
        </Link>

        {/* Events Card */}
        <Link
          href="/events"
          className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-green-400 transition"
        >
          <h2 className="text-2xl font-bold mb-2 text-green-600">Events</h2>
          <p className="text-gray-600">
            See what’s happening soon and join in!
          </p>
        </Link>
      </div>

      {/* test block to display database info */}
      <footer className="mt-12 text-sm text-gray-500 text-center">
        {users.map((user) => (
        <li
          key={user.id}
          className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
          >
          <h2 className="text-lg font-semibold">{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.role}</p>
        </li>
      ))}
      </footer>
      

      


      {/* FOOTER */}
      <footer className="mt-12 text-sm text-gray-500 text-center">
        justin has such a fat ass
      </footer>
    </main>
  );
}
