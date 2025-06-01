import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // or your database client

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if user exists in your database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
