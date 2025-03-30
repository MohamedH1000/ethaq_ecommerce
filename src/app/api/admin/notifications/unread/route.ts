// // app/api/admin/notifications/unread/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { verifyAuth } from "@/lib/auth";

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest) {
//   try {
//     // Verify admin authentication
//     const session = await verifyAuth(request);
//     if (!session || !session.isAdmin) {
//       return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
//     }

//     // Get unread notifications for this admin user
//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: session.userId,
//         isRead: false,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json({ notifications }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return NextResponse.json(
//       { message: "حدث خطأ أثناء جلب الإشعارات" },
//       { status: 500 }
//     );
//   }
// }
