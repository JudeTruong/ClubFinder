// web/src/app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { studentId, password } = parsed.data;

    // You currently store the student ID in the `email` field.
    // Adjust this lookup if you change your schema later.
    const user = await prisma.user.findFirst({ where: { email: studentId } });
    if (!user) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

    // Return the SAME response where we set the cookie.
    const res = NextResponse.json({ ok: true, userId: user.id });
    res.cookies.set("sid", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
