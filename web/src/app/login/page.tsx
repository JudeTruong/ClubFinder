import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });

    if (res.ok) {
      setMsg("Logged in!");
      router.push("/calendar"); // go where you want after login
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data?.error || "Login failed");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Club Login</h1>

        <label className="block">
          <span className="text-sm">Student ID (9 digits)</span>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
            value={studentId}
            onChange={(e) => {
              // keep only digits, cap at 9
              const v = e.target.value.replace(/\D/g, "").slice(0, 9);
              setStudentId(v);
            }}
            inputMode="numeric"
            autoComplete="off"
            placeholder="123456789"
            required
            pattern="\d{9}"
            title="Enter 9 digits"
          />
        </label>

        <button
          disabled={loading || studentId.length !== 9}
          className="w-full rounded-xl border px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>

        {msg && <p className="text-center text-sm text-gray-600">{msg}</p>}
      </form>
    </main>
  );
}
