import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const sid = (await cookies()).get("sid")?.value;   // <-- no await
  if (!sid) return NextResponse.json({ user: null });

  const userId = Number(sid);
  if (!Number.isFinite(userId)) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },       // change fields to match your schema if needed
  });

  return NextResponse.json({ user: user ?? null });
}





