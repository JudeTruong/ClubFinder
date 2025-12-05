import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const sid = (await cookies()).get("sid")?.value;
  let isAdmin = false;

  if (sid) {
    const userId = Number(sid);
    if (!Number.isNaN(userId)) {
      const membership = await prisma.membership.findFirst({
        where: { userId, role: "admin" },
      });
      isAdmin = !!membership;
    }
  }

  const users = await prisma.user.findMany();

  // Base interactive cards
  const baseCards = [
    { href: "/clubHome", title: "Club Home", color: "violet", desc: "Browse all student clubs." },
    { href: "/calendar", title: "Calendar", color: "amber", desc: "See all campus events." },
    { href: "/club-management", title: "Club Management", color: "blue", desc: "Post and manage events." },
  ];

  // Navbar buttons
  const navButtons = [
    { href: "/auth/login", title: "Login", color: "orange" },
    { href: "/auth/signup", title: "Sign Up", color: "rose" },
    { href: "/login", title: "Club Login", color: "green" },
    { href: "/admin/login", title: "Admin Login", color: "purple" },
  ];

  // Admin card
  const adminOnlyCards = isAdmin
    ? [
        {
          href: "/userCount",
          title: "Admin Dashboard",
          color: "pink",
          desc: "Admin-only analytics & management.",
        },
      ]
    : [];

  const cards = [...baseCards, ...adminOnlyCards];

  // Colors with safe Tailwind classes
  const colorMap: Record<string, string> = {
    violet: "bg-violet-200 border-violet-300 text-violet-800",
    amber: "bg-amber-200 border-amber-300 text-amber-800",
    rose: "bg-rose-200 border-rose-300 text-rose-800",
    blue: "bg-blue-200 border-blue-300 text-blue-800",
    orange: "bg-orange-200 border-orange-300 text-orange-800",
    green: "bg-green-200 border-green-300 text-green-800",
    pink: "bg-pink-200 border-pink-300 text-pink-800",
    purple: "bg-purple-200 border-purple-300 text-purple-800",
  };

  const title = "ClubFinder";

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex flex-col items-center">

      {/* GLOBAL BACKGROUND FIX */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(135deg, #e0e7ff, #f3e8ff, #dbeafe);
          background-attachment: fixed;
        }
      `}</style>

      {/* TITLE ANIMATION */}
      <style>{`
        @keyframes storySwipe {
          0% { opacity: 0; transform: translateY(15px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .story-letter {
          display: inline-block;
          animation: storySwipe 0.45s ease forwards;
        }
        .story-gradient { color: #4b0082; }
      `}</style>

      {/* NAVBAR */}
      <nav className="w-full flex justify-end px-10 py-6 gap-4">
        {navButtons.map((btn) => (
          <Link
            key={btn.title}
            href={btn.href}
            className={`px-6 py-2 rounded-full font-semibold shadow-sm border transition hover:shadow-lg hover:-translate-y-1
                        ${colorMap[btn.color]}`}
          >
            {btn.title}
          </Link>
        ))}
      </nav>

      {/* HEADER */}
      <header className="text-center mt-6 mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight drop-shadow story-gradient">
          {title.split("").map((char, i) => (
            <span
              key={i}
              className="story-letter"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p className="mt-4 text-lg text-black max-w-xl mx-auto leading-relaxed font-semibold">
          Discover clubs, explore events, and stay connected with your campus community.
        </p>
      </header>

      {/* GRID OF PILLED CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full px-10">
        {cards.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`group p-8 rounded-full border shadow-sm transition hover:shadow-2xl hover:-translate-y-2 hover:brightness-105
                        ${colorMap[item.color]}`}
          >
            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-800 font-medium">{item.desc}</p>
          </Link>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="mt-16 mb-10 text-gray-700 text-sm font-semibold">
        Created by Camilo, Christian, Jude and Justin
      </footer>
    </main>
  );
}
