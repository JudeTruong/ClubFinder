"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Helper for friendly event dates
function fmtDate(d: string | null | undefined) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type Club = {
  id: number;
  name: string;
  description?: string | null;
};

type SuggestedEvent = {
  id: number;
  title: string;
  description?: string | null;
  date: string | null;
  location?: string | null;
  club?: { id: number; name: string };
};

export default function ClubHomePage() {
  const [tab, setTab] = useState<"all" | "my">("all");
  const [q, setQ] = useState("");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const dq = useMemo(() => q.trim(), [q]);

  // Fetch clubs
  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (dq) params.set("q", dq);
        params.set("filter", tab);
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
  }, [dq, tab]);

  const isEmpty = !clubs || clubs.length === 0;

  // Suggested events
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
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Club Directory</h1>

          <Link
            href="/create_club"     // ← route you want to go to
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
          >
          + Create Club
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              tab === "all"
                ? "border-blue-700 text-blue-700 bg-blue-50"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            All Clubs
          </button>
          <button
            onClick={() => setTab("my")}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              tab === "my"
                ? "border-blue-700 text-blue-700 bg-blue-50"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            My Clubs
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clubs..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* Club List */}
        {loading ? (
          <p className="text-gray-500">Loading clubs...</p>
        ) : isEmpty ? (
          <p className="text-gray-500 border border-dashed border-gray-300 rounded-xl p-8 bg-white text-center">
            No clubs found.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <li
                key={club.id}
                className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <Link href={`/clubHome/${club.id}`} className="block">
                  <h2 className="font-semibold text-lg text-blue-700 mb-1">
                    {club.name}
                  </h2>
                  {club.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {club.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Suggested Events */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Suggested Events
          </h2>

          {suggestLoading ? (
            <p className="text-gray-500">Loading suggestions...</p>
          ) : !suggested || suggested.length === 0 ? (
            <p className="text-gray-500 border border-dashed border-gray-300 rounded-xl p-6 bg-white text-center">
              No upcoming suggestions right now.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <ul className="flex gap-4">
                {suggested.map((e) => (
                  <li
                    key={e.id}
                    className="min-w-[260px] border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {e.club?.name || "Club"}{" "}
                      {e.date ? `• ${fmtDate(e.date)}` : ""}
                    </div>
                    <h3 className="font-semibold text-blue-700 line-clamp-2">
                      {e.title}
                    </h3>
                    {e.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {e.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
