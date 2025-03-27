import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearProducts() {
  // Safety check - only allow this in development or test environments
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    console.error(
      "🚨 Database operations are only allowed in development and test environments!"
    );
    process.exit(1);
  }

  console.log("⚠️ WARNING: This will delete ALL products from the database!");
  console.log("Press CTRL+C within 5 seconds to abort...");

  // Give a chance to abort
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    // Delete all products
    const deleteOrderItems = await prisma.orderItem.deleteMany({});
    const deleteOrders = await prisma.order.deleteMany({});
    const deleteResult = await prisma.product.deleteMany({});

    console.log(`✅ Successfully deleted ${deleteResult.count} products`);
    console.log("✨ Product table cleared successfully!");
  } catch (error) {
    // Proper error type handling
    if (error instanceof Error) {
      console.error("🚨 Error clearing products:", error.message);
    } else {
      console.error("🚨 Unknown error occurred while clearing products");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearProducts();
