import { JSDOM } from "jsdom";
import prisma from "../prisma";
export interface ScrapedProduct {
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
}

export function scrapeProducts(html: string): ScrapedProduct[] {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const productCards = Array.from(doc.querySelectorAll("ul.css-1omnv59"));

  return productCards
    .map((card) => {
      // Extract name
      const nameElement = card.querySelector('[data-testid="product_name"]');
      const name = nameElement?.textContent?.trim() || "Unknown Product";

      // Extract price (prefer discounted price if available)
      const discountPriceEl = card.querySelector(
        '[data-testid="product-card-discount-price"]'
      );
      const originalPriceEl = card.querySelector(
        '[data-testid="product-card-original-price"]'
      );
      const priceEl = discountPriceEl || originalPriceEl;
      const priceText = priceEl?.textContent?.replace(/[^\d.]/g, "") || "0";
      const price = parseFloat(priceText);

      // Extract discount percentage
      const discountTag = card.querySelector('[data-testid="headerStickerId"]');
      let discount: number | undefined;
      if (discountTag) {
        const discountMatch = discountTag.textContent?.match(/\d+/);
        discount = discountMatch ? parseInt(discountMatch[0]) : undefined;
      }

      // Extract image URL
      const imgElement = card.querySelector(
        'img[data-testid="product_image_main"]'
      );
      const imageUrl = imgElement?.getAttribute("src") || "";
      const images = imageUrl ? [imageUrl] : [];

      // Create description from weight/type info
      const weightElement = card.querySelector(".css-1tmlydx");
      const description =
        weightElement?.textContent?.trim() || "No description available";

      return {
        name,
        description,
        price,
        discount,
        images,
        active: true,
        categoryId,
      };
    })
    .filter((product) => product.name !== "Unknown Product"); // Filter out invalid products
}

// Example usage:
const html = `...your HTML string here...`;
const categoryId = "your-category-id"; // Replace with actual category ID

const scrapedProducts = scrapeProducts(html);

// Function to save to database using Prisma
async function saveProductsToDatabase(products: ScrapedProduct[]) {
  try {
    const createdProducts = await prisma.$transaction(
      products.map((product) =>
        prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            discount: product.discount,
            images: product.images,
            active: product.active,
            category: { connect: { id: product.categoryId } },
          },
        })
      )
    );
    console.log(`Successfully created ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error("Error saving products:", error);
    throw error;
  }
}

// Execute the scraping and saving
saveProductsToDatabase(scrapedProducts)
  .then(() => console.log("Products saved successfully"))
  .catch((err) => console.error("Failed to save products:", err));
