// src/app/admin/page.tsx
export const runtime = "nodejs";

import Link from "next/link";

export default async function AdminHome() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Choose a tool below to view platform metrics.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Club Analysis */}
          <Link
            href="/userCount/club-analysis"
            className="block border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              Club Analysis
            </h2>
            <p className="text-gray-600 mt-2">
              Explore club activity, events, and engagement trends.
            </p>
            <div className="mt-4 inline-flex items-center text-sm text-blue-700 underline">
              Open
            </div>
          </Link>

          {/* User Count */}
          <Link
            href="/userCount/user-count"
            className="block border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              User Count
            </h2>
            <p className="text-gray-600 mt-2">
              See total users and simple breakdowns at a glance.
            </p>
            <div className="mt-4 inline-flex items-center text-sm text-blue-700 underline">
              Open
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
