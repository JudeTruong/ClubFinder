import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // 1) Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, // field name from your schema
      },
    });

    if (!user || !user.password) {
      // no user or no password set
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2) Check password:
    //    - If it looks like a bcrypt hash ($2b$...), compare with bcrypt
    //    - Otherwise, compare as plain text (dev fallback)
    let ok = false;

    if (user.password.startsWith("$2b$")) {
      // bcrypt hash
      ok = await bcrypt.compare(password, user.password);
    } else {
      // plain text password stored (dev mode / old data)
      ok = password === user.password;
    }

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3) Check that this user is actually an ADMIN in Membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        role: "admin", // make sure your admin row uses exactly "admin"
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not an admin" },
        { status: 403 }
      );
    }

    // 4) Build response AND set sid cookie so Home page can see it
    const res = NextResponse.json({
      ok: true,
      userId: user.id,
      email: user.email,
    });

    res.cookies.set("sid", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}




