"use server";
import prisma from "../prisma";

export async function getProducts() {
  try {
    const response = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function getSomeProducts(type: string) {
  try {
    // Base query conditions
    const whereCondition = type === "offers" ? { discount: { gt: 0 } } : {};
    const productCount = type === "offers" ? 12 : 24;

    // First, get the total count of available products
    const totalCount = await prisma.product.count({
      where: whereCondition,
    });

    // Calculate random skip to get different products each time
    const randomSkip = Math.max(
      0,
      Math.floor(Math.random() * (totalCount - productCount))
    );

    // Fetch random products directly from database
    const randomProducts = await prisma.product.findMany({
      where: whereCondition,
      include: {
        category: true,
      },
      skip: randomSkip,
      take: productCount,
    });

    // Secondary shuffle in case we got sequential products
    return randomProducts.sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
    return product;
  } catch (error) {
    console.log(error);
  }
}
