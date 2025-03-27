"use server";
import prisma from "../prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
  }
}
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });
    return category;
  } catch (error) {
    console.log(error);
  }
}
