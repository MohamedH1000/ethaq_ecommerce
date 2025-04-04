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
export async function createOrder(userId: string, orderItems: any[]) {
  try {
    const totalAmount = orderItems
      .map((item) => item.product.price * item.quantity)
      .reduce((sum, price) => sum + price, 0);
    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        remainingAmount: totalAmount,
        status: "pending",
        orderDate: new Date(),
        isPaidFully: false,
      },
    });

    // Bulk update using Prisma raw MongoDB
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
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "mohammedhisham115@gmail.com",
      subject: "طلب منتجات جديد",
      html: `
      <p>السلام عليكم ورحمة الله وبركاته،</p>
      <p>تم استلام طلب جديد من العميل. يرجى الاطلاع على تفاصيل الطلب أدناه:</p>
      <h3>تفاصيل الطلب:</h3>
      <ul>
        <li><strong>رقم الطلب:</strong> ${newOrder.id}</li>
        <li><strong>تاريخ الطلب:</strong> ${newOrder.orderDate}</li>
        <li><strong>حالة الطلب:</strong> ${newOrder.status}</li>
        <li><strong>المبلغ الإجمالي:</strong> ${newOrder.totalAmount}</li>
        <li><strong>المبلغ المتبقي:</strong> ${newOrder.remainingAmount}</li>
        <li><strong>تم الدفع بالكامل:</strong> ${newOrder.isPaidFully}</li>
        <li><strong>معرف العميل:</strong> ${newOrder.userId}</li>
      </ul>
      <p>يرجى اتخاذ الإجراءات اللازمة لمعالجة الطلب.</p>
      <p>مع خالص الشكر،</p>
      <p>فريق الدعم الفني</p>
      <p>متجر ايثاق</p>
      `,
    });
    revalidatePath("/cart");
    revalidatePath("/orders");

    return {
      success: true,
      orderId: newOrder.id,
      date: newOrder,
      message: "Order created successfully",
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return {
      success: false,
      message: "Failed to create order",
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
  });

  return order;
}

export async function getMyOrders(userId: string) {
  try {
    const myorders = await prisma.order.findMany({
      where: {
        userId,
      },
    });
    return myorders;
  } catch (error) {
    console.log(error);
  }
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
