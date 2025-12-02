import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) }
  });

  return NextResponse.json(user);
}
