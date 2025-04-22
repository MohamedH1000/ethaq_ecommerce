// app/api/check-approval/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "الحساب غير مسجل" },
        { status: 404 }
      );
    }

    if (user.status === "pending") {
      return NextResponse.json({
        success: false,
        message:
          "نقوم بمراجعة طلب التسجيل للمزيد من المعلومات يرجى التواصل معنا",
      });
    }

    if (user.status === "inactive") {
      return NextResponse.json({
        success: false,
        message: "تم ايقاف حسابك , برجى التواصل مع الادارة",
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to check approval status" },
      { status: 500 }
    );
  }
}
