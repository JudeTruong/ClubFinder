"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Club = { id: number; name: string };
type User = { id: number; studentId: string } | null;

export default function NewEventPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [user, setUser] = useState<User>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/clubs")
      .then((r) => r.json())
      .then((d) => setClubs(d || []))
      .catch(() => setClubs([]));

    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    if (!user) {
      setMsg("You must log in to post an event.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const title = String(form.get("title")).trim();
    const description = String(form.get("description")).trim();
    const dateLocal = String(form.get("date"));
    const location = String(form.get("location")).trim();
    const clubId = Number(form.get("clubId"));
    const imageUrl = String(form.get("imageUrl") || "").trim() || undefined;

    if (!title || !description || !dateLocal || !location || !clubId) {
      setMsg("Fill all required fields.");
      return;
    }

    const payload = {
      title,
      description,
      date: new Date(dateLocal).toISOString(),
      location,
      clubId,
      imageUrl,
    };

    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg(json.error || "Failed to create event.");
        setLoading(false);
        return;
      }

      setMsg("Event posted successfully!");
      if (json.id) router.push(`/club-management/event_timeline?clubId=${clubId}`);
    } catch {
      setMsg("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Soft Pastel Background */}
      <style>{`
        html, body {
          background: linear-gradient(135deg, #eef0ff, #f7eaff, #e7f0ff);
          background-attachment: fixed;
        }
      `}</style>

      <main className="min-h-screen flex flex-col items-center px-6 py-12">
        
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-indigo-900 mb-8">
          Post a New Event
        </h1>

        {/* Form Card */}
        <form
          onSubmit={onSubmit}
          className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200 grid gap-6"
        >
          {/* Club Select */}
          <label className="grid gap-1">
            <span className="font-medium text-gray-800">Club *</span>
            <select
              name="clubId"
              required
              className="border rounded-xl px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select a club</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Title */}
          <label className="grid gap-1">
            <span className="font-medium text-gray-800">Title *</span>
            <input
              name="title"
              required
              className="border rounded-xl px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          {/* Description */}
          <label className="grid gap-1">
            <span className="font-medium text-gray-800">Description *</span>
            <textarea
              name="description"
              required
              className="border rounded-xl px-3 py-2 min-h-[140px] text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          {/* Date */}
          <label className="grid gap-1">
            <span className="font-medium text-gray-800">Date & Time *</span>
            <input
              type="datetime-local"
              name="date"
              required
              className="border rounded-xl px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          {/* Location */}
          <label className="grid gap-1">
            <span className="font-medium text-gray-800">Location *</span>
            <input
              name="location"
              required
              className="border rounded-xl px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          {/* Image */}
          <label className="grid gap-1">
            <span className="font-medium text-gray-800">Image URL</span>
            <input
              name="imageUrl"
              placeholder="https://"
              className="border rounded-xl px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!user || loading}
            className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Submit Event"}
          </button>

          {/* Status Messages */}
          <p className="text-sm text-gray-700">
            {user ? `Logged in as ${user.studentId}` : "Not logged in"}
          </p>
          {msg && (
            <p
              className={`text-sm font-medium ${
                msg.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      </main>
    </>
  );
}
