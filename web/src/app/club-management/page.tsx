"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function ClubHomePage() {
  // ----- your existing state for tabs/search/directory -----
  const [tab, setTab] = useState<"all" | "my">("all");
  const [q, setQ] = useState("");
  const [clubs, setClubs] = useState<{ id: number; name: string; description?: string | null }[]>([]);
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
        const res = await fetch(`/api/clubs/search?${params.toString()}`, { cache: "no-store" });
        const data = await res.json();
        if (alive) setClubs(Array.isArray(data?.clubs) ? data.clubs : []);
      } catch {
        if (alive) setClubs([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    const t = setTimeout(run, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [dq]);

  const isEmpty = !clubs || clubs.length === 0;

return (
    <main className="min-h-screen bg-white">
      {/* Full height white background */}

      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Page container with consistent padding */}

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-600">My Clubs</h1>
        {/* Shows "My Clubs" heading */}

        {/* Search bar */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search your clubs
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a club name…"
            className="w-full rounded-lg border text-gray-700 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Results */}
        <div className="mt-6">
          {loading ? (
            // Loading state
            <div className="text-gray-500">Loading your clubs…</div>
          ) : isEmpty ? (
            // No clubs found
            <div className="text-gray-500 border border-dashed border-gray-300 rounded-xl p-8 bg-white shadow-sm">
              You haven’t joined or created any clubs yet.
            </div>
          ) : (
            // Render club list
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((c) => (
                <li
                  key={c.id}
                  className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <h2 className="font-semibold text-lg text-blue-600">{c.name}</h2>
                  {c.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{c.description}</p>
                  )}

                  {/* Example: management buttons */}
                   <div className="mt-3 flex gap-2">
                    <Link

                      href={`/club-management/event_timeline?clubId=${c.id}`}
                      className="text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 text-center"
                    >
                      Events
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}