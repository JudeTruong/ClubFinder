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
    setForm({
      name: "",
      description: "",
      category: "",
      email: "",
      password: "",
    });
  }

  return (
    <>
      {/* GLOBAL GRADIENT BACKGROUND */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #dee3ff, #f3e8ff, #dae8ff);
          background-attachment: fixed;
          height: 100%;
          width: 100%;
        }
      `}</style>

      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 p-8">

          {/* TITLE */}
          <h1 className="text-3xl font-extrabold text-violet-900 mb-6 text-center">
            Create a Club
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Club Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Club Name *
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Club Description <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Contact Email (Club Login Email) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contact Email *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Club Account Password *
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full font-semibold 
                bg-violet-300 border border-violet-400 text-violet-900 
                transition hover:shadow-md hover:-translate-y-1
                ${loading ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {loading ? "Creating..." : "Create Club"}
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
