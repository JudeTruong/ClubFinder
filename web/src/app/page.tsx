import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1) Figure out if current user is an admin
  const sid = (await cookies()).get("sid")?.value;
  let isAdmin = false;

  if (sid) {
    const userId = Number(sid);
    if (!Number.isNaN(userId)) {
      const membership = await prisma.membership.findFirst({
        where: {
          userId,
          role: "admin", // 👈 make sure your admin Membership rows use this value
        },
      });
      isAdmin = !!membership;
    }
  }

  // 2) You still want total registered users
  const users = await prisma.user.findMany();

  // 3) Base cards visible to everyone
  const baseCards = [
    {
      href: "/clubHome",
      title: "Club Home",
      color: "purple",
      desc: "Browse all student clubs.",
    },
    {
      href: "/calendar",
      title: "Calendar",
      color: "yellow",
      desc: "See all campus events.",
    },
    {
      href: "/auth/signup",
      title: "Sign Up",
      color: "red",
      desc: "Create your student account.",
    },
    {
      href: "/club-management",
      title: "Club Management",
      color: "blue",
      desc: "Post and manage events.",
    },
    {
      href: "/auth/login",
      title: "Login",
      color: "orange",
      desc: "Log in with student ID.",
    },
    {
      href: "/login",
      title: "Club Login",
      color: "green",
      desc: "Login for club executives.",
    },
  ];

  // 4) Cards only visible *if* user is an admin
  const adminOnlyCards = isAdmin
    ? [
        {
          href: "/userCount",
          title: "Admin Dashboard",
          color: "pink",
          desc: "Admin-only dashboard.",
        },
      ]
    : [];

  // 5) Admin Login card should always be visible
  const adminLoginCard = {
    href: "/admin/login",
    title: "Admin Login",
    color: "purple",
    desc: "Sign in to analysis & dashboards.",
  };

  const cards = [...baseCards, ...adminOnlyCards, adminLoginCard];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-12 flex flex-col items-center">
      {/* HEADER */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-sm">
          ClubFinder
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Discover student clubs, explore events, and stay connected with your campus community.
        </p>
      </div>

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">
        {cards.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-200 hover:border-gray-300"
          >
            <h2 className={`text-2xl font-bold mb-2 text-${item.color}-600`}>
              {item.title}
            </h2>
            <p className="text-gray-600">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* FOOTER / EXTRA INFO */}
      <div className="mt-12 text-gray-600 text-sm opacity-80">
        Total registered users: {users.length}
      </div>
    </main>
  );
}

