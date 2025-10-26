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
    <div style={{ maxWidth: 360, margin: "48px auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Create account</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Student ID (9 digits)
          <input
            required
            inputMode="numeric"
            pattern="\d{9}"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="123456789"
            style={{ width: "100%", padding: 8, borderRadius: 8 }}
          />
        </label>

        <label>
          Password (min 8 chars)
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 8 }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: 10, borderRadius: 8 }}>
          {loading ? "Creating..." : "Create account"}
        </button>

        {msg && <p style={{ color: "crimson" }}>{msg}</p>}
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account? <a href="/auth/login" style={{ textDecoration: "underline" }}>Sign in</a>
      </p>
    </div>
  );
}