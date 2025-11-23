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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? "Login failed");
      } else {
        // redirect to future admin home (adjust later if needed)
        router.push("/admin");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-2xl shadow p-8 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">
            Use your admin email and password.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
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
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
        </div>

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
