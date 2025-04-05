"use server";
import prisma from "../prisma";
import { getCurrentUser } from "./user.action";

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

export async function getSomeProducts() {
  try {
    // Get all products
    const allProducts = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    // Shuffle array and take first 20
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    const random20 = shuffled.slice(0, 24);

    return random20;
  } catch (error) {
    console.log(error);
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
