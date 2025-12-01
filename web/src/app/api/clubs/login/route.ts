import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required." }, { status: 400 });
    }

    // Find user with matching email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Compare hashed password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful.",
      userId: user.id,
      studentId: user.studentId,
      role: user.role,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server login error." }, { status: 500 });
  }
}
