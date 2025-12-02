import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    console.log("📩 Incoming club creation request...");
    const { name, description, category, email, password } = await req.json();

    // Required validation
    if (!name || !email || !password) {
        console.log("❌ Missing required fields");
        return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // Prevent duplicate clubs
    const existingClub = await prisma.club.findFirst({
      where: { OR: [{ name }, { contactEmail: email }] }
    });
    if (existingClub) {
        console.log("❌ User with this email already exists"); // DEBUG POINT 3
        return NextResponse.json(
        { error: "A club with this name or email already exists." },
        { status: 409 }
      );
    }

    // Prevent duplicate users
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // 1️⃣ Create Club first (because we need its ID for studentId)
    console.log("🛠 Creating club..."); // DEBUG POINT 4
    const club = await prisma.club.create({
      data: {
        name,
        description: description || "",
        category: category || "",
        contactEmail: email,
      }
    });
    console.log("✅ Club created:", club); // DEBUG POINT 5
    // 🔥 Convert club.id (Int) → studentId (String + Unique)
    const studentIdValue = club.id.toString();

    // 2️⃣ Create the user associated to this club admin account
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🛠 Creating user..."); // DEBUG POINT 6
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        studentId: studentIdValue,   // ← studentId = clubId
        name: club.name,                        // default user name = club name
        role: "club-admin"           // give admin privileges
      }
    });
    console.log("✅ User created:", user); // DEBUG POINT 7


    console.log("🛠 Creating membership..."); // DEBUG POINT 8
    // 3️⃣ Create membership record marking this user as admin
    await prisma.membership.create({
      data: {
        clubId: club.id,
        userId: user.id,
        role: "admin"
      }
    });
    console.log("🏁 Membership assigned"); // DEBUG POINT 9
    return NextResponse.json(
      { message: "Club + admin user created successfully", club, user },
      { status: 201 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while creating club" },
      { status: 500 }
    );
  }
}
