"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/club/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setMsg("Logged in! Redirecting…");
      router.push("/calendar"); // change if you prefer another page
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data?.error || "Login failed");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Club Login</h1>

        <label className="block">
          <span className="text-sm">Email</span>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="club@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm">Password</span>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button
          disabled={loading}
          className="w-full rounded-xl border px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>

        {msg && (
          <p className="text-center text-sm text-gray-600">{msg}</p>
        )}
      </form>
    </main>
  );
}
