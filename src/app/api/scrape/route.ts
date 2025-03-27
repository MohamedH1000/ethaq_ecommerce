// /src/app/api/scrape/route.ts
import { NextResponse } from "next/server";
import { scrapeProducts } from "@/lib/scraping/scraper";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { html, categoryId } = await request.json();

    if (!html || !categoryId) {
      return NextResponse.json(
        { error: "Missing HTML or categoryId" },
        { status: 400 }
      );
    }

    const products = scrapeProducts(html);

    // Save to database
    const createdProducts = await prisma.$transaction(
      products.map((product) =>
        prisma.product.create({
          data: {
            ...product,
            category: { connect: { id: categoryId } },
            active: true,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      count: createdProducts.length,
    });
  } catch (error) {
    console.error("Scraping failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
