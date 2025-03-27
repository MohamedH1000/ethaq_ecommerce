// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, phoneNumber } = body;

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مسجل مسبقاً" },
        { status: 400 }
      );
    }

    // Create new user with pending status
    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        phone: phoneNumber,
        status: "pending",
        password: "", // Will be generated after approval
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: "registration",
        userId: await getAdminUserId(), // Function to get admin user ID
        message: `طلب تسجيل جديد من ${username} (${email})`,
        referenceId: newUser.id,
      },
    });

    // You could add email notification here
    // await sendAdminNotificationEmail();

    return NextResponse.json(
      {
        message: "تم تسجيل طلبك بنجاح وسيتم مراجعته من قبل الإدارة",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء التسجيل" },
      { status: 500 }
    );
  }
}

// Helper function to get the admin user ID
async function getAdminUserId() {
  const adminUser = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!adminUser) {
    throw new Error("No admin user found");
  }

  return adminUser.id;
}
