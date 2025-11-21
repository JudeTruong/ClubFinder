import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const users = await prisma.user.findMany();

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

        {/* Card Template */}
        {[
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
          {
            href: "/userCount",
            title: "Admin Usercount",
            color: "pink",
            desc: "Admin-only dashboard.",
          },
          {
            href: "/club_analysis",
            title: "Club Analysis",
            color: "pink",
            desc: "Admin-only dashboard.",
          },
        ].map((item) => (
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
