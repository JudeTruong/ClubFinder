"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(typeof data?.error === "string" ? data.error : "Signup failed");
        return;
      }

      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* GLOBAL GRADIENT */}
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

      <main className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-violet-900 mb-6 text-center">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="text-sm font-semibold text-gray-700">
              Student ID (9 digits)
              <input
                required
                inputMode="numeric"
                pattern="\d{9}"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="123456789"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </label>

            <label className="text-sm font-semibold text-gray-700">
              Password (min 8 characters)
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-violet-300 border border-violet-400 text-violet-900 py-2 rounded-full font-semibold hover:shadow-md hover:-translate-y-1 transition"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {msg && <p className="text-red-600 text-sm text-center">{msg}</p>}
          </form>

          <p className="mt-4 text-center text-gray-700">
            Already have an account?{" "}
            <a href="/auth/login" className="text-violet-700 font-medium underline">
              Sign in
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
