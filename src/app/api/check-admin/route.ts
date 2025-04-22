// app/api/check-admin/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { phone: phoneNumber },
      select: { isAdmin: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}
