// app/api/products/route.ts (or pages/api/products.ts)
import prisma from "@/lib/prisma"; // Adjust path to your Prisma client
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const price = searchParams.get("price");
  let priceMin, priceMax;
  if (price) {
    [priceMin, priceMax] = price.split("-").map(Number);
  }
  const categoryId = searchParams.get("category");
  const skip = (page - 1) * limit; // Calculate how many records to skip

  try {
    // Fetch paginated products
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (price) {
      where.price = {
        gte: priceMin,
        lte: priceMax,
      };
    }
    const products = await prisma.product.findMany({
      where: where,
      skip,
      take: limit, // Limit the number of products
      include: {
        category: true,
      },
    });

    // Get total count for pagination
    const total = await prisma.product.count({
      where: where,
    });

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
