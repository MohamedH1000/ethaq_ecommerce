import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { phoneNumber, otp } = await req.json();

  // Find the most recent valid OTP
  const validOTP = await prisma.oTP.findFirst({
    where: {
      phoneNumber,
      code: otp,
      expiresAt: { gt: new Date() }, // Not expired
      verified: false, // Not already used
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!validOTP) {
    return NextResponse.json(
      { success: false, message: "رمز التحقق غير صحيح أو منتهي الصلاحية" },
      { status: 400 }
    );
  }

  // Mark OTP as verified
  await prisma.oTP.update({
    where: { id: validOTP.id },
    data: { verified: true },
  });

  return NextResponse.json({ success: true });
}
