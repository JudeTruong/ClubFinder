import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UserCountPage() {
  const clubs = await prisma.club.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      _count: { select: { memberships: true } },
    },
    orderBy: { name: "asc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-10">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          View all users, clubs, and membership statistics.
        </p>

        <Link
          href="/"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white shadow rounded-xl text-center border border-gray-100">
          <h2 className="text-5xl font-extrabold text-blue-600">
            {users.length}
          </h2>
          <p className="text-gray-600 mt-2">Total Users</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl text-center border border-gray-100">
          <h2 className="text-5xl font-extrabold text-purple-600">
            {clubs.length}
          </h2>
          <p className="text-gray-600 mt-2">Total Clubs</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl text-center border border-gray-100">
          <h2 className="text-5xl font-extrabold text-pink-600">
            {clubs.reduce((sum, c) => sum + c._count.memberships, 0)}
          </h2>
          <p className="text-gray-600 mt-2">Total Memberships</p>
        </div>
      </div>

      {/* CLUB TABLE */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Clubs Overview
        </h2>

        <div className="overflow-hidden rounded-xl shadow border border-gray-200">
          <table className="w-full bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left">Club Name</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Members</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => (
                <tr
                  key={club.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{club.name}</td>
                  <td className="py-3 px-6 text-gray-600">{club.category}</td>
                  <td className="py-3 px-6 font-semibold text-purple-600">
                    {club._count.memberships}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Users Overview
        </h2>

        <div className="overflow-hidden rounded-xl shadow border border-gray-200">
          <table className="w-full bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6 text-gray-600">{user.email}</td>
                  <td className="py-3 px-6 font-semibold text-blue-600">
                    {user.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
