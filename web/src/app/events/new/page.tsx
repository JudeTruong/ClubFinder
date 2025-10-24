"use client";

import { useEffect, useState } from "react";

type Club = { id: number; name: string };

export default function NewEventPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/clubs").then(r => r.json()).then(setClubs).catch(() => setClubs([]));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dateLocal = String(fd.get("date")); // "YYYY-MM-DDTHH:mm"
    const iso = new Date(dateLocal).toISOString();

    const payload = {
      title: String(fd.get("title") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      category: String(fd.get("category") || "general"), // optional if you show it
      date: iso,
      location: String(fd.get("location") || "").trim(),
      clubId: Number(fd.get("clubId")),
      imageUrl: String(fd.get("imageUrl") || "") || undefined,
      userId: 3,
    };

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setMsg(res.ok ? `Submitted. ID: ${json.id}` : json.error || "Failed");
    if (res.ok) (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-3 text-center text-blue-700">Post a Club Event</h1>

      <form onSubmit={onSubmit} className="w-full max-w-2xl bg-white border rounded-xl p-6 shadow-sm grid gap-4">
        <label className="grid gap-2">
          <span className="font-medium">Club</span>
          <select name="clubId" required className="border rounded-lg p-2">
            <option value="">Select club</option>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          <span className="font-medium">Date & Time</span>
          <input type="datetime-local" name="date" required className="border rounded-lg p-2" />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Location</span>
          <input name="location" required className="border rounded-lg p-2" />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Image URL (optional)</span>
          <input name="imageUrl" className="border rounded-lg p-2" placeholder="https://..." />
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Submit
        </button>

        <p className="text-sm text-gray-600">{msg}</p>
      </form>
    </main>
  );
}
