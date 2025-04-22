"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { sendEmail } from "../email";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addressSchema } from "../schemas/address";
import email from "next-auth/providers/email";
import { sendWhatsAppMessage } from "../whatsapp/whatsapp-service";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.phone) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        phone: session.user?.phone as string,
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
    const { username, phoneNumber } = userData;
    // const hashedPassword = await bcrypt.hash(password, 12);
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ phone: phoneNumber }],
      },
    });
    // console.log("existing user", existingUser);
    // If user exists (whether pending or active), return error
    if (existingUser) {
      return {
        success: false,
        error: "تم تسجيل رقم الهاتف مسبقا",
        status: 409, // Conflict status code
      };
    }
    const user = await prisma.user.create({
      data: {
        name: username,
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
    //   const registrationEmailTemplate = `
    //   <!DOCTYPE html>
    //   <html>
    //   <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <style>
    //       body {
    //         font-family: 'Arial', sans-serif;
    //         background-color: #f4f4f4;
    //         margin: 0;
    //         padding: 0;
    //         direction: rtl;
    //         text-align: right;
    //       }
    //       .container {
    //         max-width: 600px;
    //         margin: 20px auto;
    //         background-color: #ffffff;
    //         border-radius: 10px;
    //         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    //         overflow: hidden;
    //       }
    //       .header {
    //         background-color: #3b82f6;
    //         padding: 20px;
    //         text-align: center;
    //         color: white;
    //       }
    //       .header h1 {
    //         margin: 0;
    //         font-size: 24px;
    //       }
    //       .content {
    //         padding: 30px;
    //         color: #333;
    //         line-height: 1.6;
    //       }
    //       .user-info {
    //         background-color: #f8fafc;
    //         padding: 20px;
    //         border-radius: 5px;
    //         margin: 20px 0;
    //         border: 1px solid #e2e8f0;
    //       }
    //       .user-info ul {
    //         list-style: none;
    //         padding: 0;
    //         margin: 0;
    //       }
    //       .user-info li {
    //         margin-bottom: 10px;
    //         font-size: 16px;
    //       }
    //       .user-info li strong {
    //         color: #3b82f6;
    //       }
    //       .button {
    //         display: inline-block;
    //         padding: 12px 24px;
    //         background-color: #3b82f6;
    //         color: white;
    //         text-decoration: none;
    //         border-radius: 5px;
    //         margin-top: 20px;
    //         font-weight: bold;
    //       }
    //       .button:hover {
    //         background-color: #2563eb;
    //       }
    //       .footer {
    //         background-color: #f4f4f4;
    //         padding: 20px;
    //         text-align: center;
    //         font-size: 14px;
    //         color: #666;
    //       }
    //       a {
    //         color: #3b82f6;
    //         text-decoration: none;
    //       }
    //       a:hover {
    //         text-decoration: underline;
    //       }
    //       @media (max-width: 600px) {
    //         .container {
    //           margin: 10px;
    //         }
    //         .content {
    //           padding: 20px;
    //         }
    //         .header h1 {
    //           font-size: 20px;
    //         }
    //         .user-info li {
    //           font-size: 14px;
    //         }
    //       }
    //     </style>
    //   </head>
    //   <body>
    //     <div class="container">
    //       <div class="header">
    //         <h1>طلب تسجيل حساب جديد</h1>
    //       </div>
    //       <div class="content">
    //         <h2>مرحبًا، فريق الإدارة</h2>
    //         <p>تم تقديم طلب تسجيل حساب جديد بواسطة مستخدم. يرجى مراجعة التفاصيل التالية:</p>
    //         <div class="user-info">
    //           <ul>
    //             <li><strong>الاسم:</strong> ${user.name}</li>
    //             <li><strong>البريد الإلكتروني:</strong> ${user.email}</li>
    //             <li><strong>رقم الهاتف:</strong> ${user.phone}</li>
    //           </ul>
    //         </div>
    //         <p>يرجى التوجه إلى لوحة التحكم الخاصة بالمسؤول لمراجعة هذا الطلب واتخاذ الإجراء اللازم.</p>
    //         <a href="https://four.fortworthtowingtx.com/admin" class="button">الذهاب إلى لوحة التحكم</a>
    //       </div>
    //       <div class="footer">
    //         <p>شكرًا لجهودكم،<br>فريق إيثاق</p>
    //         <p>لأي استفسارات، تواصلوا معنا على: <a href="mailto:support@four.fortworthtowingtx.com">support@four.fortworthtowingtx.com</a></p>
    //       </div>
    //     </div>
    //   </body>
    //   </html>
    // `;
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL || "nashamatech2020@gmail.com",
    //   subject: "طلب تسجيل حساب جديد - إيثاق",
    //   html: registrationEmailTemplate,
    // });
    const whatsappMessage = `
  *طلب تسجيل حساب جديد - إيثاق*

  مرحبًا فريق الإدارة،
  تم تقديم طلب تسجيل حساب جديد بواسطة مستخدم:
  
  *الاسم:* ${user.name}
  *رقم الهاتف:* ${user.phone}
  
  يرجى التوجه إلى لوحة التحكم لمراجعة هذا الطلب:
  https://four.fortworthtowingtx.com/admin
  
  شكرًا لجهودكم،
  فريق إيثاق
  `;
    await sendWhatsAppMessage({
      to: "+962780828916", // Send to the registered phone number
      message: whatsappMessage,
    });

    return {
      success: true,
      message: "تم إرسال الى الواتساب بنجاح",
      userId: user.id,
    };
  } catch (e: any) {
    throw new Error(e);
  }
}
export async function checkPhone(number: any) {
  const numberExists = await prisma.user.findFirst({
    where: {
      phone: number,
    },
  });
  if (numberExists && numberExists.status === "pending") {
    return {
      success: false,
      message:
        "تم إرسال طلبك للإدارة، وسيتم الرد خلال ساعات قليلة. شكرًا لتواصلك معنا.",
    };
  }
  if (numberExists && numberExists.status === "inactive") {
    return {
      success: false,
      message: "تم تعليق الحساب , للمزيد من المعلومات يرجى التواصل معنا",
    };
  }
  if (numberExists) {
    return {
      success: false,
      message: "رقم الهاتف مسجل مسبقاً، يرجى تسجيل الدخول",
    };
  }

  return { success: true };
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
  // Character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  // Ensure we have at least one of each required character type
  const passwordParts = [
    uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
    lowercase.charAt(Math.floor(Math.random() * lowercase.length)),
    numbers.charAt(Math.floor(Math.random() * numbers.length)),
    symbols.charAt(Math.floor(Math.random() * symbols.length)),
  ];

  // Combine all characters for the remaining length
  const allChars = uppercase + lowercase + numbers + symbols;
  const remainingLength = length - passwordParts.length;

  for (let i = 0; i < remainingLength; i++) {
    passwordParts.push(
      allChars.charAt(Math.floor(Math.random() * allChars.length))
    );
  }

  // Shuffle the array to avoid predictable patterns
  const shuffledPassword = passwordParts
    .sort(() => Math.random() - 0.5)
    .join("");

  return shuffledPassword;
};
export async function sendResetPassword(data: any) {
  const { countryCode, phoneNumber } = data;
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;
  const user = await prisma.user.findUnique({
    where: {
      phone: fullPhoneNumber,
    },
  });
  if (!user) {
    return {
      success: false,
      message: "رقم الهاتف غير مسجل",
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
        phone: phoneNumber,
      },
      data: {
        password: hashedPassword, // Store the hashed password
      },
    });
    // const emailTemplate = `
    //   <!DOCTYPE html>
    //   <html>
    //   <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <style>
    //       body {
    //         font-family: 'Arial', sans-serif;
    //         background-color: #f4f4f4;
    //         margin: 0;
    //         padding: 0;
    //         direction: rtl;
    //         text-align: right;
    //       }
    //       .container {
    //         max-width: 600px;
    //         margin: 20px auto;
    //         background-color: #ffffff;
    //         border-radius: 10px;
    //         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    //         overflow: hidden;
    //       }
    //       .header {
    //         background-color: #000957;
    //         padding: 20px;
    //         text-align: center;
    //         color: white;
    //       }
    //       .content {
    //         padding: 30px;
    //         color: #333;
    //         line-height: 1.6;
    //       }
    //       .password-box {
    //         background-color: #f8f8f8;
    //         padding: 15px;
    //         border-radius: 5px;
    //         text-align: center;
    //         margin: 20px 0;
    //         direction: ltr;
    //       }
    //       .password {
    //         color: #28666e;
    //         font-size: 20px;
    //         font-weight: bold;
    //         word-break: break-all;
    //       }
    //       .footer {
    //         background-color: #000957;
    //         padding: 20px;
    //         text-align: center;
    //         font-size: 14px;
    //         color: #666;
    //       }
    //       a {
    //         color: #28666e;
    //         text-decoration: none;
    //       }
    //       a:hover {
    //         text-decoration: underline;
    //       }
    //       @media (max-width: 600px) {
    //         .container {
    //           margin: 10px;
    //         }
    //         .content {
    //           padding: 20px;
    //         }
    //       }
    //     </style>
    //   </head>
    //   <body>
    //     <div class="container">
    //       <div class="header">
    //         <h1>إعادة تعيين كلمة المرور</h1>
    //       </div>
    //       <div class="content">
    //         <h2>مرحبًا ${updatedUser.name || "المستخدم"},</h2>
    //         <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك. تم إنشاء كلمة مرور جديدة لك، يرجى استخدامها لتسجيل الدخول:</p>
    //         <div class="password-box">
    //           <span class="password">${plainPassword}</span>
    //         </div>
    //         <p>يمكنك تسجيل الدخول باستخدام بريدك الإلكتروني (<strong>${email}</strong>) وكلمة المرور أعلاه.</p>
    //         <p><strong>ملاحظة مهمة:</strong> نوصي بشدة بتغيير كلمة المرور هذه بعد تسجيل الدخول الأول لأسباب أمنية.</p>
    //         <p>اضغط <a href="https://four.fortworthtowingtx.com/">هنا</a> لزيارة موقعنا والدخول إلى حسابك.</p>
    //       </div>
    //       <div class="footer">
    //         <p>شكرًا لثقتك بنا،<br>فريق إيثاق</p>
    //         <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى التواصل معنا فورًا.</p>
    //       </div>
    //     </div>
    //   </body>
    //   </html>
    // `;
    // await sendEmail({
    //   to: email,
    //   subject: "إعادة تعيين كلمة المرور - إيثاق",
    //   html: emailTemplate,
    // });
    const whatsappMessage = `
*إعادة تعيين كلمة المرور*

مرحبًا ${updatedUser.name || "المستخدم"}،

لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك.

*كلمة المرور الجديدة:*
${plainPassword}

*تعليمات:*
1. سجّل الدخول باستخدام رقم هاتفك
2. استخدم كلمة المرور أعلاه
3. نوصي بتغييرها بعد الدخول لأسباب أمنية

*رابط الموقع:*
https://four.fortworthtowingtx.com/

*ملاحظة:*
إذا لم تطلب إعادة التعيين، يرجى التواصل معنا فورًا.

مع خالص الشكر،
فريق إيثاق
`;

    await sendWhatsAppMessage({
      to: "+962780828916", // Or use user's phone number if available
      message: whatsappMessage,
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

export const addAddress = async (data: any) => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  // Validate input
  // const validatedData = addressSchema.parse(data);

  try {
    // console.log("Sending address data to server:", data);
    // // If this is a default address, first unset any existing default
    // if (validatedData.default) {
    //   await prisma.address.updateMany({
    //     where: {
    //       userId: currentUser.id,
    //     },
    //     data: {
    //       isDefault: false,
    //     },
    //   });
    // }

    // Create new address record
    const newAddress = await prisma.address.create({
      data: {
        user: {
          connect: { id: currentUser.id },
        },
        street: data.street,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
      },
    });

    return {
      success: true,
      address: newAddress,
    };
  } catch (error) {
    console.error("Address creation failed:", error);
    throw new Error("فشل في إضافة العنوان. يرجى المحاولة مرة أخرى");
  }
};

export const myAddresses = async (id: any) => {
  try {
    const myAddresses = await prisma.address.findMany({
      where: {
        userId: id,
      },
      include: {
        user: true,
      },
    });

    return myAddresses;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAddress = async (id: string) => {
  try {
    const response = await prisma.address.delete({
      where: {
        id,
      },
    });
    return { success: true, message: "تم حذف العنوان بنجاح", data: response };
  } catch (error) {
    console.log(error, "حصل خطا عند حذف العنوان");
  }
};
