export const runtime = "nodejs";

export default async function UserCountPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-blue-600">User Count</h1>
        <p className="text-gray-600 mt-2">
          (Coming soon) Total users, active this week, and growth snapshots.
        </p>
      </section>
    </main>
  );
}