// web/src/app/api/auth/signup/route.ts
export const runtime = "nodejs"; // bcrypt needs Node runtime

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SignupSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { studentId, password } = parsed.data;

    // Make sure this studentId is not already taken
    const existing = await prisma.user.findUnique({ where: { studentId } });
    if (existing) {
      return NextResponse.json({ error: "Account already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // If your `email` field is required, we can mirror studentId into it
    // (you can change this later to a real email)
    await prisma.user.create({
      data: {
        name: `Student ${studentId}`,
        studentId,               // <-- new unique column
        email: studentId,        // keep non-null constraint happy
        password: passwordHash,  // bcrypt hash
        role: "student",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    // Handle Prisma unique constraint just in case
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Account already exists." }, { status: 409 });
    }
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
