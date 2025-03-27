// /src/actions/scrape-products.ts
"use server";

import { scrapeProducts } from "@/lib/scraping/scraper";
import prisma from "@/lib/prisma";

export async function scrapeAndSaveProducts(html: string, categoryId: string) {
  try {
    const products = scrapeProducts(html);

    const results = await prisma.$transaction(
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

    return { success: true, count: results.length };
  } catch (error) {
    console.error("Scraping failed:", error);
    return { success: false, error: "Failed to scrape products" };
  }
}
