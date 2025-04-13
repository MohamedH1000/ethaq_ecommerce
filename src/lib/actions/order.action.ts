"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { sendEmail } from "../email";

export async function addOrderItem(
  userId: string,
  productId: string,
  orderDate: any
) {
  const { price } = orderDate;
  try {
    const orderItem = await prisma.orderItem.create({
      data: {
        userId,
        priceAtPurchase: price,
        productId,
        orderId: null, // Explicitly null
      },
    });

    return { success: true, data: orderItem };
  } catch (error) {
    console.log(error);
  }
}
export async function addProductToCart(
  userId: string,
  productId: string,
  quantity: number,
  price: number
) {
  try {
    const orderItem = await prisma.orderItem.create({
      data: {
        userId,
        priceAtPurchase: price,
        productId,
        orderId: null,
        quantity, // Explicitly null
      },
    });

    return { success: true, data: orderItem };
  } catch (error) {
    console.log(error);
  }
}
export async function getMyOrders(userId: string) {
  try {
    const myorders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        orderDate: "desc",
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
    return myorders;
  } catch (error) {
    console.log(error);
  }
}
export async function createOrder(
  userId: string,
  orderItems: any[],
  addressId: string
) {
  try {
    // First, check the user's unpaid balance
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return {
        success: false,
        message: "العنوان غير موجود",
      };
    }
    // Get all unpaid orders
    const unpaidOrders = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        remainingAmount: true,
      },
    });

    // Calculate total unpaid amount
    const totalUnpaid = unpaidOrders?.remainingAmount;

    // Calculate new order total
    const orderAmount = orderItems
      .map((item) => item.priceAtPurchase * item.quantity)
      .reduce((sum, priceAtPurchase) => sum + priceAtPurchase, 0);

    const taxAmount = (16 / 100) * orderAmount;
    const newOrderTotal = orderAmount + taxAmount;

    // Calculate potential total (existing unpaid + new order)
    const potentialTotal = totalUnpaid + newOrderTotal;

    // Check if potential total exceeds 5000 SAR
    if (potentialTotal > 5000) {
      const remainingCredit = 5000 - totalUnpaid;
      return {
        success: false,
        message: `لا يمكن إنشاء طلب جديد. الرصيد المتاح لك هو ${remainingCredit.toFixed(
          2
        )} ريال. الطلب الحالي ${newOrderTotal.toFixed(
          2
        )} ريال يتجاوز الحد الأقصى المسموح به (5000 ريال)`,
        unpaidBalance: totalUnpaid,
        remainingCredit: remainingCredit,
        newOrderAmount: newOrderTotal,
      };
    }

    // Check if user already has 5000 SAR in unpaid orders
    if (totalUnpaid >= 5000) {
      return {
        success: false,
        message:
          "لا يمكن إنشاء طلب جديد. لديك رصيد غير مدفوع بقيمة 5000 ريال أو أكثر.",
        unpaidBalance: totalUnpaid,
      };
    }

    // Create the new order
    const newOrder = await prisma.order.create({
      data: {
        userId,
        addressId,
        totalAmount: newOrderTotal,
        remainingAmount: newOrderTotal,
        status: "pending",
        orderDate: new Date(),
        isPaidFully: false,
      },
      include: {
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        remainingAmount: {
          increment: newOrderTotal,
        },
      },
    });

    // Update order items
    await prisma.$runCommandRaw({
      update: "orderItems",
      updates: orderItems.map((item) => ({
        q: { _id: { $oid: item.id }, orderId: null },
        u: {
          $set: {
            orderId: { $oid: newOrder.id },
            priceAtPurchase: item.product.price,
            subtotal: item.product.price * item.quantity,
          },
        },
      })),
    });

    // Send email notifications (to admin and user)
    const adminEmailTemplate = `
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
          background-color: #3b82f6;
          padding: 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          color: #333;
          line-height: 1.6;
        }
        .section {
          margin-bottom: 20px;
        }
        .section h3 {
          color: #3b82f6;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .info-list, .items-list {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #e2e8f0;
        }
        .info-list ul, .items-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .info-list li, .items-list li {
          margin-bottom: 8px;
          font-size: 16px;
        }
        .info-list li strong, .items-list li strong {
          color: #3b82f6;
        }
        .items-list li {
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .items-list li:last-child {
          border-bottom: none;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          font-weight: bold;
        }
        .button:hover {
          background-color: #2563eb;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        a {
          color: #3b82f6;
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
          .header h1 {
            font-size: 20px;
          }
          .info-list li, .items-list li {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>طلب منتجات جديد</h1>
        </div>
        <div class="content">
          <p>السلام عليكم ورحمة الله وبركاته،</p>
          <p>تم استلام طلب جديد من العميل. يرجى الاطلاع على التفاصيل أدناه:</p>
          <div class="section">
            <h3>تفاصيل الطلب</h3>
            <div class="info-list">
              <ul>
                <li><strong>حالة الطلب:</strong> ${
                  newOrder.status === "pending"
                    ? "قيد الانتظار"
                    : newOrder.status
                }</li>
                <li><strong>المبلغ الإجمالي:</strong> ${newOrder.totalAmount.toFixed(
                  2
                )} ريال</li>
              </ul>
            </div>
          </div>
          <div class="section">
            <h3>تفاصيل العميل</h3>
            <div class="info-list">
              <ul>
                <li><strong>الاسم:</strong> ${user?.name || "غير متوفر"}</li>
                <li><strong>البريد الإلكتروني:</strong> ${user?.email}</li>
              </ul>
            </div>
          </div>
          <div class="section">
            <h3>عنوان التوصيل</h3>
            <div class="info-list">
              <ul>
                <li><strong>الاسم:</strong> ${address?.name}</li>
                <li><strong>العنوان:</strong> ${address?.street}, ${
      address?.city
    }, ${address?.state}, ${address?.country}</li>
                <li><strong>الرمز البريدي:</strong> ${address?.postcode}</li>
                <li><strong>رقم الهاتف:</strong> ${address?.phone}</li>
                <li><strong>البريد الإلكتروني:</strong> ${address?.email}</li>
              </ul>
            </div>
          </div>
          <div class="section">
            <h3>المنتجات المطلوبة</h3>
            <div class="items-list">
              <ul>
                ${newOrder.orderItems
                  .map(
                    (item) => `
                      <li>
                        <strong>${
                          item?.product?.name || "منتج غير متوفر"
                        }</strong><br>
                        الكمية: ${item?.quantity}<br>
                        السعر للوحدة: ${item?.priceAtPurchase.toFixed(
                          2
                        )} ريال<br>
                        الإجمالي الفرعي: ${(
                          item?.quantity * item?.priceAtPurchase
                        ).toFixed(2)} ريال
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
          <p>يرجى اتخاذ الإجراءات اللازمة لمعالجة الطلب في لوحة التحكم.</p>
          <a href="https://four.fortworthtowingtx.com/admin" class="button">الذهاب إلى لوحة التحكم</a>
        </div>
        <div class="footer">
          <p>مع خالص الشكر،<br>فريق إيثاق</p>
          <p>للتواصل: <a href="mailto:support@four.fortworthtowingtx.com">support@four.fortworthtowingtx.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
    // User Email Template
    const userEmailTemplate = `
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
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          color: #333;
          line-height: 1.6;
        }
        .section {
          margin-bottom: 20px;
        }
        .section h3 {
          color: #000957;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .info-list, .items-list {
          background-color: #f0f7f7;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #000957;
        }
        .info-list ul, .items-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .info-list li, .items-list li {
          margin-bottom: 8px;
          font-size: 16px;
        }
        .info-list li strong, .items-list li strong {
          color: #000957;
        }
        .items-list li {
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .items-list li:last-child {
          border-bottom: none;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #000957;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          font-weight: bold;
        }
        .button:hover {
          background-color: #1a237e;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        a {
          color: #000957;
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
          .header h1 {
            font-size: 20px;
          }
          .info-list li, .items-list li {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>تأكيد طلبك الجديد</h1>
        </div>
        <div class="content">
          <p>السلام عليكم ورحمة الله وبركاته، ${
            user?.name || "العميل الموقر"
          },</p>
          <p>نشكرك على طلبك! لقد تم إرسال طلبك إلى الإدارة بنجاح. يرجى الاطلاع على التفاصيل أدناه:</p>
          <div class="section">
            <h3>تفاصيل الطلب</h3>
            <div class="info-list">
              <ul>
                <li><strong>حالة الطلب:</strong> ${
                  newOrder.status === "pending"
                    ? "قيد الانتظار"
                    : newOrder.status
                }</li>
                <li><strong>المبلغ الإجمالي:</strong> ${newOrder.totalAmount.toFixed(
                  2
                )} ريال</li>
              </ul>
            </div>
          </div>
          <div class="section">
            <h3>عنوان التوصيل</h3>
            <div class="info-list">
              <ul>
                <li><strong>الاسم:</strong> ${address?.name}</li>
                <li><strong>العنوان:</strong> ${address?.street}, ${
      address?.city
    }, ${address?.state}, ${address?.country}</li>
                <li><strong>الرمز البريدي:</strong> ${address?.postcode}</li>
                <li><strong>رقم الهاتف:</strong> ${address?.phone}</li>
                <li><strong>البريد الإلكتروني:</strong> ${address?.email}</li>
              </ul>
            </div>
          </div>
          <div class="section">
            <h3>المنتجات المطلوبة</h3>
            <div class="items-list">
              <ul>
                ${newOrder?.orderItems
                  .map(
                    (item) => `
                      <li>
                        <strong>${
                          item?.product?.name || "منتج غير متوفر"
                        }</strong><br>
                        الكمية: ${item?.quantity}<br>
                        السعر للوحدة: ${item?.priceAtPurchase.toFixed(
                          2
                        )} ريال<br>
                        الإجمالي الفرعي: ${(
                          item?.quantity * item?.priceAtPurchase
                        ).toFixed(2)} ريال
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
          <p>سنتواصل معك قريبًا لتأكيد حالة الطلب. يمكنك متابعة حالة طلبك في حسابك.</p>
          <a href="https://four.fortworthtowingtx.com/orders" class="button">عرض طلباتي</a>
        </div>
        <div class="footer">
          <p>مع خالص الشكر،<br>فريق إيثاق</p>
          <p>للتواصل: <a href="mailto:support@four.fortworthtowingtx.com">support@four.fortworthtowingtx.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

    // Send email notifications
    const emailPromises = [
      sendEmail({
        to: process.env.ADMIN_EMAIL || "nashamatech2020@gmail.com",
        subject: "طلب منتجات جديد - إيثاق",
        html: adminEmailTemplate,
      }),
      sendEmail({
        to: user?.email,
        subject: "تأكيد طلبك الجديد - إيثاق",
        html: userEmailTemplate,
      }),
    ];

    await Promise.all(emailPromises);

    revalidatePath("/cart");
    revalidatePath("/orders");

    return {
      success: true,
      orderId: newOrder.id,
      date: newOrder,
      message: "تم إنشاء الطلب بنجاح",
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return {
      success: false,
      message: "فشل إنشاء الطلب",
    };
  }
}

export async function getOrdersItemsByUserId(userId: string) {
  try {
    const orders = await prisma.orderItem.findMany({
      where: {
        userId,
        orderId: null,
      },
      include: {
        product: true, // Include product details
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching order items:", error);
    return []; // Return an empty array on error to avoid breaking the UI
  }
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  return order;
}

export async function decreaseOrderItem(id: string) {
  try {
    // First, decrease the quantity
    const updatedItem = await prisma.orderItem.update({
      where: {
        id,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });

    // If quantity is 0 after decrementing, delete the item
    if (updatedItem.quantity <= 0) {
      await prisma.orderItem.delete({
        where: {
          id,
        },
      });
      return {
        success: true,
        data: null,
        message: "Order item deleted as quantity reached zero",
      };
    }
    revalidatePath("products");
    return { success: true, data: updatedItem };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function increaseOrderItem(id: string) {
  const response = await prisma.orderItem.update({
    where: {
      id,
    },
    data: {
      quantity: {
        increment: 1,
      },
    },
  });
  revalidatePath("products");

  return { success: true, data: response };
}

export async function deleteOrderItem(orderId: string) {
  await prisma.orderItem.delete({
    where: {
      id: orderId,
    },
  });
  revalidatePath("/cart");
  revalidatePath("/");
  return {
    success: true,
    data: null,
    message: "Order item deleted as quantity reached zero",
  };
}
