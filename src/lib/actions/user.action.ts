"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { sendEmail } from "../email";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
      include: {
        orders: true,
        payments: true,
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
        error: "حدث خطأ اثناء ارسال طلب التسجيل للمستخدم",
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
        type: "تسجيل",
        message: `طلب تسجيل مستخدم جديد: ${email}`,
        userId: user.id, // This could be admin's ID instead - depends on your needs
        referenceId: user.id,
      },
    });

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "nashamatech2020@gmail.com",
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
export async function updateUserProfile(userData: User) {
  const { name, phone, image } = userData;
  const currentUser = await getCurrentUser();
  try {
    const response = await prisma.user.update({
      where: {
        id: currentUser?.id,
      },
      data: {
        name,
        phone,
        image,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log(error);
  }
}
const generateRandomPassword = (length: number = 10): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
export async function sendResetPassword(data: any) {
  const { email } = data;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return {
      success: false,
      message: "البريد الإلكتروني غير مسجل",
      data: null,
    };
  }
  if (user?.status !== "active") {
    return {
      success: false,
      message:
        "لا يمكنك استعادة الباسوورد ,الحساب غير مفعل, تواصل معنا لمعرفة السبب",
      data: user,
    };
  }
  try {
    const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword, // Store the hashed password
      },
    });
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
            text-align: right;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #000957;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .content {
            padding: 30px;
            color: #333;
            line-height: 1.6;
          }
          .password-box {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin: 20px 0;
            direction: ltr;
          }
          .password {
            color: #28666e;
            font-size: 20px;
            font-weight: bold;
            word-break: break-all;
          }
          .footer {
            background-color: #000957;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          a {
            color: #28666e;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
            }
            .content {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>إعادة تعيين كلمة المرور</h1>
          </div>
          <div class="content">
            <h2>مرحبًا ${updatedUser.name || "المستخدم"},</h2>
            <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك. تم إنشاء كلمة مرور جديدة لك، يرجى استخدامها لتسجيل الدخول:</p>
            <div class="password-box">
              <span class="password">${plainPassword}</span>
            </div>
            <p>يمكنك تسجيل الدخول باستخدام بريدك الإلكتروني (<strong>${email}</strong>) وكلمة المرور أعلاه.</p>
            <p><strong>ملاحظة مهمة:</strong> نوصي بشدة بتغيير كلمة المرور هذه بعد تسجيل الدخول الأول لأسباب أمنية.</p>
            <p>اضغط <a href="https://four.fortworthtowingtx.com/">هنا</a> لزيارة موقعنا والدخول إلى حسابك.</p>
          </div>
          <div class="footer">
            <p>شكرًا لثقتك بنا،<br>فريق إيثاق</p>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى التواصل معنا فورًا.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    await sendEmail({
      to: email,
      subject: "إعادة تعيين كلمة المرور - إيثاق",
      html: emailTemplate,
    });
    return {
      success: true,
      message: "تم ارسال ايميل الاستعادة بنجاح",
      data: updatedUser,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "حدث خطأ أثناء إرسال بريد إعادة تعيين كلمة المرور",
      data: null,
    };
  } finally {
    revalidatePath("/signin/reset-password");
  }
}
