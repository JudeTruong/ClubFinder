"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j?.error ?? "Invalid credentials");
        return;
      }

      // Success: go back to the home page
      router.push("/");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-black">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Use your admin email and password.</p>
        </div>

        <label className="block">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className={`w-full rounded-xl px-4 py-2 font-medium border transition
            ${pending ? "opacity-60 cursor-not-allowed" : "hover:shadow"}
            bg-purple-600 text-white border-purple-600`}
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
