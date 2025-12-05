import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UserCountPage() {
  const clubs = await prisma.club.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      _count: { select: { memberships: true } },
    },
    orderBy: { name: "asc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      {/* TRON BACKGROUND + ANIMATIONS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          background: radial-gradient(circle at top, #0d1524, #000000 70%);
          font-family: 'Orbitron', sans-serif;
          color: #b8faff;
          overflow-x: hidden;
        }

        /* Glowing grid overlay behind UI */
        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(#00eaff22 1px, transparent 1px),
            linear-gradient(90deg, #00eaff22 1px, transparent 1px);
          background-size: 55px 55px;
          animation: tronGridSpin 22s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes tronGridSpin {
          from { transform: rotate(0deg) scale(1.2); }
          to { transform: rotate(360deg) scale(1.2); }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 6px #00eaff55; }
          50% { box-shadow: 0 0 18px #00eaffaa; }
          100% { box-shadow: 0 0 6px #00eaff55; }
        }

        @keyframes titleFlicker {
          0%, 100% { opacity: 1; text-shadow: 0 0 12px #00eaff; }
          92% { opacity: 0.85; text-shadow: 0 0 4px #00eaff44; }
          95% { opacity: 1; text-shadow: 0 0 20px #00eaff; }
        }

        /* Neon underline for links */
        .tron-link {
          position: relative;
        }
        .tron-link::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          left: 0;
          bottom: -2px;
          background: #00eaff;
          box-shadow: 0 0 6px #00eaff;
          transition: 0.3s ease;
        }
        .tron-link:hover::after {
          width: 100%;
        }
      `}</style>

      <main className="relative z-10 min-h-screen px-8 py-16">

        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-12">
          <h1 className="text-5xl font-bold text-cyan-300 drop-shadow-[0_0_14px_#00eaff] animate-[titleFlicker_4s_infinite]">
            USER COUNT DASHBOARD
          </h1>
          <p className="text-cyan-200 opacity-80 mt-3 tracking-wide">
            Real-time users, clubs & membership statistics.
          </p>

          <Link href="/" className="tron-link inline-block mt-4 text-cyan-300 text-sm">
            ← Back to Home
          </Link>
        </div>

        {/* STAT CARDS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">

          <div className="p-8 bg-black/40 border border-cyan-500 rounded-xl text-center shadow-[0_0_16px_#00eaff55] animate-[pulseGlow_6s_infinite]">
            <h2 className="text-6xl font-extrabold text-cyan-300">
              {users.length}
            </h2>
            <p className="text-cyan-200 mt-3 tracking-wide">Total Users</p>
          </div>

          <div className="p-8 bg-black/40 border border-cyan-500 rounded-xl text-center shadow-[0_0_16px_#00eaff55] animate-[pulseGlow_6s_infinite]">
            <h2 className="text-6xl font-extrabold text-cyan-300">
              {clubs.length}
            </h2>
            <p className="text-cyan-200 mt-3 tracking-wide">Total Clubs</p>
          </div>

          <div className="p-8 bg-black/40 border border-cyan-500 rounded-xl text-center shadow-[0_0_16px_#00eaff55] animate-[pulseGlow_6s_infinite]">
            <h2 className="text-6xl font-extrabold text-cyan-300">
              {clubs.reduce((s, c) => s + c._count.memberships, 0)}
            </h2>
            <p className="text-cyan-200 mt-3 tracking-wide">Total Memberships</p>
          </div>

        </div>

        {/* CLUB TABLE */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl mb-4 text-cyan-300 font-bold drop-shadow-[0_0_10px_#00eaff]">
            CLUBS OVERVIEW
          </h2>

          <div className="overflow-hidden rounded-xl border border-cyan-500 shadow-[0_0_14px_#00eaff55] bg-black/40">
            <table className="w-full text-cyan-200">
              <thead className="bg-black/60 border-b border-cyan-400 text-cyan-300">
                <tr>
                  <th className="py-3 px-6 text-left">Club Name</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Members</th>
                </tr>
              </thead>

              <tbody>
                {clubs.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-cyan-800/40 hover:bg-cyan-900/20 transition"
                  >
                    <td className="py-3 px-6">{c.name}</td>
                    <td className="py-3 px-6">{c.category}</td>
                    <td className="py-3 px-6 text-cyan-300 font-semibold">
                      {c._count.memberships}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* USER TABLE */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl mb-4 text-cyan-300 font-bold drop-shadow-[0_0_10px_#00eaff]">
            USERS OVERVIEW
          </h2>

          <div className="overflow-hidden rounded-xl border border-cyan-500 shadow-[0_0_14px_#00eaff55] bg-black/40">
            <table className="w-full text-cyan-200">
              <thead className="bg-black/60 border-b border-cyan-400 text-cyan-300">
                <tr>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-cyan-800/40 hover:bg-cyan-900/20 transition"
                  >
                    <td className="py-3 px-6">{u.name}</td>
                    <td className="py-3 px-6">{u.email}</td>
                    <td className="py-3 px-6 text-cyan-300 font-semibold">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </>
  );
}
