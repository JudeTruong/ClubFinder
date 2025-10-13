import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Welcome to ClubFinder</h1>
      <p className="text-lg text-gray-600 mb-6">
        This is your new Next.js frontend — clean and ready to build on.
      </p>

      {/* Navigation buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/clubs"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Clubs
        </Link>

        <Link
          href="/calendar"
          className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition"
        >
          View Calendar
        </Link>

        <Link
          href="/events"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          View Events
        </Link>
      </div>
    </main>
  );
}
