// clearDatabase.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  // Safety check - only allow this in development or specific environments
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    console.error(
      "🚨 Database clearing is only allowed in development and test environments!"
    );
    process.exit(1);
  }

  console.log("⚠️ WARNING: This will delete ALL data from the database!");
  console.log("Press CTRL+C within 5 seconds to abort...");

  // Give a chance to abort
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    // Get all model names from Prisma client
    const modelNames = Object.keys(prisma).filter(
      (key) => !key.startsWith("_") && !key.startsWith("$")
    );

    console.log(`🧹 Clearing ${modelNames.length} collections...`);

    // Delete all records from each model/collection
    for (const modelName of modelNames) {
      try {
        // @ts-ignore - dynamically access model methods
        await prisma[modelName].deleteMany({});
        console.log(`✅ Cleared ${modelName}`);
      } catch (error) {
        console.error(`❌ Error clearing ${modelName}:`, error.message);
      }
    }

    console.log("✨ Database cleared successfully!");
  } catch (error) {
    console.error("🚨 Error clearing database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
