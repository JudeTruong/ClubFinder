// web/src/app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/validation";

function isBcryptHash(s: string | null | undefined) {
  // Accept $2a/$2b/$2y prefixes
  return typeof s === "string" && /^\$2[aby]\$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { studentId, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { studentId } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    let ok = false;

    if (isBcryptHash(user.password)) {
      // DB has a bcrypt hash -> use bcrypt compare
      ok = await bcrypt.compare(password, user.password);
    } else {
      // DB has a plain password -> compare directly
      ok = password === user.password;

      // Optional: auto-upgrade to bcrypt after a successful plain-text match
      if (ok) {
        try {
          const hash = await bcrypt.hash(password, 10);
          await prisma.user.update({
            where: { id: user.id },
            data: { password: hash },
          });
        } catch {
          // If hashing fails, we still allow this login; just don't crash
        }
      }
    }

    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Issue session cookie + response
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
