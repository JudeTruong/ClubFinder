// web/src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { SignupSchema } from "../../../lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { studentId, password } = parsed.data;

    // We store studentId in the User.email field (already unique)
    const existing = await prisma.user.findUnique({ where: { email: studentId } });
    if (existing) {
      return NextResponse.json({ error: "Account already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: `Student ${studentId}`, // optional
        email: studentId,            // <- student ID lives here
        password: passwordHash,      // <- your schema calls this "password"
        role: "student",             // you already have a role field
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
