// src/app/admin/page.tsx
export const runtime = "nodejs";

import Link from "next/link";

export default async function AdminHome() {
  return (
    <>
      {/* TRON BACKGROUND + ANIMATIONS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          font-family: 'Orbitron', sans-serif;
          background: radial-gradient(circle at top, #0d1524, #000000 70%);
          background-attachment: fixed;
          overflow-x: hidden;
        }

        /* Animated TRON grid overlay */
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          background-image: linear-gradient(#00eaff22 1px, transparent 1px),
                            linear-gradient(90deg, #00eaff22 1px, transparent 1px);
          background-size: 50px 50px;
          transform: translate(-25%, -25%) rotate(0deg);
          animation: gridMove 18s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes gridMove {
          from { transform: translate(-25%, -25%) rotate(0deg); }
          to { transform: translate(-25%, -25%) rotate(360deg); }
        }

        /* Title flicker */
        @keyframes tronFlicker {
          0%, 100% { text-shadow: 0 0 8px #00eaff55; opacity: 1; }
          92% { text-shadow: 0 0 2px #00eaff22; opacity: 0.8; }
          95% { text-shadow: 0 0 12px #00eaffaa; opacity: 1; }
        }

        /* Card breathing glow */
        @keyframes cardPulse {
          0% { box-shadow: 0 0 8px #00eaff55; }
          50% { box-shadow: 0 0 16px #00eaffaa; }
          100% { box-shadow: 0 0 8px #00eaff55; }
        }

        /* Holographic hover line */
        .holo-underline {
          position: relative;
        }

        .holo-underline::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 2px;
          background: #00eaff;
          box-shadow: 0 0 6px #00eaff;
          transition: width 0.3s ease;
        }

        .holo-underline:hover::after {
          width: 100%;
        }
      `}</style>

      <main className="min-h-screen w-full text-cyan-300 px-6 py-16 flex justify-center relative z-50 animate-[pulse_6s_ease-in-out_infinite]">

        <section className="max-w-6xl w-full">

          {/* Animated TRON Title */}
          <h1 className="text-6xl font-bold text-cyan-400 drop-shadow-[0_0_12px_#00eaff] tracking-wide animate-[tronFlicker_4s_infinite]">
            ADMIN CONTROL PANEL
          </h1>
          <p className="text-cyan-200 opacity-80 mt-2 tracking-wide">
            System tools • Metrics • Diagnostics
          </p>

          {/* TRON CARDS */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-10">

            {/* Card Template */}
            <Link
              href="/userCount/club-analysis"
              className="
                block p-8 rounded-xl border border-cyan-500 bg-black/40 
                shadow-[0_0_12px_#00eaff55] transition-all
                hover:shadow-[0_0_30px_#00eaff] hover:-translate-y-2
                hover:bg-black/60
                animate-[cardPulse_5s_ease-in-out_infinite]
              "
            >
              <h2 className="text-2xl font-bold text-cyan-300 mb-2 tracking-wider holo-underline">
                CLUB ANALYSIS
              </h2>
              <p className="text-cyan-200 opacity-80 leading-relaxed">
                Engagement metrics, growth curves, event tracking, analytics breakdowns.
              </p>
              <div className="mt-6 text-cyan-400 font-semibold holo-underline text-lg">
                OPEN →
              </div>
            </Link>

            <Link
              href="/userCount/user-count"
              className="
                block p-8 rounded-xl border border-cyan-500 bg-black/40 
                shadow-[0_0_12px_#00eaff55] transition-all
                hover:shadow-[0_0_30px_#00eaff] hover:-translate-y-2
                hover:bg-black/60 
                animate-[cardPulse_5s_ease-in-out_infinite]
              "
            >
              <h2 className="text-2xl font-bold text-cyan-300 mb-2 tracking-wider holo-underline">
                USER COUNT
              </h2>
              <p className="text-cyan-200 opacity-80 leading-relaxed">
                Total users, role distribution, registration velocity, and historical charts.
              </p>
              <div className="mt-6 text-cyan-400 font-semibold holo-underline text-lg">
                OPEN →
              </div>
            </Link>

          </div>
        </section>
      </main>
    </>
  );
}
