import { prisma } from "@/lib/prisma";

export default async function UsersAndClubsPage() {
  // Fetch clubs with member counts
  const clubs = await prisma.club.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      _count: {
        select: { memberships: true },
      },
    },
  });

  // Fetch all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      interests: true,
    },
  });

  return (
    <main className="p-8 space-y-16">
      <h1 className="text-3xl font-bold">Admin — Clubs & Users Overview</h1>

      {/* ---------------- CLUB TABLE ---------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Clubs</h2>

        <table className="w-full bg-white shadow-md rounded border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Club</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left"># Members</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.id} className="border-t">
                <td className="px-6 py-4">{club.name}</td>
                <td className="px-6 py-4">{club.category}</td>
                <td className="px-6 py-4">{club._count.memberships}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------------- USER TABLE ---------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>

        <table className="w-full bg-white shadow-md rounded border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Interests</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.interests ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
