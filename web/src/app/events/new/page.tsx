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
    // load clubs
    fetch("/api/clubs")
      .then((r) => r.json())
      .then((d) => setClubs(d || []))
      .catch(() => setClubs([]));

    // load current user using HttpOnly cookie
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    if (!user) {
      setMsg("You must log in to post an event");
      return;
    }

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const dateLocal = String(form.get("date") || "");
    const location = String(form.get("location") || "").trim();
    const clubId = Number(form.get("clubId"));
    const imageUrl = String(form.get("imageUrl") || "").trim() || undefined;

    if (!title || !description || !dateLocal || !location || !clubId) {
      setMsg("Fill all required fields");
      return;
    }

    const isoDate = new Date(dateLocal).toISOString();

    const payload = {
      title,
      description,
      date: isoDate,
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
        setMsg(json.error || "Failed to create event");
        setLoading(false);
        return;
      }

      setMsg("Event posted");
      // optional redirect to event page
      if (json.id) router.push("/"); // ✅ redirect to /events/page.tsx
    } catch (err) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Post a Club Event</h1>

      <form onSubmit={onSubmit} className="w-full max-w-2xl bg-white border rounded-xl p-6 shadow-sm grid gap-4">
        <label className="grid gap-2">
          <span className="font-medium">Club</span>
          <select name="clubId" required className="border rounded-lg p-2">
            <option value="">Select club</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Title</span>
          <input name="title" required className="border rounded-lg p-2" />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Description</span>
          <textarea name="description" required className="border rounded-lg p-2 min-h-[120px]" />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Date and time</span>
          <input type="datetime-local" name="date" required className="border rounded-lg p-2" />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Location</span>
          <input name="location" required className="border rounded-lg p-2" />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Image URL</span>
          <input name="imageUrl" className="border rounded-lg p-2" placeholder="https://" />
        </label>

        <button
          type="submit"
          disabled={!user || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Posting" : "Submit"}
        </button>

        <p className="text-sm text-gray-600">{user ? `Logged in as ${user.studentId}` : "Not logged in"}</p>
        <p className="text-sm text-gray-600">{msg}</p>
      </form>
    </main>
  );
}

