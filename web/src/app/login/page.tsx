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
    setLoading(false);

    // Redirect to club dashboard later (ex: /clubHome/${id})
     setTimeout(() => {
      window.location.href = "/club-management";
    }, 700);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Club Login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Club contact email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded-md"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter club password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded-md"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </main>
  );
}
