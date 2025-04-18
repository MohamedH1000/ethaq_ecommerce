"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SearchProductsParams {
  query: string;
  page: number;
  limit: number;
}

interface SearchProductsResult {
  items: any[];
  totalCount: number;
}

export async function searchProducts({
  query,
  page,
  limit,
}: SearchProductsParams): Promise<SearchProductsResult> {
  try {
    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Build search conditions
    const where: any = {
      active: true,
      OR: [
        {
          name: {
            contains: ` ${query} `,
            mode: "insensitive",
          },
        },
        // Match word at start of string
        {
          name: {
            startsWith: `${query} `,
            mode: "insensitive",
          },
        },
        // Match word at end of string
        {
          name: {
            endsWith: ` ${query}`,
            mode: "insensitive",
          },
        },
        // Match exact string (single word case)
        {
          name: {
            equals: query,
            mode: "insensitive",
          },
        },
      ],
    };

    // Execute both queries concurrently
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products,
      totalCount,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  } finally {
    await prisma.$disconnect();
  }
}
