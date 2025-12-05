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

      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {/* GLOBAL PASTEL GRADIENT */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(135deg, #dee3ff, #f3e8ff, #e5d4ff);
          background-attachment: fixed;
        }
      `}</style>

      <main className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-purple-900 text-center">
              Admin Login
            </h1>
            <p className="text-gray-600 text-sm text-center mt-1">
              Use your admin email and password.
            </p>
          </div>

          {/* EMAIL */}
          <label className="block text-sm font-semibold text-gray-700">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </label>

          {/* PASSWORD */}
          <label className="block text-sm font-semibold text-gray-700">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </label>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={pending}
            className={`w-full py-2 rounded-full font-semibold 
              bg-purple-300 border border-purple-400 text-purple-900
              transition hover:shadow-md hover:-translate-y-1
              ${pending ? "opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-none" : ""}
            `}
          >
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </main>
    </>
  );
}
