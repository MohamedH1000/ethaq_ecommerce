import { sendWhatsAppMessage } from "@/lib/whatsapp/whatsapp-service";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();
  if (!phoneNumber) {
    return NextResponse.json(
      { success: false, message: "رقم الهاتف مطلوب" },
      { status: 400 }
    );
  }
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  // Store OTP in database (using Prisma)
  await prisma.oTP.create({
    data: {
      phoneNumber,
      code: otp,
      expiresAt,
    },
  });

  // Send OTP via WhatsApp
  await sendWhatsAppMessage({
    to: phoneNumber,
    message: `رمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة 5 دقائق.`,
  });

  return NextResponse.json({ success: true });
}
