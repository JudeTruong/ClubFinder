"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Friendly date format
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

// Pastel color map
const colorMap: Record<string, string> = {
  violet: "bg-violet-200 border-violet-300 text-violet-900",
  amber: "bg-amber-200 border-amber-300 text-amber-900",
  rose: "bg-rose-200 border-rose-300 text-rose-900",
  blue: "bg-blue-200 border-blue-300 text-blue-900",
  orange: "bg-orange-200 border-orange-300 text-orange-900",
  green: "bg-green-200 border-green-300 text-green-900",
  pink: "bg-pink-200 border-pink-300 text-pink-900",
  purple: "bg-purple-200 border-purple-300 text-purple-900",
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
    <>
      {/* FULL-PAGE GRADIENT THAT ALWAYS FILLS SCREEN */}
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

      <main className="min-h-screen w-full">

        {/* NAVBAR */}
        <nav className="w-full flex justify-end px-10 py-6 gap-4">
          <Link href="/auth/login" className={`px-5 py-2 rounded-full shadow-sm border font-semibold hover:shadow-lg hover:-translate-y-1 transition ${colorMap.orange}`}>
            Login
          </Link>
          <Link href="/auth/signup" className={`px-5 py-2 rounded-full shadow-sm border font-semibold hover:shadow-lg hover:-translate-y-1 transition ${colorMap.rose}`}>
            Sign Up
          </Link>
          <Link href="/login" className={`px-5 py-2 rounded-full shadow-sm border font-semibold hover:shadow-lg hover:-translate-y-1 transition ${colorMap.green}`}>
            Club Login
          </Link>
          <Link href="/admin/login" className={`px-5 py-2 rounded-full shadow-sm border font-semibold hover:shadow-lg hover:-translate-y-1 transition ${colorMap.purple}`}>
            Admin Login
          </Link>
        </nav>

        <section className="mx-auto max-w-6xl px-6 py-10">

          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-extrabold text-violet-900 drop-shadow">
              Club Directory
            </h1>

            <Link
              href="/create_club"
              className={`px-6 py-2 rounded-full border shadow-sm font-semibold hover:shadow-lg hover:-translate-y-1 transition ${colorMap.blue}`}
            >
              + Create Club
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            {["all", "my"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as "all" | "my")}
                className={`px-6 py-2 rounded-full border font-semibold shadow-sm hover:shadow-md transition ${
                  tab === t ? colorMap.violet : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                {t === "all" ? "All Clubs" : "My Clubs"}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clubs..."
            className="w-full rounded-full border border-gray-300 px-5 py-3 mb-8 shadow-sm focus:ring-2 focus:ring-violet-500 outline-none"
          />

          {/* Club List */}
          {loading ? (
            <p className="text-gray-600">Loading clubs...</p>
          ) : isEmpty ? (
            <p className="text-gray-600 border border-dashed border-gray-400 rounded-xl p-10 bg-white text-center">
              No clubs found.
            </p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <li
                  key={club.id}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition rounded-xl p-8"
                >
                  <Link href={`/clubHome/${club.id}`}>
                    <h2 className="text-xl font-bold text-violet-900 mb-2">
                      {club.name}
                    </h2>
                    {club.description && (
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {club.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Suggested Events */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-violet-900 mb-4">
              Suggested Events
            </h2>

            {suggestLoading ? (
              <p className="text-gray-600">Loading suggestions...</p>
            ) : !suggested || suggested.length === 0 ? (
              <p className="text-gray-600 border border-dashed border-gray-400 rounded-xl p-10 bg-white text-center">
                No upcoming suggestions right now.
              </p>
            ) : (
              <div className="overflow-x-auto pb-4">
                <ul className="flex gap-6">
                  {suggested.map((e) => (
                    <li
                      key={e.id}
                      className="min-w-[260px] bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition rounded-xl p-6"
                    >
                      <div className="text-xs text-gray-500 mb-2">
                        {e.club?.name || "Club"} • {fmtDate(e.date)}
                      </div>
                      <h3 className="font-bold text-violet-900">{e.title}</h3>
                      {e.description && (
                        <p className="text-gray-700 text-sm mt-2 line-clamp-3">
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
    </>
  );
}
