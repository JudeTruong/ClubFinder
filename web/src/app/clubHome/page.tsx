import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ClubHomePage() {
  // Fetch all clubs
  const clubs = await prisma.club.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      contactEmail: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">Club Directory</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {clubs.map((club) => (
          <Link
            key={club.id}
            href={`/clubHome/${club.id}`}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-blue-600">{club.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{club.category}</p>
            <p className="text-gray-700 text-sm line-clamp-3 mb-4">
              {club.description || "No description provided."}
            </p>
            {club.contactEmail && (
              <p className="text-xs text-gray-500">
                Contact: <span className="underline">{club.contactEmail}</span>
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
