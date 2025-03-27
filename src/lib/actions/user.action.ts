"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { sendEmail } from "../email";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (error: any) {
    return null;
  }
}

export async function getAllUsers() {
  try {
    // Fetch all users without specifying fields (gets all by default)
    const users = await prisma.user.findMany();

    // Map over the users and exclude hashedPassword while formatting dates
    const formattedUsers = users.map(({ password, ...user }) => ({
      ...user,
      lastLoginDate: user?.lastLoginDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    return formattedUsers;
  } catch (error) {
    console.log(error);
    return []; // Optional: return empty array on error for better error handling
  }
}

export async function createUser(userData: any) {
  try {
    const { username, email, phoneNumber } = userData;
    // const hashedPassword = await bcrypt.hash(password, 12);
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phone: phoneNumber }],
      },
    });
    // console.log("existing user", existingUser);
    // If user exists (whether pending or active), return error
    if (existingUser) {
      return {
        success: false,
        error: "تم ارسال طلب تسجيل الحساب للتفعيل",
        status: 409, // Conflict status code
      };
    }
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        phone: phoneNumber,
      },
    });

    await prisma.notification.create({
      data: {
        type: "registration",
        message: `New user registration request: ${email}`,
        userId: user.id, // This could be admin's ID instead - depends on your needs
        referenceId: user.id,
      },
    });

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "mohammedhisham115@gmail.com",
      subject: "طلب تسجيل حساب جديد",
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; text-align: right;">
          <h1>تسجيل حساب جديد</h1>
          <p>طلب مستخدم جديد تسجيل حساب</p>
          <ul>
            <li>الاسم: ${user.name}</li>
            <li>الايميل: ${user.email}</li>
            <li>رقم الهاتف: ${user.phone}</li>
          </ul>
          <p>برجاء مراجعة هذا الطلب في لوحة التحكم الخاصة بالمسؤول</p>
        </div>
      `,
    });

    return { success: true, userId: user.id };
  } catch (e: any) {
    throw new Error(e);
  }
}
