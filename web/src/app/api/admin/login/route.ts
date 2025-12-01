export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Basic payload guard
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Find admin by email AND role
    const user = await prisma.user.findFirst({
      where: { email, role: "admin" },
    });

    // Not found or role mismatch
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Plain-text comparison (temporary, dev-only)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Issue session cookie and let the client redirect to "/"
    const res = NextResponse.json({ ok: true, userId: user.id, role: user.role });
    res.cookies.set("sid", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;

    // If you prefer the server to redirect instead of the client, return this:
    // const redirect = NextResponse.redirect(new URL("/", req.url), { status: 303 });
    // redirect.cookies.set("sid", String(user.id), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60*60*24*7 });
    // return redirect;

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
