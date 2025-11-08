"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// ---- your existing types/state/logic for the directory above ----

// Helper for friendly dates in the Suggested bar (safe)
function fmtDate(d: string | null | undefined) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }); // e.g., "Nov 8"
}

type SuggestedEvent = {
  id: number;
  title: string;
  description?: string | null;
  date: string | null; // ISO string from API
  location?: string | null;
  club?: { id: number; name: string };
};

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
        params.set("filter", tab);
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
  }, [dq, tab]);

  const isEmpty = !clubs || clubs.length === 0;

  // ===== NEW: Suggested events state/fetch =====
  const [suggested, setSuggested] = useState<SuggestedEvent[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setSuggestLoading(true);
      try {
        const res = await fetch("/api/events/suggest", { cache: "no-store" });
        const data = await res.json();
        if (alive) setSuggested(Array.isArray(data?.events) ? data.events : []);
      } catch {
        if (alive) setSuggested([]);
      } finally {
        if (alive) setSuggestLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  // ===== END NEW =====

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-600">Club Directory</h1>

        {/* Tabs */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              tab === "all" ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Clubs
          </button>
          <button
            onClick={() => setTab("my")}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              tab === "my" ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            My Clubs
          </button>
        </div>

        {/* Search bar BELOW the header */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search clubs</label>
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
            <div className="text-gray-500">Searching…</div>
          ) : isEmpty ? (
            <div className="text-gray-500 border border-dashed border-gray-300 rounded-xl p-8 bg-white shadow-sm">
              No clubs found.
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((c) => (
                <li key={c.id} className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
                  <h2 className="font-semibold text-lg text-blue-600">{c.name}</h2>
                  {c.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{c.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== NEW: Suggested bar at the bottom ===== */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">Suggested for you</h2>
            {/* Optional: link to a full suggestions page later */}
            {/* <Link href="/suggestions" className="text-blue-600 text-sm underline">See all</Link> */}
          </div>

          {suggestLoading ? (
            <div className="text-gray-500">Loading suggestions…</div>
          ) : !suggested || suggested.length === 0 ? (
            <div className="text-gray-500 border border-dashed border-gray-300 rounded-xl p-6 bg-white">
              No upcoming suggestions right now.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ul className="flex gap-4 min-w-full">
                {suggested.map((e) => (
                  <li
                    key={e.id}
                    className="min-w-[260px] max-w-[300px] border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {e.club?.name || "Club"} {e.date ? `• ${fmtDate(e.date)}` : ""}
                    </div>
                    <h3 className="font-semibold text-blue-600 line-clamp-2">{e.title}</h3>
                    {e.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{e.description}</p>
                    )}
                    {/* Optional: add a View button if you have an event page */}
                    {/* <Link href={`/events/${e.id}`} className="text-blue-600 text-sm underline mt-2 inline-block">View</Link> */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* ===== END NEW ===== */}
      </section>
    </main>
  );
}





//import Link from "next/link";
//import { prisma } from "@/lib/prisma";

//export default async function ClubHomePage() {
  // Fetch all clubs
  //const clubs = await prisma.club.findMany({
    //orderBy: { name: "asc" },
    //select: {
      //id: true,
      //name: true,
      //category: true,
      //description: true,
      //contactEmail: true,
    //},
  //});

  //return (
    //<main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      //<h1 className="text-4xl font-bold text-blue-700 mb-8">Club Directory</h1>
//
  //    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
    //    {clubs.map((club) => (
      //    <Link
        //    key={club.id}
          //  href={`/clubHome/${club.id}`}
            //className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          //>
          //  <h2 className="text-xl font-semibold text-blue-600">{club.name}</h2>
          //  <p className="text-gray-500 text-sm mb-2">{club.category}</p>
          //  <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          //    {club.description || "No description provided."}
          //  </p>
          //  {club.contactEmail && (
          //   <p className="text-xs text-gray-500">
          //      Contact: <span className="underline">{club.contactEmail}</span>
          //    </p>
          //  )}
//          </Link>
//        ))}
//      </div>
//    </main>
//  );
//}
