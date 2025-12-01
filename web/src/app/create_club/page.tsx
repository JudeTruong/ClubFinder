"use client";

import { useState } from "react";

export default function CreateClubPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/clubs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? "Something went wrong.");
      return;
    }

    setMessage("Club created successfully! You can now log in.");
    setForm({ name: "", description: "", category: "", email: "", password: "" });
  }

  return (
    <div className="max-w-lg mx-auto mt-14 p-6 border rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">Create a Club</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Club Name */}
        <div>
          <label className="block font-medium mb-1">Club Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description Optional */}
        <div>
          <label className="block font-medium mb-1">
            Club Description <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Category Optional */}
        <div>
          <label className="block font-medium mb-1">
            Category <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Club Contact Email = User Email */}
        <div>
          <label className="block font-medium mb-1">Contact Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Password for User Account */}
        <div>
          <label className="block font-medium mb-1">Club Account Password *</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Club"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}