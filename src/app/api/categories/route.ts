// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic"; // Add this line
export const fetchCache = "force-no-store"; // Optional but recommended
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const safeLimit = Math.max(limit, 1); // Minimum 1, no upper bound needed here

    // Fetch from database
    const categories = await prisma.category.findMany({
      take: safeLimit, // Limit the number of results
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(categories, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect(); // Clean up Prisma connection
  }
}
