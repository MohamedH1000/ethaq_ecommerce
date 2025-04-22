import { sendWhatsAppMessage } from "@/lib/whatsapp/whatsapp-service";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();
  const user = await prisma.user.findUnique({
    where: {
      phone: phoneNumber,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "المستخدم غير مسجل بالموقع" },
      { status: 404 }
    );
  }

  if (user.status === "inactive") {
    return NextResponse.json(
      {
        success: false,
        message: "حسابك غير مفعل يرجى التواصل معنا لمعرفة المزيد",
      },
      { status: 404 }
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
    message: `📱 *رمز التحقق الخاص بك*\n
    ✨ الرمز: *${otp}*\n
    ⏳ صالح لمدة *5 دقائق* فقط\n
    🔐 لا تشارك هذا الرمز مع أي أحد\n
    💼 فريق ايثاق مارت \n
    `,
  });

  return NextResponse.json({ success: true });
}
