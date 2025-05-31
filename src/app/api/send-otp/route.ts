// import { sendWhatsAppMessage } from "@/lib/whatsapp/whatsapp-service";
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { sendWATIMessage } from "@/lib/whatsapp/whatsapp";

// export async function POST(req: Request) {
//   const { phoneNumber } = await req.json();
//   const user = await prisma.user.findUnique({
//     where: {
//       phone: phoneNumber,
//     },
//   });

//   if (!user) {
//     return NextResponse.json(
//       { success: false, message: "المستخدم غير مسجل بالموقع" },
//       { status: 404 }
//     );
//   }

//   if (user.status === "inactive") {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "حسابك غير مفعل يرجى التواصل معنا لمعرفة المزيد",
//       },
//       { status: 404 }
//     );
//   }
//   // Generate 6-digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

//   // Store OTP in database (using Prisma)
//   await prisma.oTP.create({
//     data: {
//       phoneNumber,
//       code: otp,
//       expiresAt,
//     },
//   });

//   // Send OTP via WhatsApp
//   await sendWATIMessage(
//     phoneNumber,
//     `📱 *رمز التحقق الخاص بك*\n
//     ✨ الرمز: *${otp}*\n
//     ⏳ صالح لمدة *5 دقائق* فقط\n
//     🔐 لا تشارك هذا الرمز مع أي أحد\n
//     💼 فريق ايثاق مارت \n
//     `
//   );

//   return NextResponse.json({ success: true });
// }
// app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}
