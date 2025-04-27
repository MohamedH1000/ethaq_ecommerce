import { PrismaClient } from "@prisma/client";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

interface ProductData {
  name: string;
  price: number;
  description?: string;
  images?: string[];
  discount?: number;
  // Add other product fields as needed
}

async function deleteAllProductsFromCategory(categoryId: string) {
  try {
    console.log(`⏳ Deleting all products from category ID: ${categoryId}`);

    const deleteResult = await prisma.product.deleteMany({
      where: {
        categoryId: categoryId,
      },
    });

    console.log(`✅ Deleted ${deleteResult.count} products from category`);
    return deleteResult;
  } catch (error) {
    console.error(
      "🚨 Error deleting products:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

async function seedProducts(
  categoryId: string,
  products: ProductData[],
  filterPrefix?: string
) {
  try {
    // Verify the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      console.error(`❌ Category with ID ${categoryId} not found`);
      process.exit(1);
    }

    console.log(`⏳ Seeding products for category: ${category.name}`);

    // First delete all existing products in this category
    // await deleteAllProductsFromCategory(categoryId);

    // Filter products if filterPrefix is provided
    let filteredProducts = products;
    if (filterPrefix) {
      filteredProducts = products.filter(
        (product) => !product?.name?.startsWith(filterPrefix)
      );
      console.log(
        `ℹ️ Filtered to ${filteredProducts.length} products not starting with "${filterPrefix}"`
      );
    }

    // Create all products
    const createdProducts = await prisma.product.createMany({
      //@ts-ignore
      data: filteredProducts.map((product) => ({
        ...product,
        id: new ObjectId().toHexString(), // Generate a valid MongoDB ID
        categoryId: categoryId,
      })),
    });

    console.log(`✅ Successfully created ${createdProducts.count} products`);
    console.log("✨ Products seeded successfully!");

    return createdProducts;
  } catch (error) {
    console.error(
      "🚨 Error seeding products:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage
const electronicsCategoryId = "67f80092a55079d73926dca4"; // Replace with actual category ID

// To filter products starting with "كارفور", call like this:
// seedProducts(electronicsCategoryId, sampleProducts, "كارفور");

// 680d73fd22f0b5fd5721e41b
const sampleProducts: any = [
  {
    name: "جل منظف الغسيل السائل تايد باللافندر، 2.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772112/%D8%AC%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%AA%D8%A7%D9%8A%D8%AF-%D8%A8%D8%A7%D9%84%D9%84%D8%A7%D9%81%D9%86%D8%AF%D8%B1-28-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    price: 53.95,
    description:
      "منظف غسيل فعال جل منظف الغسيل السائل تايد باللافندر، 2.8 لتر، من علامة تايد التجارية المعروفة بقوة تنظيفها العالية، بتركيبة سائلة سهلة الذوبان في الماء، برائحة اللافندر المنعشة، في عبوة اقتصادية سعة 2.8 لتر",
  },
  {
    name: "أومو منظف الغسيل السائل بلمسة من الراحة 2.7 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772113/%D8%A3%D9%88%D9%85%D9%88-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D9%84%D9%85%D8%B3%D8%A9-%D9%85%D9%86-%D8%A7%D9%84%D8%B1%D8%A7%D8%AD%D8%A9-27-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    price: 39.5,
    description:
      "منظف غسيل فعال أومو منظف الغسيل السائل بلمسة من الراحة 2.7 لتر، من علامة أومو التجارية المعروفة بفعاليتها في التنظيف العميق، بتركيبة سائلة سهلة الذوبان في الماء، برائحة منعشة تدوم طويلاً، في عبوة اقتصادية سعة 2.7 لتر",
  },
  {
    name: "برسيل شامبو للعباية الملونة منظف غسيل سائل 3 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772114/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D9%84%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D9%84%D9%88%D9%86%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D8%BA%D8%B3%D9%8A%D9%84-%D8%B3%D8%A7%D8%A6%D9%84-3-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    price: 62,
    description:
      "منظف غسيل فعال برسيل شامبو للعباية الملونة منظف غسيل سائل 3 لتر، من علامة برسيل التجارية المعروفة بتركيبتها المتطورة للعناية بالملابس، بتركيبة سائلة سهلة الذوبان في الماء، مصمم خصيصاً للعناية بالعباءات والحفاظ على ألوانها، يحافظ على الألوان الزاهية للملابس، في عبوة اقتصادية سعة 3 لتر",
  },
  {
    name: "برسيل باور جل منظف ​​الغسيل السائل برائحة الورد 2.9 لتر +\n                      1 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772116/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF-29-%D9%84%D8%AA%D8%B1-1-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 5,
    price: 54.75,
    description:
      "منظف غسيل فعال برسيل باور جل منظف ​​الغسيل السائل برائحة الورد 2.9 لتر + 1 لتر، من علامة برسيل التجارية المعروفة بتركيبتها المتطورة للعناية بالملابس، بتركيبة سائلة سهلة الذوبان في الماء، برائحة الورد الجذابة، في عبوة اقتصادية سعة 2.9 لتر، مع 1 لتر إضافي مجاناً",
  },
  {
    name: "برسيل باور منظف ​​الغسيل السائل جل للغسالات ذات التحميل\n                      العلوي 4.8 لتر - سعر خاص",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772117/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%AC%D9%84-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%B0%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AD%D9%85%D9%8A%D9%84-%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%8A-48-%D9%84%D8%AA%D8%B1-%D8%B3%D8%B9%D8%B1-%D8%AE%D8%A7%D8%B5.jpg.jpg",
    ],
    discount: 11,
    price: 70.95,
    description:
      "منظف غسيل فعال برسيل باور منظف ​​الغسيل السائل جل للغسالات ذات التحميل العلوي 4.8 لتر - سعر خاص، من علامة برسيل التجارية المعروفة بتركيبتها المتطورة للعناية بالملابس، بتركيبة سائلة سهلة الذوبان في الماء، مناسب للغسالات ذات التحميل العلوي، في عبوة اقتصادية سعة 4.8 لتر",
  },
  {
    name: "آريال جل سائل للغسّالات الأوتوماتيكيّة بالرائحة الأصليّة\n                      منظف غسيل لغسيل نظيف خالٍ من البقع 2.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772118/%D8%A2%D8%B1%D9%8A%D8%A7%D9%84-%D8%AC%D9%84-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D8%BA%D8%B3%D9%8A%D9%84-%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D9%86%D8%B8%D9%8A%D9%81-%D8%AE%D8%A7%D9%84-%D9%85%D9%86-%D8%A7%D9%84%D8%A8%D9%82%D8%B9-28-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    price: 53.95,
    description:
      "منظف غسيل فعال آريال جل سائل للغسّالات الأوتوماتيكيّة بالرائحة الأصليّة منظف غسيل لغسيل نظيف خالٍ من البقع 2.8 لتر، من علامة آريال التجارية المميزة بقدرتها على إزالة البقع العنيدة، بتركيبة سائلة سهلة الذوبان في الماء، بالرائحة الأصلية المميزة، يزيل البقع العنيدة بفعالية، مثالي للغسالات الأوتوماتيكية، في عبوة اقتصادية سعة 2.8 لتر",
  },
  {
    name: "آريال جل سائل للغسّالات الأوتوماتيكيّة بالرائحة الأصليّة\n                      منظف غسيل لغسيل نظيف خالٍ من البقع 1.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772119/%D8%A2%D8%B1%D9%8A%D8%A7%D9%84-%D8%AC%D9%84-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D8%BA%D8%B3%D9%8A%D9%84-%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D9%86%D8%B8%D9%8A%D9%81-%D8%AE%D8%A7%D9%84-%D9%85%D9%86-%D8%A7%D9%84%D8%A8%D9%82%D8%B9-18-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 43,
    price: 34.95,
    description:
      "منظف غسيل فعال آريال جل سائل للغسّالات الأوتوماتيكيّة بالرائحة الأصليّة منظف غسيل لغسيل نظيف خالٍ من البقع 1.8 لتر، من علامة آريال التجارية المميزة بقدرتها على إزالة البقع العنيدة، بتركيبة سائلة سهلة الذوبان في الماء، بالرائحة الأصلية المميزة، يزيل البقع العنيدة بفعالية، مثالي للغسالات الأوتوماتيكية، في عبوة اقتصادية سعة 1.8 لتر",
  },
  {
    name: "آريال جل سائل للغسّالات الأوتوماتيكيّة بالرائحة الأصليّة\n                      منظف غسيل لغسيل نظيف خالٍ من البقع 2x 1.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772120/%D8%A2%D8%B1%D9%8A%D8%A7%D9%84-%D8%AC%D9%84-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D8%BA%D8%B3%D9%8A%D9%84-%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D9%86%D8%B8%D9%8A%D9%81-%D8%AE%D8%A7%D9%84-%D9%85%D9%86-%D8%A7%D9%84%D8%A8%D9%82%D8%B9-2x-18-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    price: 64.95,
    description:
      "منظف غسيل فعال آريال جل سائل للغسّالات الأوتوماتيكيّة بالرائحة الأصليّة منظف غسيل لغسيل نظيف خالٍ من البقع 2x 1.8 لتر، من علامة آريال التجارية المميزة بقدرتها على إزالة البقع العنيدة، بتركيبة سائلة سهلة الذوبان في الماء، بالرائحة الأصلية المميزة، يزيل البقع العنيدة بفعالية، مثالي للغسالات الأوتوماتيكية، في عبوة اقتصادية سعة 1.8 لتر",
  },
  {
    name: "أومو منظف ومطهر ​​سائل للغسيل للعباية و الأسود 2.7 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772121/%D8%A3%D9%88%D9%85%D9%88-%D9%85%D9%86%D8%B8%D9%81-%D9%88%D9%85%D8%B7%D9%87%D8%B1-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D9%84%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%88-%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%AF-27-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    price: 39,
    description:
      "منتج عالي الجودة أومو منظف ومطهر ​​سائل للغسيل للعباية و الأسود 2.7 لتر",
  },
  {
    name: "فرشاة تنظيف السيارة من الألياف الدقيقة مثالية كممسحة\n                      وفرشاة غسيل بمقبض طويل وفرشاة غسيل السيارة بمقبض ومنظف\n                      متعدد الأغراض للمنزل والمطبخ والمكتب",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772122/%D9%81%D8%B1%D8%B4%D8%A7%D8%A9-%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D9%85%D9%86-%D8%A7%D9%84%D8%A3%D9%84%D9%8A%D8%A7%D9%81-%D8%A7%D9%84%D8%AF%D9%82%D9%8A%D9%82%D8%A9-%D9%85%D8%AB%D8%A7%D9%84%D9%8A%D8%A9-%D9%83%D9%85%D9%85%D8%B3%D8%AD%D8%A9-%D9%88%D9%81%D8%B1%D8%B4%D8%A7%D8%A9-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A8%D9%85%D9%82%D8%A8%D8%B6-%D8%B7%D9%88%D9%8A%D9%84-%D9%88%D9%81%D8%B1%D8%B4%D8%A7%D8%A9-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D8%A8%D9%85%D9%82%D8%A8%D8%B6-%D9%88%D9%85%D9%86%D8%B8%D9%81-%D9%85%D8%AA%D8%B9%D8%AF%D8%AF-%D8%A7%D9%84%D8%A3%D8%BA%D8%B1%D8%A7%D8%B6-%D9%84%D9%84%D9%85%D9%86%D8%B2%D9%84-%D9%88%D8%A7%D9%84%D9%85%D8%B7%D8%A8%D8%AE-%D9%88%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8.jpg.jpg",
    ],
    price: 55.99,
    description:
      "منتج عالي الجودة فرشاة تنظيف السيارة من الألياف الدقيقة مثالية كممسحة وفرشاة غسيل بمقبض طويل وفرشاة غسيل السيارة بمقبض ومنظف متعدد الأغراض للمنزل والمطبخ والمكتب",
  },
  {
    name: "شامبو غسيل السيارات سورد برو 500 مل - منظف السيارة عالي\n                      اللمعان برائحة الكرز وحماية الطلاء، شامبو غسيل السيارات،\n                      SW-3501",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772123/%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA-%D8%B3%D9%88%D8%B1%D8%AF-%D8%A8%D8%B1%D9%88-500-%D9%85%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D8%B9%D8%A7%D9%84%D9%8A-%D8%A7%D9%84%D9%84%D9%85%D8%B9%D8%A7%D9%86-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%83%D8%B1%D8%B2-%D9%88%D8%AD%D9%85%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D8%B7%D9%84%D8%A7%D8%A1-%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA-sw-3501.jpg.jpg",
    ],
    price: 74.99,
    description:
      "منتج عالي الجودة شامبو غسيل السيارات سورد برو 500 مل - منظف السيارة عالي اللمعان برائحة الكرز وحماية الطلاء، شامبو غسيل السيارات، SW-3501",
  },
  {
    name: "شمع غسيل السيارات سورد برو 1 لتر – منظف السيارة وحماية\n                      الطلاء، ملمع السيارة عالي الجودة وشامبو السيارة اللامع\n                      SW-0343",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772124/%D8%B4%D9%85%D8%B9-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA-%D8%B3%D9%88%D8%B1%D8%AF-%D8%A8%D8%B1%D9%88-1-%D9%84%D8%AA%D8%B1-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D9%88%D8%AD%D9%85%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D8%B7%D9%84%D8%A7%D8%A1-%D9%85%D9%84%D9%85%D8%B9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D8%B9%D8%A7%D9%84%D9%8A-%D8%A7%D9%84%D8%AC%D9%88%D8%AF%D8%A9-%D9%88%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D9%84%D8%A7%D9%85%D8%B9-sw-0343.jpg.jpg",
    ],
    price: 74.99,
    description:
      "منتج عالي الجودة شمع غسيل السيارات سورد برو 1 لتر – منظف السيارة وحماية الطلاء، ملمع السيارة عالي الجودة وشامبو السيارة اللامع SW-0343",
  },
  {
    name: "سائل غسيل الزجاج الأمامي من سورد برو، 500 مل، منظف نوافذ\n                      السيارة، تنظيف سريع ومنظف الزجاج الأمامي للسيارة SW-352",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772125/%D8%B3%D8%A7%D8%A6%D9%84-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B2%D8%AC%D8%A7%D8%AC-%D8%A7%D9%84%D8%A3%D9%85%D8%A7%D9%85%D9%8A-%D9%85%D9%86-%D8%B3%D9%88%D8%B1%D8%AF-%D8%A8%D8%B1%D9%88-500-%D9%85%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D9%86%D9%88%D8%A7%D9%81%D8%B0-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%B3%D8%B1%D9%8A%D8%B9-%D9%88%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%B2%D8%AC%D8%A7%D8%AC-%D8%A7%D9%84%D8%A3%D9%85%D8%A7%D9%85%D9%8A-%D9%84%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-sw-352.jpg.jpg",
    ],
    price: 83.99,
    description:
      "منتج عالي الجودة سائل غسيل الزجاج الأمامي من سورد برو، 500 مل، منظف نوافذ السيارة، تنظيف سريع ومنظف الزجاج الأمامي للسيارة SW-352",
  },
  {
    name: "منظف ​​تيرتل واكس السريع والفعال بدون خطوط - غسيل\n                      سيراميكي بدون ماء للطلاء والزجاج والمعادن والبلاستيك - 591\n                      مل",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772126/%D9%85%D9%86%D8%B8%D9%81-%D8%AA%D9%8A%D8%B1%D8%AA%D9%84-%D9%88%D8%A7%D9%83%D8%B3-%D8%A7%D9%84%D8%B3%D8%B1%D9%8A%D8%B9-%D9%88%D8%A7%D9%84%D9%81%D8%B9%D8%A7%D9%84-%D8%A8%D8%AF%D9%88%D9%86-%D8%AE%D8%B7%D9%88%D8%B7-%D8%BA%D8%B3%D9%8A%D9%84-%D8%B3%D9%8A%D8%B1%D8%A7%D9%85%D9%8A%D9%83%D9%8A-%D8%A8%D8%AF%D9%88%D9%86-%D9%85%D8%A7%D8%A1-%D9%84%D9%84%D8%B7%D9%84%D8%A7%D8%A1-%D9%88%D8%A7%D9%84%D8%B2%D8%AC%D8%A7%D8%AC-%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%A7%D8%AF%D9%86-%D9%88%D8%A7%D9%84%D8%A8%D9%84%D8%A7%D8%B3%D8%AA%D9%8A%D9%83-591-%D9%85%D9%84.jpg.jpg",
    ],
    price: 71.99,
    description:
      "منتج عالي الجودة منظف ​​تيرتل واكس السريع والفعال بدون خطوط - غسيل سيراميكي بدون ماء للطلاء والزجاج والمعادن والبلاستيك - 591 مل",
  },
  {
    name: "مسحوق ڤانيش أوكسي أكشن الذهبي لإزالة بقع الغسيل للألوان\n                      والأبيض ، يمكن استخدامه مع وبدون المنظفات والإضافات\n                      ومنعمات الأقمشة ، مثالي للاستخدام في الغسالة الكهربائية ،\n                      450 جرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772128/%D9%85%D8%B3%D8%AD%D9%88%D9%82-%DA%A4%D8%A7%D9%86%D9%8A%D8%B4-%D8%A3%D9%88%D9%83%D8%B3%D9%8A-%D8%A3%D9%83%D8%B4%D9%86-%D8%A7%D9%84%D8%B0%D9%87%D8%A8%D9%8A-%D9%84%D8%A5%D8%B2%D8%A7%D9%84%D8%A9-%D8%A8%D9%82%D8%B9-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D9%84%D9%84%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D9%88%D8%A7%D9%84%D8%A3%D8%A8%D9%8A%D8%B6-%D9%8A%D9%85%D9%83%D9%86-%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85%D9%87-%D9%85%D8%B9-%D9%88%D8%A8%D8%AF%D9%88%D9%86-%D8%A7%D9%84%D9%85%D9%86%D8%B8%D9%81%D8%A7%D8%AA-%D9%88%D8%A7%D9%84%D8%A5%D8%B6%D8%A7%D9%81%D8%A7%D8%AA-%D9%88%D9%85%D9%86%D8%B9%D9%85%D8%A7%D8%AA-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D9%85%D8%AB%D8%A7%D9%84%D9%8A-%D9%84%D9%84%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D9%81%D9%8A-%D8%A7%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A6%D9%8A%D8%A9-450-%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    price: 54.5,
    description:
      "منتج عالي الجودة مسحوق ڤانيش أوكسي أكشن الذهبي لإزالة بقع الغسيل للألوان والأبيض ، يمكن استخدامه مع وبدون المنظفات والإضافات ومنعمات الأقمشة ، مثالي للاستخدام في الغسالة الكهربائية ، 450 جرام",
  },
  {
    name: "اومو كبسولات غسيل سائلة 3 في 1 لجميع أنواع الأقمشة، منظف\n                      مزيل للبقع برائحة الأوكالبتوس يقضي على 99.9% من البكتيريا\n                      15 قطعة",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745772129/%D8%A7%D9%88%D9%85%D9%88-%D9%83%D8%A8%D8%B3%D9%88%D9%84%D8%A7%D8%AA-%D8%BA%D8%B3%D9%8A%D9%84-%D8%B3%D8%A7%D8%A6%D9%84%D8%A9-3-%D9%81%D9%8A-1-%D9%84%D8%AC%D9%85%D9%8A%D8%B9-%D8%A3%D9%86%D9%88%D8%A7%D8%B9-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D9%85%D8%B2%D9%8A%D9%84-%D9%84%D9%84%D8%A8%D9%82%D8%B9-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%A3%D9%88%D9%83%D8%A7%D9%84%D8%A8%D8%AA%D9%88%D8%B3-%D9%8A%D9%82%D8%B6%D9%8A-%D8%B9%D9%84%D9%89-999-%D9%85%D9%86-%D8%A7%D9%84%D8%A8%D9%83%D8%AA%D9%8A%D8%B1%D9%8A%D8%A7-15-%D9%82%D8%B7%D8%B9%D8%A9.jpg.jpg",
    ],
    price: 24.5,
    description:
      "منتج عالي الجودة اومو كبسولات غسيل سائلة 3 في 1 لجميع أنواع الأقمشة، منظف مزيل للبقع برائحة الأوكالبتوس يقضي على 99.9% من البكتيريا 15 قطعة",
  },
];

// To insert all products without filtering:
seedProducts(electronicsCategoryId, sampleProducts, "كارفور");
