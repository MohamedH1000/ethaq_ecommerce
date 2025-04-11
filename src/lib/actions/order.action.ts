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
        remainingAmount: newOrderTotal,
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
    const emailPromises = [
      sendEmail({
        to: process.env.ADMIN_EMAIL || "nashamatech2020@gmail.com",
        subject: "طلب منتجات جديد",
        html: `
        <p>السلام عليكم ورحمة الله وبركاته،</p>
        <p>تم استلام طلب جديد من العميل. يرجى الاطلاع على تفاصيل الطلب أدناه:</p>
        <h3>تفاصيل الطلب:</h3>
        <ul>
          <li><strong>رقم الطلب:</strong> ${newOrder.id}</li>
          <li><strong>تاريخ الطلب:</strong> ${newOrder.orderDate}</li>
          <li><strong>حالة الطلب:</strong> ${newOrder.status}</li>
          <li><strong>المبلغ الاجمالي للطلب:</strong> ${newOrder.totalAmount}</li>
          <li><strong>المبلغ المتبقي:</strong> ${updateUser.remainingAmount}</li>
        </ul>
        <p>يرجى اتخاذ الإجراءات اللازمة لمعالجة الطلب.</p>
        <p>مع خالص الشكر،</p>
        <p>فريق الدعم الفني</p>
        <p>متجر ايثاق</p>
        `,
      }),
      sendEmail({
        to: user?.email,
        subject: "طلب منتجات جديد",
        html: `
        <p>السلام عليكم ورحمة الله وبركاته،</p>
        <p>تم ارسال طلبك الى الادارة. يرجى الاطلاع على تفاصيل الطلب أدناه:</p>
        <h3>تفاصيل الطلب:</h3>
        <ul>
          <li><strong>رقم الطلب:</strong> ${newOrder.id}</li>
          <li><strong>تاريخ الطلب:</strong> ${newOrder.orderDate}</li>
          <li><strong>حالة الطلب:</strong> ${newOrder.status}</li>
          <li><strong>المبلغ الإجمالي:</strong> ${newOrder.totalAmount}</li>
          <li><strong>المبلغ المتبقي:</strong> ${updateUser.remainingAmount}</li>
        </ul>
        <p>مع خالص الشكر،</p>
        <p>فريق الدعم الفني</p>
        <p>متجر ايثاق</p>
        `,
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
