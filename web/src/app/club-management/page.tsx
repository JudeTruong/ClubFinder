"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function ClubHomePage() {
  const [tab, setTab] = useState<"all" | "my">("my");
  const [q, setQ] = useState("");
  const [clubs, setClubs] = useState<
    { id: number; name: string; description?: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const dq = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (dq) params.set("q", dq);
        params.set("filter", "my");

        const res = await fetch(`/api/clubs/search?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (alive) setClubs(Array.isArray(data?.clubs) ? data.clubs : []);
      } catch {
        if (alive) setClubs([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    const t = setTimeout(run, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [dq]);

  const isEmpty = clubs.length === 0;

  return (
    <>
      {/* Global pastel gradient */}
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: linear-gradient(135deg, #dee3ff, #f3e8ff, #dae8ff);
          background-attachment: fixed;
        }
      `}</style>

      <main className="min-h-screen w-full flex flex-col">

        {/* NAVBAR */}
        <nav className="w-full flex justify-end px-10 py-6 gap-4">
          <Link href="/auth/login" className="px-5 py-2 rounded-full bg-orange-200 border border-orange-300 text-orange-900 shadow-sm font-semibold hover:shadow-lg hover:-translate-y-1 transition">Login</Link>
          <Link href="/login" className="px-5 py-2 rounded-full bg-green-200 border border-green-300 text-green-900 shadow-sm font-semibold hover:shadow-lg hover:-translate-y-1 transition">Club Login</Link>
          <Link href="/admin/login" className="px-5 py-2 rounded-full bg-purple-200 border border-purple-300 text-purple-900 shadow-sm font-semibold hover:shadow-lg hover:-translate-y-1 transition">Admin Login</Link>
        </nav>

        {/* PAGE CONTENT */}
        <section className="mx-auto max-w-6xl px-6 py-10">

          {/* TITLE */}
          <h1 className="text-5xl font-extrabold text-violet-900 drop-shadow mb-6">
            My Clubs
          </h1>

          {/* SEARCH BAR */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search your clubs
            </label>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type a club name..."
              className="w-full rounded-full border border-gray-300 px-5 py-3 shadow-sm text-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>

          {/* RESULTS */}
          {loading ? (
            <div className="text-gray-600">Loading your clubs…</div>
          ) : isEmpty ? (
            <div className="text-gray-500 border border-dashed border-gray-400 rounded-xl p-10 bg-white text-center shadow-sm">
              You haven’t joined or created any clubs yet.
            </div>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((c) => (
                <li
                  key={c.id}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition rounded-xl p-6"
                >
                  <h2 className="font-semibold text-xl text-violet-900">
                    {c.name}
                  </h2>

                  {c.description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {c.description}
                    </p>
                  )}

                  {/* BUTTON ROW */}
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/club-management/event_timeline?clubId=${c.id}`}
                      className="text-sm bg-blue-200 border border-blue-300 text-blue-900 rounded-full px-4 py-2 font-semibold hover:shadow-md hover:-translate-y-1 transition"
                    >
                      Events
                    </Link>

                    <Link
                      href={`/clubHome/${c.id}`}
                      className="text-sm bg-violet-200 border border-violet-300 text-violet-900 rounded-full px-4 py-2 font-semibold hover:shadow-md hover:-translate-y-1 transition"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
