import { prisma } from "@/lib/prisma";
import DashboardCharts from "./DashboardCharts";

export default async function DashboardPage() {
  // Fetch clubs & events
  const clubs = await prisma.club.findMany({
    include: { memberships: true },
  });

  const events = await prisma.event.findMany({
    include: { registrations: true },
  });

  // Format for charts
  const clubData = clubs.map(c => ({
    name: c.name,
    value: c.memberships.length,
  }));

  const eventRegistrationData = events.map(e => ({
    name: e.title,
    value: e.registrations.length,
  }));

  const eventAttendeeData = events.map(e => ({
    name: e.title,
    value: e.attendees,
  }));

  return (
    <>
      {/* TRON BACKGROUND + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background: radial-gradient(circle at top, #0d1524, #000000 70%);
          font-family: 'Orbitron', sans-serif;
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
          background-image: 
            linear-gradient(#00eaff22 1px, transparent 1px),
            linear-gradient(90deg, #00eaff22 1px, transparent 1px);
          background-size: 50px 50px;
          transform: translate(-25%, -25%) rotate(0deg);
          animation: gridSpin 20s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes gridSpin {
          from { transform: translate(-25%, -25%) rotate(0deg); }
          to { transform: translate(-25%, -25%) rotate(360deg); }
        }

        /* Dashboard container fade-in */
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="relative z-10 min-h-screen px-10 py-16 text-cyan-300 animate-[fadeUp_1s_ease]">

        {/* Title */}
        <h1 className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#00eaff] tracking-wide mb-10">
          ANALYTICS DASHBOARD
        </h1>

        {/* Chart container */}
        <div
          className="
            bg-black/50 border border-cyan-500 rounded-2xl 
            shadow-[0_0_14px_#00eaff99] p-8
            hover:shadow-[0_0_26px_#00eaff] transition-all
          "
        >
          <DashboardCharts
            clubRegistrations={clubData}
            eventRegistrations={eventRegistrationData}
            eventAttendees={eventAttendeeData}
          />
        </div>
      </main>
    </>
  );
}
