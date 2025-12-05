"use client";

import { useState } from "react";

export default function ClubLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/clubs/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Login failed.");
      setLoading(false);
      return;
    }

    localStorage.setItem("userId", data.userId);
    setMessage("Login successful!");

    setTimeout(() => {
      window.location.href = "/club-management";
    }, 700);

    setLoading(false);
  }

  return (
    <>
      {/* GLOBAL GRADIENT */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(135deg, #dee3ff, #f3e8ff, #dae8ff);
          background-attachment: fixed;
        }
      `}</style>

      <main className="min-h-screen flex items-center justify-center w-full px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-sm"
        >
          <h1 className="text-3xl font-extrabold text-violet-900 text-center mb-6">
            Club Login
          </h1>

          {/* Email */}
          <input
            type="email"
            placeholder="Club contact email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter club password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-300 border border-violet-400 text-violet-900 py-2 rounded-full font-semibold hover:shadow-md hover:-translate-y-1 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-800">{message}</p>
          )}
        </form>
      </main>
    </>
  );
}
