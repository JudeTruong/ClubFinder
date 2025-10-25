import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
const prisma_con = new PrismaClient();
export async function GET(request: Request) {

  const events1 = await prisma_con.event.findMany()

  const events = events1.map((e) => ({
    title: e.title,
    date: e.date.toISOString().split("T")[0]
  }))
  return NextResponse.json(events);
}