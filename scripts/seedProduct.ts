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
const electronicsCategoryId = "68212492c45bd42b08dba95b"; // Replace with actual category ID

// To filter products starting with "كارفور", call like this:
// seedProducts(electronicsCategoryId, sampleProducts, "كارفور");

// 680d73fd22f0b5fd5721e41b
const sampleProducts: any = [
  {
    name: "تايد Concentrated Laundry Powder Detergent, Original Scent, Automatic Wash, 5 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999643/%D8%AA%D8%A7%D9%8A%D8%AF-concentrated-laundry-powder-detergent-original-scent-automatic-wash-5-kg.jpg.jpg",
    ],
    discount: 55,
    price: 72.25,
    description:
      "مسحوق غسيل تايد المركز برائحة أصلية، مصمم للغسالات الأوتوماتيكية، يوفر تنظيفًا عميقًا وإزالة فعالة للبقع، مثالي للملابس البيضاء والملونة، بحجم 5 كجم.",
  },
  {
    name: "تايد Tide Concentrated Laundry Powder Detergent, Original Scent, Manual Wash, 5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999644/%D8%AA%D8%A7%D9%8A%D8%AF-tide-concentrated-laundry-powder-detergent-original-scent-manual-wash-5-kg.jpg.jpg",
    ],
    discount: 55,
    price: 72.25,
    description:
      "مسحوق غسيل تايد المركز برائحة أصلية، مثالي للغسيل اليدوي، يزيل البقع الصعبة ويمنح الملابس نضارة طويلة الأمد، بحجم 5 كجم.",
  },
  {
    name: "فنيش Quantum All in One Lemon, 90 Pieces",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999645/%D9%81%D9%86%D9%8A%D8%B4-quantum-all-in-one-lemon-90-pieces.jpg.jpg",
    ],
    description:
      "أقراص فنيش كوانتوم الكل في واحد برائحة الليمون، 90 قطعة، توفر تنظيفًا عميقًا للأطباق، تزيل الدهون والبقع الصعبة، وتحمي الأواني من التآكل.",
    price: 109.95,
  },
  {
    price: 20.95,
    name: "فيري Plus Soap With Lemon, 1 L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999646/%D9%81%D9%8A%D8%B1%D9%8A-plus-soap-with-lemon-1-l.jpg.jpg",
    ],
    description:
      "سائل فيري بلس برائحة الليمون، سعة 1 لتر، يزيل الدهون بفعالية ويترك الأطباق نظيفة ولامعة، لطيف على اليدين مع رائحة منعشة.",
  },
  {
    name: "كمفورت منعم الأقمشة أزرق",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999647/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D8%A3%D8%B2%D8%B1%D9%82.jpg.jpg",
    ],
    discount: 37,
    price: 46.55,
    description:
      "منعم الأقمشة كمفورت الأزرق يمنح الملابس نعومة فائقة ورائحة منعشة تدوم طويلاً، مثالي لجميع أنواع الأقمشة.",
  },
  {
    price: 42.5,
    name: "اكسترا وايت White Detergent Powder Flower, 7 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999648/%D8%A7%D9%83%D8%B3%D8%AA%D8%B1%D8%A7-%D9%88%D8%A7%D9%8A%D8%AA-white-detergent-powder-flower-7-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل اكسترا وايت برائحة الزهور، بحجم 7 كجم، مصمم للملابس البيضاء، يزيل البقع ويحافظ على البياض اللامع.",
  },
  {
    name: "برسيل عبوة جل قليل الرغوة بتقنية ديب كلين متعدد الألوان",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999649/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%B9%D8%A8%D9%88%D8%A9-%D8%AC%D9%84-%D9%82%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D8%B1%D8%BA%D9%88%D8%A9-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%AF%D9%8A%D8%A8-%D9%83%D9%84%D9%8A%D9%86-%D9%85%D8%AA%D8%B9%D8%AF%D8%AF-%D8%A7%D9%84%D8%A3%D9%84%D9%88%D8%A7%D9%86.jpg.jpg",
    ],
    discount: 11,
    price: 90.8,
    description:
      "جل برسيل قليل الرغوة بتقنية التنظيف العميق، مثالي للغسالات الأوتوماتيكية، ينظف الملابس الملونة ويحافظ على ألوانها الزاهية.",
  },
  {
    name: "فيري Fairy Plus Soap With Lemon, 800 ml × 2",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999650/%D9%81%D9%8A%D8%B1%D9%8A-fairy-plus-soap-with-lemon-800-ml-2.jpg.jpg",
    ],
    discount: 17,
    price: 27.9,
    description:
      "سائل فيري بلس برائحة الليمون، عبوتين سعة 800 مل، يوفر تنظيفًا قويًا للأطباق، يزيل الدهون بسهولة ويترك رائحة منعشة.",
  },
  {
    name: "فنيش منظف ​​غسالة الصحون بالملح 2 كيلو",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999651/%D9%81%D9%86%D9%8A%D8%B4-%D9%85%D9%86%D8%B8%D9%81-%D8%BA%D8%B3%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D8%B5%D8%AD%D9%88%D9%86-%D8%A8%D8%A7%D9%84%D9%85%D9%84%D8%AD-2-%D9%83%D9%8A%D9%84%D9%88.jpg.jpg",
    ],
    discount: 15,
    price: 62.95,
    description:
      "ملح فنيش لتنظيف غسالة الصحون، بحجم 2 كجم، يمنع تراكم الجير ويحسن أداء الغسالة للحصول على أطباق نظيفة ولامعة.",
  },
  {
    name: "برسيل علبة جل للتنظيف العميق مصنوعة من مادة إسفنجية عالية متعدد الألوان",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999652/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%B9%D9%84%D8%A8%D8%A9-%D8%AC%D9%84-%D9%84%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D9%85%D8%B5%D9%86%D9%88%D8%B9%D8%A9-%D9%85%D9%86-%D9%85%D8%A7%D8%AF%D8%A9-%D8%A5%D8%B3%D9%81%D9%86%D8%AC%D9%8A%D8%A9-%D8%B9%D8%A7%D9%84%D9%8A%D8%A9-%D9%85%D8%AA%D8%B9%D8%AF%D8%AF-%D8%A7%D9%84%D8%A3%D9%84%D9%88%D8%A7%D9%86.jpg.jpg",
    ],
    discount: 11,
    price: 90.8,
    description:
      "جل برسيل للتنظيف العميق بتركيبة إسفنجية متقدمة، مثالي للملابس الملونة، يزيل البقع الصعبة ويحافظ على الألوان.",
  },
  {
    price: 42.5,
    name: "اكسترا وايت White Detergent Powder Original Scent , 5KG + 2KG",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999653/%D8%A7%D9%83%D8%B3%D8%AA%D8%B1%D8%A7-%D9%88%D8%A7%D9%8A%D8%AA-white-detergent-powder-original-scent-5kg-2kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل اكسترا وايت برائحة أصلية، بحجم 5 كجم + 2 كجم مجانًا، يوفر تنظيفًا قويًا للملابس البيضاء مع الحفاظ على لمعانها.",
  },
  {
    name: "داوني منعم أقمشة بعطر نسيم الوادي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999655/%D8%AF%D8%A7%D9%88%D9%86%D9%8A-%D9%85%D9%86%D8%B9%D9%85-%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D8%A8%D8%B9%D8%B7%D8%B1-%D9%86%D8%B3%D9%8A%D9%85-%D8%A7%D9%84%D9%88%D8%A7%D8%AF%D9%8A.jpg.jpg",
    ],
    discount: 20,
    price: 41.5,
    description:
      "منعم الأقمشة داوني برائحة نسيم الوادي، يمنح الملابس نعومة استثنائية ورائحة منعشة تدوم طويلاً.",
  },
  {
    name: "فيري بلاتينوم غسالة أطباق أوتوماتيك برائحة الليمون، 42 قرص",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999656/%D9%81%D9%8A%D8%B1%D9%8A-%D8%A8%D9%84%D8%A7%D8%AA%D9%8A%D9%86%D9%88%D9%85-%D8%BA%D8%B3%D8%A7%D9%84%D8%A9-%D8%A3%D8%B7%D8%A8%D8%A7%D9%82-%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%84%D9%8A%D9%85%D9%88%D9%86-42-%D9%82%D8%B1%D8%B5.jpg.jpg",
    ],
    discount: 57,
    price: 113,
    description:
      "أقراص فيري بلاتينوم برائحة الليمون، 42 قرصًا، للغسالات الأوتوماتيكية، توفر تنظيفًا عميقًا وتزيل الدهون والبقع الصعبة.",
  },
  {
    name: "جيف غسول أطباق يدوي نقي بسعة 750 مل",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999657/%D8%AC%D9%8A%D9%81-%D8%BA%D8%B3%D9%88%D9%84-%D8%A3%D8%B7%D8%A8%D8%A7%D9%82-%D9%8A%D8%AF%D9%88%D9%8A-%D9%86%D9%82%D9%8A-%D8%A8%D8%B3%D8%B9%D8%A9-750-%D9%85%D9%84.jpg.jpg",
    ],
    discount: 23,
    price: 20.3,
    description:
      "سائل جيف لتنظيف الأطباق يدويًا، سعة 750 مل، يزيل الدهون بفعالية ويترك الأطباق نظيفة ولامعة، لطيف على اليدين.",
  },
  {
    price: 43.8,
    name: "جينتو Automatic Detergent Powder, Flower Scent, 4.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999657/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-automatic-detergent-powder-flower-scent-45-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل جينتو الأوتوماتيكي برائحة الزهور، بحجم 4.5 كجم، يوفر تنظيفًا قويًا ويترك الملابس برائحة منعشة.",
  },
  {
    price: 68.95,
    name: "فيري 1 Step Clean Automatic Dishwasher, 70 Tablets",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999658/%D9%81%D9%8A%D8%B1%D9%8A-1-step-clean-automatic-dishwasher-70-tablets.jpg.jpg",
    ],
    description:
      "أقراص فيري للتنظيف بخطوة واحدة، 70 قرصًا، للغسالات الأوتوماتيكية، تزيل الدهون والبقع بفعالية لأطباق نظيفة ولامعة.",
  },
  {
    name: "سيترس منظف فائق القوة شفاف",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999659/%D8%B3%D9%8A%D8%AA%D8%B1%D8%B3-%D9%85%D9%86%D8%B8%D9%81-%D9%81%D8%A7%D8%A6%D9%82-%D8%A7%D9%84%D9%82%D9%88%D8%A9-%D8%B4%D9%81%D8%A7%D9%81.jpg.jpg",
    ],
    discount: 14,
    price: 22.25,
    description:
      "منظف سيترس فائق القوة الشفاف، يزيل الدهون والبقع الصعبة من الأسطح المختلفة، مثالي للتنظيف العميق في المنزل.",
  },
  {
    price: 63.95,
    name: "فيري Fairy Dishwasher Tablets Plus 50 Pcs",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999660/%D9%81%D9%8A%D8%B1%D9%8A-fairy-dishwasher-tablets-plus-50-pcs.jpg.jpg",
    ],
    description:
      "أقراص فيري بلس للغسالات الأوتوماتيكية، 50 قطعة، توفر تنظيفًا قويًا وتزيل البقع الصعبة لأطباق لامعة ونظيفة.",
  },
  {
    name: "كمفورت منعم أقمشة لملابس فائقة النعومة يوفر عطراً برائحة ندى الربيع يدوم طويلاً أزرق 3.0لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999661/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D9%81%D8%A7%D8%A6%D9%82%D8%A9-%D8%A7%D9%84%D9%86%D8%B9%D9%88%D9%85%D8%A9-%D9%8A%D9%88%D9%81%D8%B1-%D8%B9%D8%B7%D8%B1%D8%A7-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D9%86%D8%AF%D9%89-%D8%A7%D9%84%D8%B1%D8%A8%D9%8A%D8%B9-%D9%8A%D8%AF%D9%88%D9%85-%D8%B7%D9%88%D9%8A%D9%84%D8%A7-%D8%A3%D8%B2%D8%B1%D9%82-30%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 16,
    price: 36.35,
    description:
      "منعم أقمشة كمفورت برائحة ندى الربيع، سعة 3 لترات، يمنح الملابس نعومة فائقة ورائحة تدوم طويلاً، مثالي لجميع الأقمشة.",
  },
  {
    name: "اريال Automatic Downy Laundry Detergent Gel, 1.8L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999662/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-automatic-downy-laundry-detergent-gel-18l.jpg.jpg",
    ],
    discount: 22,
    price: 34.95,
    description:
      "جل غسيل اريال الأوتوماتيكي مع داوني، سعة 1.8 لتر، يوفر تنظيفًا عميقًا ونعومة فائقة مع رائحة منعشة للملابس.",
  },
  {
    price: 69.75,
    name: "بونكس 3 In 1 Automatic Laundry Powder Detergent, Original Scent, 7Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999663/%D8%A8%D9%88%D9%86%D9%83%D8%B3-3-in-1-automatic-laundry-powder-detergent-original-scent-7kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل بونكس 3 في 1 برائحة أصلية، بحجم 7 كجم، للغسالات الأوتوماتيكية، ينظف بعمق ويترك رائحة منعشة.",
  },
  {
    price: 106.95,
    name: "Fairy Fairy 1 Step Clean Automatic Dishwasher Tablets, 112 Tablets",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999664/fairy-fairy-1-step-clean-automatic-dishwasher-tablets-112-tablets.jpg.jpg",
    ],
    description:
      "أقراص فيري للتنظيف بخطوة واحدة، 112 قرصًا، للغسالات الأوتوماتيكية، توفر تنظيفًا قويًا وتزيل البقع الصعبة لأطباق لامعة.",
  },
  {
    name: "لوكس سائل تنظيف الأواني برائحة الليمون 1250.0ملليلتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999665/%D9%84%D9%88%D9%83%D8%B3-%D8%B3%D8%A7%D8%A6%D9%84-%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%A3%D9%88%D8%A7%D9%86%D9%8A-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%84%D9%8A%D9%85%D9%88%D9%86-12500%D9%85%D9%84%D9%84%D9%8A%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 18,
    price: 25.05,
    description:
      "سائل لوكس لتنظيف الأواني برائحة الليمون، سعة 1250 مل، يزيل الدهون بفعالية ويترك الأطباق نظيفة وبراقة، لطيف على اليدين.",
  },
  {
    name: "برسيل سائل الغسيل من الجل القوي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999666/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%B3%D8%A7%D8%A6%D9%84-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D9%85%D9%86-%D8%A7%D9%84%D8%AC%D9%84-%D8%A7%D9%84%D9%82%D9%88%D9%8A.jpg.jpg",
    ],
    discount: 21,
    price: 57.5,
    description:
      "سائل غسيل برسيل من الجل القوي، يوفر تنظيفًا عميقًا ويزيل البقع الصعبة، مثالي للغسالات الأوتوماتيكية.",
  },
  {
    name: "بونكس Bonux Original 3 In 1 Detergent Powder High Foam, Automatic Washing Machines, Green, 5Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999668/%D8%A8%D9%88%D9%86%D9%83%D8%B3-bonux-original-3-in-1-detergent-powder-high-foam-automatic-washing-machines-green-5kg.jpg.jpg",
    ],
    discount: 37,
    price: 52.5,
    description:
      "مسحوق غسيل بونكس 3 في 1 برائحة أصلية، بحجم 5 كجم، عالي الرغوة، للغسالات الأوتوماتيكية، ينظف بعمق ويترك رائحة منعشة.",
  },
  {
    price: 27.75,
    name: "سماك Express Multi Degreaser, 650ml × 2 25% Multicolour",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999668/%D8%B3%D9%85%D8%A7%D9%83-express-multi-degreaser-650ml-2-25-multicolour.jpg.jpg",
    ],
    description:
      "مزيل الشحوم سماك اكسبريس، عبوتين سعة 650 مل، يزيل الدهون والبقع من الأسطح المختلفة بفعالية عالية.",
  },
  {
    price: 50.95,
    name: "اريال Automatic Laundry Detergent Gel, 2.8L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999669/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-automatic-laundry-detergent-gel-28l.jpg.jpg",
    ],
    description:
      "جل غسيل اريال الأوتوماتيكي، سعة 2.8 لتر، يوفر تنظيفًا قويًا ويزيل البقع الصعبة مع الحفاظ على نضارة الملابس.",
  },
  {
    name: "فانش مزيل بقع الغسيل السائل الوردي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999671/%D9%81%D8%A7%D9%86%D8%B4-%D9%85%D8%B2%D9%8A%D9%84-%D8%A8%D9%82%D8%B9-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A7%D9%84%D9%88%D8%B1%D8%AF%D9%8A.jpg.jpg",
    ],
    discount: 13,
    price: 53,
    description:
      "سائل فانش لإزالة البقع الوردي، يزيل البقع الصعبة من الملابس بفعالية، مثالي للملابس البيضاء والملونة.",
  },
  {
    price: 4.5,
    name: "REX سائل غسيل الصحون ركس الليمون، 500مل",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999671/rex-%D8%B3%D8%A7%D8%A6%D9%84-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B5%D8%AD%D9%88%D9%86-%D8%B1%D9%83%D8%B3-%D8%A7%D9%84%D9%84%D9%8A%D9%85%D9%88%D9%86-500%D9%85%D9%84.jpg.jpg",
    ],
    description:
      "سائل غسيل الصحون ركس برائحة الليمون، سعة 500 مل، يزيل الدهون بسهولة ويترك الأطباق نظيفة وبراقة.",
  },
  {
    name: "كمفورت منعم أقمشة برائحة براعم الزهور وردي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999672/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A8%D8%B1%D8%A7%D8%B9%D9%85-%D8%A7%D9%84%D8%B2%D9%87%D9%88%D8%B1-%D9%88%D8%B1%D8%AF%D9%8A.jpg.jpg",
    ],
    discount: 37,
    price: 46.55,
    description:
      "منعم أقمشة كمفورت برائحة براعم الزهور الوردية، يمنح الملابس نعومة فائقة ورائحة زهرية منعشة تدوم طويلاً.",
  },
  {
    name: "برسيل جل للبشرة الحساسة، مجموعة من عبوتين 4لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999673/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%AC%D9%84-%D9%84%D9%84%D8%A8%D8%B4%D8%B1%D8%A9-%D8%A7%D9%84%D8%AD%D8%B3%D8%A7%D8%B3%D8%A9-%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%A9-%D9%85%D9%86-%D8%B9%D8%A8%D9%88%D8%AA%D9%8A%D9%86-4%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 19,
    price: 67.9,
    description:
      "جل برسيل للبشرة الحساسة، عبوتين سعة 4 لترات، لطيف على البشرة ويزيل البقع بفعالية مع الحفاظ على نعومة الملابس.",
  },
  {
    price: 20.95,
    name: "Fairy صابون غسيل الصحون فيري برائحة اللافندر، 1ل",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999674/fairy-%D8%B5%D8%A7%D8%A8%D9%88%D9%86-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B5%D8%AD%D9%88%D9%86-%D9%81%D9%8A%D8%B1%D9%8A-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%84%D8%A7%D9%81%D9%86%D8%AF%D8%B1-1%D9%84.jpg.jpg",
    ],
    description:
      "سائل فيري لتنظيف الصحون برائحة اللافندر، سعة 1 لتر، يزيل الدهون بسهولة ويترك الأطباق نظيفة مع رائحة منعشة.",
  },
  {
    price: 69.75,
    name: "بونكس 3 In 1 Original Laundry Powder Detergent, Manual Wash, 7Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999675/%D8%A8%D9%88%D9%86%D9%83%D8%B3-3-in-1-original-laundry-powder-detergent-manual-wash-7kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل بونكس 3 في 1 برائحة أصلية، بحجم 7 كجم، مثالي للغسيل اليدوي، ينظف بعمق ويترك رائحة منعشة.",
  },
  {
    name: "برسيل منظف ​​الغسيل السائل باور جل، بتقنية التنظيف العميق، باللافندر، 4.8 لتر 4.8لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999676/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D8%A8%D8%A7%D9%84%D9%84%D8%A7%D9%81%D9%86%D8%AF%D8%B1-48-%D9%84%D8%AA%D8%B1-48%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 42,
    price: 78.6,
    description:
      "جل برسيل باور برائحة اللافندر، سعة 4.8 لتر، بتقنية التنظيف العميق، يزيل البقع الصعبة ويترك الملابس برائحة منعشة.",
  },
  {
    price: 27.95,
    name: "فيري Fairy Dishwashing Liquid, Refreshing Lavender , 800 ml ×2",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999677/%D9%81%D9%8A%D8%B1%D9%8A-fairy-dishwashing-liquid-refreshing-lavender-800-ml-2.jpg.jpg",
    ],
    description:
      "سائل فيري لتنظيف الصحون برائحة اللافندر المنعشة، عبوتين سعة 800 مل، يزيل الدهون ويترك الأطباق نظيفة وبراقة.",
  },
  {
    price: 97.5,
    name: "Tide تايد مسحوق الغسيل الأصلي، أوتوماتيكي، ٧ كجم +١",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999679/tide-%D8%AA%D8%A7%D9%8A%D8%AF-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A-%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D9%A7-%D9%83%D8%AC%D9%85-%D9%A1.jpg.jpg",
    ],
    description:
      "مسحوق غسيل تايد الأصلي الأوتوماتيكي، بحجم 7 كجم + 1 كجم مجانًا، يوفر تنظيفًا قويًا ويزيل البقع الصعبة بسهولة.",
  },
  {
    name: "سماك مزيل الشحوم متعددة الأنواع إكسبريس بالليمون 650ملليلتر",
    discount: 24,
    price: 23.9,
    description:
      "مزيل الشحوم سماك اكسبريس برائحة الليمون، سعة 650 مل، يزيل الدهون والبقع بفعالية من الأسطح المختلفة.",
  },
  {
    name: "ركس 3 In 1 Laundry Powder Detergent, 10 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999681/%D8%B1%D9%83%D8%B3-3-in-1-laundry-powder-detergent-10-kg.jpg.jpg",
    ],
    discount: 40,
    price: 74.95,
    description:
      "مسحوق غسيل ركس 3 في 1، بحجم 10 كجم، يوفر تنظيفًا قويًا ويزيل البقع الصعبة مع ترك رائحة منعشة.",
  },
  {
    price: 74.5,
    name: "اريال Green Detergent Powder, Automatic , 5 + 1 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999682/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-green-detergent-powder-automatic-5-1-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل اريال الأخضر الأوتوماتيكي، بحجم 5 كجم + 1 كجم مجانًا، ينظف بعمق ويحافظ على نضارة الملابس.",
  },
  {
    name: "داوني منعم الأقمشة العادي برائحة الزهور سعة 3 لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999682/%D8%AF%D8%A7%D9%88%D9%86%D9%8A-%D9%85%D9%86%D8%B9%D9%85-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D8%A7%D9%84%D8%B9%D8%A7%D8%AF%D9%8A-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%B2%D9%87%D9%88%D8%B1-%D8%B3%D8%B9%D8%A9-3-%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 20,
    price: 41.5,
    description:
      "منعم أقمشة داوني برائحة الزهور، سعة 3 لترات، يمنح الملابس نعومة فائقة ورائحة زهرية منعشة تدوم طويلاً.",
  },
  {
    name: "برسيل منظف جل قوي برائحة اللافندر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999683/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%AC%D9%84-%D9%82%D9%88%D9%8A-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%84%D8%A7%D9%81%D9%86%D8%AF%D8%B1.jpg.jpg",
    ],
    discount: 21,
    price: 57.5,
    description:
      "جل برسيل القوي برائحة اللافندر، يوفر تنظيفًا عميقًا ويزيل البقع الصعبة مع ترك رائحة منعشة على الملابس.",
  },
  {
    price: 10.95,
    name: "فايتر فلاش كلور فايتر فلاش مبيض للملابس 2520ملليلتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999684/%D9%81%D8%A7%D9%8A%D8%AA%D8%B1-%D9%81%D9%84%D8%A7%D8%B4-%D9%83%D9%84%D9%88%D8%B1-%D9%81%D8%A7%D9%8A%D8%AA%D8%B1-%D9%81%D9%84%D8%A7%D8%B4-%D9%85%D8%A8%D9%8A%D8%B6-%D9%84%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-2520%D9%85%D9%84%D9%84%D9%8A%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    description:
      "مبيض فايتر فلاش للملابس، سعة 2520 مل، يزيل البقع ويحافظ على بياض الملابس، مثالي للغسيل اليدوي والأوتوماتيكي.",
  },
  {
    price: 26.95,
    name: "اريال Automatic Lavender Laundry Detergent Gel, 1.8L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999685/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-automatic-lavender-laundry-detergent-gel-18l.jpg.jpg",
    ],
    description:
      "جل غسيل اريال الأوتوماتيكي برائحة اللافندر، سعة 1.8 لتر، يوفر تنظيفًا قويًا ويترك رائحة منعشة على الملابس.",
  },
  {
    price: 43.8,
    name: "جينتو Automatic Power Detergent Powder Original Scent, 4.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999686/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-automatic-power-detergent-powder-original-scent-45-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل جينتو الأوتوماتيكي برائحة أصلية، بحجم 4.5 كجم، ينظف بعمق ويترك الملابس برائحة منعشة.",
  },
  {
    price: 27.95,
    name: "فيري Plus Fruity Green Dishwashing Liquid Soap With Alternative Power To Bleach, 2x800ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999688/%D9%81%D9%8A%D8%B1%D9%8A-plus-fruity-green-dishwashing-liquid-soap-with-alternative-power-to-bleach-2x800ml.jpg.jpg",
    ],
    description:
      "سائل فيري بلس الأخضر الفاكهي، عبوتين سعة 800 مل، يزيل الدهون بفعالية ويحتوي على قوة بديلة للمبيض لأطباق نظيفة.",
  },
  {
    name: "بريل Multi Power Lemon Dishwashing Liquid, 1 Liter + 500 ml Free",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999689/%D8%A8%D8%B1%D9%8A%D9%84-multi-power-lemon-dishwashing-liquid-1-liter-500-ml-free.jpg.jpg",
    ],
    discount: 6,
    price: 13.9,
    description:
      "سائل بريل متعدد القوى برائحة الليمون، سعة 1 لتر + 500 مل مجانًا، يزيل الدهون ويترك الأطباق نظيفة وبراقة.",
  },
  {
    price: 24.95,
    name: "Tide مسحوق غسيل تايد باللافندر مع داوني، 1.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999690/tide-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%AA%D8%A7%D9%8A%D8%AF-%D8%A8%D8%A7%D9%84%D9%84%D8%A7%D9%81%D9%86%D8%AF%D8%B1-%D9%85%D8%B9-%D8%AF%D8%A7%D9%88%D9%86%D9%8A-18-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    description:
      "جل غسيل تايد باللافندر مع داوني، سعة 1.8 لتر، يوفر تنظيفًا قويًا ونعومة فائقة مع رائحة منعشة للملابس.",
  },
  {
    price: 48.5,
    name: "برسيل Automatic Powder Laundry Detergent, 5 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999691/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-automatic-powder-laundry-detergent-5-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل برسيل الأوتوماتيكي، بحجم 5 كجم، يوفر تنظيفًا قويًا ويزيل البقع الصعبة مع الحفاظ على نضارة الملابس.",
  },
  {
    name: "لوكس سائل غسيل الأطباق العادي للحصول على أطباق نظيفة وبراقة قوي على الدهون ولطيف على اليدين 1250ملليلتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999692/%D9%84%D9%88%D9%83%D8%B3-%D8%B3%D8%A7%D8%A6%D9%84-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%A3%D8%B7%D8%A8%D8%A7%D9%82-%D8%A7%D9%84%D8%B9%D8%A7%D8%AF%D9%8A-%D9%84%D9%84%D8%AD%D8%B5%D9%88%D9%84-%D8%B9%D9%84%D9%89-%D8%A3%D8%B7%D8%A8%D8%A7%D9%82-%D9%86%D8%B8%D9%8A%D9%81%D8%A9-%D9%88%D8%A8%D8%B1%D8%A7%D9%82%D8%A9-%D9%82%D9%88%D9%8A-%D8%B9%D9%84%D9%89-%D8%A7%D9%84%D8%AF%D9%87%D9%88%D9%86-%D9%88%D9%84%D8%B7%D9%8A%D9%81-%D8%B9%D9%84%D9%89-%D8%A7%D9%84%D9%8A%D8%AF%D9%8A%D9%86-1250%D9%85%D9%84%D9%84%D9%8A%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 18,
    price: 25.05,
    description:
      "سائل لوكس لتنظيف الأطباق، سعة 1250 مل، قوي على الدهون ولطيف على اليدين، يترك الأطباق نظيفة وبراقة.",
  },
  {
    price: 52.95,
    name: "برسيل Abaya Shampoo, 3.6 L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1746999693/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-abaya-shampoo-36-l.jpg.jpg",
    ],
    description:
      "شامبو برسيل للعبايات، سعة 3.6 لتر، ينظف العبايات بعمق ويحافظ على لونها الأسود الداكن مع رائحة منعشة.",
  },
  {
    price: 15.5,
    name: "جينتو سائل تنظيف الأطباق برائحة التفاح أبيض",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000781/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D8%B3%D8%A7%D8%A6%D9%84-%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%A3%D8%B7%D8%A8%D8%A7%D9%82-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D8%AD-%D8%A3%D8%A8%D9%8A%D8%B6.jpg.jpg",
    ],
    description:
      "سائل جينتو لتنظيف الأطباق برائحة التفاح، يزيل الدهون بفعالية ويترك الأطباق نظيفة مع رائحة منعشة.",
  },
  {
    name: "بريل بريل سائل غسيل الصحون برائحة التفاح، 1.5 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000782/%D8%A8%D8%B1%D9%8A%D9%84-%D8%A8%D8%B1%D9%8A%D9%84-%D8%B3%D8%A7%D8%A6%D9%84-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B5%D8%AD%D9%88%D9%86-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D8%AD-15-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 6,
    price: 13.9,
    description:
      "سائل بريل لتنظيف الصحون برائحة التفاح، سعة 1.5 لتر، يزيل الدهون بسهولة ويترك الأطباق نظيفة وبراقة.",
  },
  {
    name: "كمفورت Concentrated Fabric Softener Iris & Jasmine, 1L Black",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000783/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-concentrated-fabric-softener-iris-jasmine-1l-black.jpg.jpg",
    ],
    discount: 36,
    price: 33.05,
    description:
      "منعم أقمشة كمفورت المركز برائحة السوسن والياسمين، سعة 1 لتر، يمنح الملابس نعومة فائقة ورائحة فاخرة تدوم طويلاً.",
  },
  {
    price: 55.95,
    name: "أومو Automatic Laundry Powder Detergent with Comfort, 6 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000784/%D8%A3%D9%88%D9%85%D9%88-automatic-laundry-powder-detergent-with-comfort-6-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أومو الأوتوماتيكي مع كمفورت، بحجم 6 كجم، ينظف بعمق ويترك الملابس ناعمة برائحة منعشة.",
  },
  {
    name: "MOBi مسحوق غسيل مولي أزرق ، 10 كجم",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000785/mobi-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D9%85%D9%88%D9%84%D9%8A-%D8%A3%D8%B2%D8%B1%D9%82-10-%D9%83%D8%AC%D9%85.jpg.jpg",
    ],
    discount: 40,
    price: 93,
    description:
      "مسحوق غسيل مولي الأزرق، بحجم 10 كجم، يوفر تنظيفًا قويًا ويزيل البقع الصعبة مع ترك رائحة منعشة.",
  },
  {
    price: 42.95,
    name: "أومو Active Automatic Laundry Powder Detergent, 4.5 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000786/%D8%A3%D9%88%D9%85%D9%88-active-automatic-laundry-powder-detergent-45-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أومو أكتيف الأوتوماتيكي، بحجم 4.5 كجم، ينظف بعمق ويزيل البقع الصعبة مع الحفاظ على نضارة الملابس.",
  },
  {
    name: "فانش سائل مزيل للبقع للملابس الملونة والبيضاء متعدد الألوان",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000787/%D9%81%D8%A7%D9%86%D8%B4-%D8%B3%D8%A7%D8%A6%D9%84-%D9%85%D8%B2%D9%8A%D9%84-%D9%84%D9%84%D8%A8%D9%82%D8%B9-%D9%84%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D8%A7%D9%84%D9%85%D9%84%D9%88%D9%86%D8%A9-%D9%88%D8%A7%D9%84%D8%A8%D9%8A%D8%B6%D8%A7%D8%A1-%D9%85%D8%AA%D8%B9%D8%AF%D8%AF-%D8%A7%D9%84%D8%A3%D9%84%D9%88%D8%A7%D9%86.jpg.jpg",
    ],
    discount: 27,
    price: 68.95,
    description:
      "سائل فانش لإزالة البقع، مثالي للملابس الملونة والبيضاء، يزيل البقع الصعبة بفعالية ويحافظ على الألوان.",
  },
  {
    name: "جيف غسيل صحون مضاد للبكتيريا",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000788/%D8%AC%D9%8A%D9%81-%D8%BA%D8%B3%D9%8A%D9%84-%D8%B5%D8%AD%D9%88%D9%86-%D9%85%D8%B6%D8%A7%D8%AF-%D9%84%D9%84%D8%A8%D9%83%D8%AA%D9%8A%D8%B1%D9%8A%D8%A7.jpg.jpg",
    ],
    discount: 23,
    price: 20.3,
    description:
      "سائل غسيل الصحون جيف المضاد للبكتيريا يقدم تنظيفًا قويًا وفعالًا، يزيل الدهون ويقتل البكتيريا لضمان أطباق نظيفة وصحية.",
  },
  {
    price: 67.95,
    name: "Tide صابون تايد الأصلي، لآلات الغسيل الأوتوماتيكية، 5+1 كغ",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000789/tide-%D8%B5%D8%A7%D8%A8%D9%88%D9%86-%D8%AA%D8%A7%D9%8A%D8%AF-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A-%D9%84%D8%A2%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A%D8%A9-51-%D9%83%D8%BA.jpg.jpg",
    ],
    description:
      "مسحوق غسيل تايد الأصلي للغسالات الأوتوماتيكية يوفر تنظيفًا عميقًا وإزالة فعالة للبقع مع رائحة منعشة تدوم طويلاً.",
  },
  {
    price: 74.95,
    name: "برسيل Laundry Detergent Powder with Deep Clean Technology, 6.8kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000790/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-laundry-detergent-powder-with-deep-clean-technology-68kg.jpg.jpg",
    ],
    description:
      "مسحوق برسيل بتقنية التنظيف العميق يزيل أصعب البقع ويحافظ على الألوان الزاهية، مثالي للغسيل اليومي بكمية كبيرة.",
  },
  {
    price: 49.95,
    name: "داوني Concentrated Fabric Softener, Vanilla and Musk Scent, 2L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000791/%D8%AF%D8%A7%D9%88%D9%86%D9%8A-concentrated-fabric-softener-vanilla-and-musk-scent-2l.jpg.jpg",
    ],
    description:
      "منعم الأقمشة داوني المركز برائحة الفانيليا والمسك يمنح ملابسك نعومة فائقة ورائحة فاخرة تدوم لأيام.",
  },
  {
    name: "ركس Rex 3 In 1 Laundry Powder Detergent, Cleans & Freshens For Easy Ironing, 25 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000792/%D8%B1%D9%83%D8%B3-rex-3-in-1-laundry-powder-detergent-cleans-freshens-for-easy-ironing-25-kg.jpg.jpg",
    ],
    discount: 21,
    price: 139.95,
    description:
      "مسحوق غسيل ركس 3 في 1 ينظف بعمق، يضفي رائحة منعشة ويسهل الكي، مثالي للاستخدام التجاري أو العائلات الكبيرة.",
  },
  {
    price: 52.95,
    name: "برسيل Abaya Shampoo with Oud Scent, 3.6 L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000793/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-abaya-shampoo-with-oud-scent-36-l.jpg.jpg",
    ],
    description:
      "شامبو برسيل للعبايات برائحة العود ينظف العبايات بلطف، يحافظ على لونها الأسود الداكن ويمنحها رائحة فاخرة.",
  },
  {
    price: 15.5,
    name: "جينتو سائل لغسالة الصحون",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000794/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D8%B5%D8%AD%D9%88%D9%86.jpg.jpg",
    ],
    description:
      "سائل جينتو لغسالة الصحون يوفر تنظيفًا قويًا للأطباق، يزيل الدهون والبقع الصعبة ويترك الأواني لامعة.",
  },
  {
    name: "كمفورت منعم منسوجات مركز أسود",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000795/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D9%85%D9%86%D8%B3%D9%88%D8%AC%D8%A7%D8%AA-%D9%85%D8%B1%D9%83%D8%B2-%D8%A3%D8%B3%D9%88%D8%AF.jpg.jpg",
    ],
    discount: 36,
    price: 33.05,
    description:
      "منعم كمفورت المركز الأسود يمنح الملابس نعومة استثنائية ورائحة غنية، مثالي للملابس الداكنة والفاخرة.",
  },
  {
    price: 74.5,
    name: "اريال Automatic Lavender Laundry Detergent Powder, 4.5Kg + 1Kg Free",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000796/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-automatic-lavender-laundry-detergent-powder-45kg-1kg-free.jpg.jpg",
    ],
    description:
      "مسحوق أريال الأوتوماتيكي برائحة اللافندر يزيل البقع بفعالية ويمنح الملابس نضارة ورائحة زكية مع كمية إضافية مجانية.",
  },
  {
    price: 97.5,
    name: "Tide مسحوق غسل تايد نصف أوتوماتيكي مع لمسة من داوني 6.25 كجم + 1",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000798/tide-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%84-%D8%AA%D8%A7%D9%8A%D8%AF-%D9%86%D8%B5%D9%81-%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D9%85%D8%B9-%D9%84%D9%85%D8%B3%D8%A9-%D9%85%D9%86-%D8%AF%D8%A7%D9%88%D9%86%D9%8A-625-%D9%83%D8%AC%D9%85-1.jpg.jpg",
    ],
    description:
      "مسحوق تايد نصف أوتوماتيكي مع لمسة داوني يوفر تنظيفًا قويًا ورائحة منعشة، مثالي للغسالات شبه الأوتوماتيكية.",
  },
  {
    name: "Tide مسحوق غسيل تايد شبه الأوتوماتيكي الأصلي، 5+1 كجم",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000800/tide-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%AA%D8%A7%D9%8A%D8%AF-%D8%B4%D8%A8%D9%87-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A-51-%D9%83%D8%AC%D9%85.jpg.jpg",
    ],
    discount: 21,
    price: 72.95,
    description:
      "مسحوق تايد شبه الأوتوماتيكي الأصلي ينظف الملابس بعمق ويحافظ على ألوانها، مع كمية إضافية مجانية.",
  },
  {
    price: 14.95,
    name: "فيد فاد فضفاض بخاخ مزيل الكهرباء الساكنة،(400ml) 300 مل + 33% مجانا",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000800/%D9%81%D9%8A%D8%AF-%D9%81%D8%A7%D8%AF-%D9%81%D8%B6%D9%81%D8%A7%D8%B6-%D8%A8%D8%AE%D8%A7%D8%AE-%D9%85%D8%B2%D9%8A%D9%84-%D8%A7%D9%84%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1-%D8%A7%D9%84%D8%B3%D8%A7%D9%83%D9%86%D8%A9400ml-300-%D9%85%D9%84-33-%D9%85%D8%AC%D8%A7%D9%86%D8%A7.jpg.jpg",
    ],
    description:
      "بخاخ فيد فاد يزيل الكهرباء الساكنة من الملابس بسهولة، يتركها ناعمة ومريحة مع كمية إضافية مجانية.",
  },
  {
    name: "برسيل منظف الغسيل السائل باور جل بتقنية التنظيف العميق بالزهرة البيضاء",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000802/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D8%A8%D8%A7%D9%84%D8%B2%D9%87%D8%B1%D8%A9-%D8%A7%D9%84%D8%A8%D9%8A%D8%B6%D8%A7%D8%A1.jpg.jpg",
    ],
    discount: 42,
    price: 78.6,
    description:
      "جل برسيل باور بتقنية التنظيف العميق برائحة الزهرة البيضاء يزيل البقع الصعبة ويمنح الملابس نضارة استثنائية.",
  },
  {
    price: 43.8,
    name: "جينتو Power Washing Powder Oud Scent, 4.5Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000804/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-power-washing-powder-oud-scent-45kg.jpg.jpg",
    ],
    description:
      "مسحوق جينتو برائحة العود يوفر تنظيفًا قويًا، يزيل البقع ويترك الملابس برائحة فاخرة ومنعشة.",
  },
  {
    name: "كمفورت منعم أقمشة لملابس ناعمة للغاية 3.0لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000805/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D9%86%D8%A7%D8%B9%D9%85%D8%A9-%D9%84%D9%84%D8%BA%D8%A7%D9%8A%D8%A9-30%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 16,
    price: 36.35,
    description:
      "منعم كمفورت يمنح الملابس نعومة فائقة ورائحة منعشة، مثالي لجميع أنواع الأقمشة بكمية كبيرة.",
  },
  {
    price: 97.5,
    name: "Tide مسحوق detergent Tide نصف آلي أصلي ، 7 كغ + 1",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000806/tide-%D9%85%D8%B3%D8%AD%D9%88%D9%82-detergent-tide-%D9%86%D8%B5%D9%81-%D8%A2%D9%84%D9%8A-%D8%A3%D8%B5%D9%84%D9%8A-7-%D9%83%D8%BA-1.jpg.jpg",
    ],
    description:
      "مسحوق تايد نصف أوتوماتيكي الأصلي ينظف الملابس بعمق ويحافظ على نضارتها مع كمية إضافية مجانية.",
  },
  {
    price: 10.75,
    name: "ركس Rex Liquid Laundry Bleach, 3.78 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000807/%D8%B1%D9%83%D8%B3-rex-liquid-laundry-bleach-378-liter.jpg.jpg",
    ],
    description:
      "مبيض ركس السائل يزيل البقع الصعبة ويبيض الملابس بأمان، مثالي للغسيل اليومي والتنظيف العميق.",
  },
  {
    name: "بونكس Bonux Original 3 In 1 Detergent Powder, Regular Washing Machines, Blue, 5Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000808/%D8%A8%D9%88%D9%86%D9%83%D8%B3-bonux-original-3-in-1-detergent-powder-regular-washing-machines-blue-5kg.jpg.jpg",
    ],
    discount: 37,
    price: 52.5,
    description:
      "مسحوق بونكس 3 في 1 ينظف، ينعش ويزيل البقع بفعالية، مثالي للغسالات العادية برائحة زرقاء منعشة.",
  },
  {
    name: "Ariel مسحوق غسيل أرييل الأوتوماتيكي الأصلي، 7 كج + 1",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000809/ariel-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A3%D8%B1%D9%8A%D9%8A%D9%84-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A-7-%D9%83%D8%AC-1.jpg.jpg",
    ],
    discount: 5,
    price: 99.95,
    description:
      "مسحوق أريال الأوتوماتيكي الأصلي يوفر تنظيفًا عميقًا ويحافظ على الألوان مع كمية إضافية مجانية.",
  },
  {
    name: "جينتو مسحوق غسيل برائحة العود أبيض 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000811/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-%D8%A3%D8%A8%D9%8A%D8%B6-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    discount: 40,
    price: 39.1,
    description:
      "مسحوق جينتو برائحة العود الأبيض ينظف الملابس بعمق ويمنحها رائحة فاخرة ومنعشة تدوم طويلاً.",
  },
  {
    name: "جينتو مسحوق مزيل للبقع مضاد للبكتيريا أبيض",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000812/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D9%85%D8%B2%D9%8A%D9%84-%D9%84%D9%84%D8%A8%D9%82%D8%B9-%D9%85%D8%B6%D8%A7%D8%AF-%D9%84%D9%84%D8%A8%D9%83%D8%AA%D9%8A%D8%B1%D9%8A%D8%A7-%D8%A3%D8%A8%D9%8A%D8%B6.jpg.jpg",
    ],
    discount: 20,
    price: 54.95,
    description:
      "مسحوق جينتو المضاد للبكتيريا يزيل البقع الصعبة ويقتل البكتيريا، مثالي للحفاظ على نظافة الملابس البيضاء.",
  },
  {
    price: 48.5,
    name: "برسيل Persil Deep Clean plus Concentrated Powder Laundry Detergent, 5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000814/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-persil-deep-clean-plus-concentrated-powder-laundry-detergent-5-kg.jpg.jpg",
    ],
    description:
      "مسحوق برسيل ديب كلين المركز يقدم تنظيفًا عميقًا وفعالًا، يزيل البقع ويحافظ على نضارة الملابس.",
  },
  {
    price: 49.95,
    name: "داوني Concentrated Fabric Softener, Lavender and Musk Scent, 2L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000815/%D8%AF%D8%A7%D9%88%D9%86%D9%8A-concentrated-fabric-softener-lavender-and-musk-scent-2l.jpg.jpg",
    ],
    description:
      "منعم داوني المركز برائحة اللافندر والمسك يمنح الملابس نعومة ورائحة زكية تدوم لفترة طويلة.",
  },
  {
    price: 30.5,
    name: "أومو Omo Laundry Detergent Powder, Manual Wash, 2.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000816/%D8%A3%D9%88%D9%85%D9%88-omo-laundry-detergent-powder-manual-wash-25-kg.jpg.jpg",
    ],
    description:
      "مسحوق أومو للغسيل اليدوي يزيل البقع بسهولة ويحافظ على الأقمشة، مثالي للتنظيف اليدوي اليومي.",
  },
  {
    name: "جينتو مسحوق غسيل برائحة الورد أبيض 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000817/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF-%D8%A3%D8%A8%D9%8A%D8%B6-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    discount: 40,
    price: 39.1,
    description:
      "مسحوق جينتو برائحة الورد الأبيض ينظف الملابس بعمق ويضفي رائحة زهرية منعشة وناعمة.",
  },
  {
    name: "نولين منعم الأقمشة برائحة نسيم الحدائق 3لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000819/%D9%86%D9%88%D9%84%D9%8A%D9%86-%D9%85%D9%86%D8%B9%D9%85-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D9%86%D8%B3%D9%8A%D9%85-%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-3%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 12,
    price: 25.15,
    description:
      "منعم نولين برائحة نسيم الحدائق يمنح الملابس نعومة ورائحة طبيعية منعشة، مثالي للاستخدام اليومي.",
  },
  {
    price: 49.95,
    name: "داوني Concentrated Fabric Softener, Valley Dew Scent, 2L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000819/%D8%AF%D8%A7%D9%88%D9%86%D9%8A-concentrated-fabric-softener-valley-dew-scent-2l.jpg.jpg",
    ],
    description:
      "منعم داوني المركز برائحة ندى الوادي يوفر نعومة استثنائية ورائحة منعشة تدوم طويلاً.",
  },
  {
    price: 50.95,
    name: "اريال Ariel Automatic Original Scent Laundry Detergent Gel, 2.8L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000820/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-ariel-automatic-original-scent-laundry-detergent-gel-28l.jpg.jpg",
    ],
    description:
      "جل أريال الأوتوماتيكي برائحة أصلية يزيل البقع بفعالية ويحافظ على نضارة الملابس بتركيبة مركزة.",
  },
  {
    name: "برسيل منظف الغسيل السائل باور جل بتقنية التنظيف العميق، أزرق، 4.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000821/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D8%A3%D8%B2%D8%B1%D9%82-48-%D9%84%D8%AA%D8%B1-%D8%A3%D8%B2%D8%B1%D9%82-48%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 42,
    price: 78.6,
    description:
      "جل برسيل باور الأزرق بتقنية التنظيف العميق يزيل البقع الصعبة ويمنح الملابس نضارة ورائحة منعشة.",
  },
  {
    price: 8.95,
    name: "فيري Fairy Dish Soap with Lemon, 400 ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000822/%D9%81%D9%8A%D8%B1%D9%8A-fairy-dish-soap-with-lemon-400-ml.jpg.jpg",
    ],
    description:
      "سائل فيري برائحة الليمون يزيل الدهون بسهولة ويترك الأطباق نظيفة ولامعة برائحة منعشة.",
  },
  {
    price: 44.95,
    name: "برسيل Power Gel Liquid Detergent Rose, 2.9 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000823/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-power-gel-liquid-detergent-rose-29-liter.jpg.jpg",
    ],
    description:
      "جل برسيل باور برائحة الورد ينظف الملابس بعمق ويمنحها رائحة زهرية فاخرة تدوم طويلاً.",
  },
  {
    price: 52.95,
    name: "فنيش Rinse Aid Shine & Protect, 400ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000824/%D9%81%D9%86%D9%8A%D8%B4-rinse-aid-shine-protect-400ml.jpg.jpg",
    ],
    description:
      "فنيش رينس إيد يعزز لمعان الأطباق ويحميها من البقع المائية، مثالي لغسالات الصحون.",
  },
  {
    price: 55.95,
    name: "أومو Active Automatic Antibacterial Laundry Detergent Powder,6Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000825/%D8%A3%D9%88%D9%85%D9%88-active-automatic-antibacterial-laundry-detergent-powder6kg.jpg.jpg",
    ],
    description:
      "مسحوق أومو الأوتوماتيكي المضاد للبكتيريا ينظف بعمق ويقتل البكتيريا، مثالي للحفاظ على نظافة الملابس.",
  },
  {
    name: "كمفورت منعم منسوجات مركز أسود 1400ملليلتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000827/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D9%85%D9%86%D8%B3%D9%88%D8%AC%D8%A7%D8%AA-%D9%85%D8%B1%D9%83%D8%B2-%D8%A3%D8%B3%D9%88%D8%AF-1400%D9%85%D9%84%D9%84%D9%8A%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 11,
    price: 42.95,
    description:
      "منعم كمفورت المركز الأسود يمنح الملابس نعومة ورائحة غنية، مثالي للملابس الداكنة بتركيبة مركزة.",
  },
  {
    price: 27.95,
    name: "فيري Fairy Plus Anti-Bacterial Soap , 800 ml × 2",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000828/%D9%81%D9%8A%D8%B1%D9%8A-fairy-plus-anti-bacterial-soap-800-ml-2.jpg.jpg",
    ],
    description:
      "سائل فيري بلس المضاد للبكتيريا ينظف الأطباق بعمق، يقتل البكتيريا ويتركها لامعة وصحية.",
  },
  {
    price: 4.5,
    name: "REX سائل غسيل الصحون ركس بالتفاح، 500 مل",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000829/rex-%D8%B3%D8%A7%D8%A6%D9%84-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B5%D8%AD%D9%88%D9%86-%D8%B1%D9%83%D8%B3-%D8%A8%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D8%AD-500-%D9%85%D9%84.jpg.jpg",
    ],
    description:
      "سائل ركس لغسيل الصحون برائحة التفاح يزيل الدهون بسهولة ويترك الأطباق نظيفة برائحة منعشة.",
  },
  {
    price: 27.95,
    name: "فيري Fairy Dishwashing Liquid, Rose Bloom, 2 × 800ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000831/%D9%81%D9%8A%D8%B1%D9%8A-fairy-dishwashing-liquid-rose-bloom-2-800ml.jpg.jpg",
    ],
    description:
      "سائل فيري برائحة زهرة الورد ينظف الأطباق بفعالية ويتركها لامعة برائحة زهرية فاخرة.",
  },
  {
    name: "برسيل منظف الغسيل السائل باور جل مع تقنية التنظيف العميق للغسالات ذات التحميل العلوي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000832/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D9%85%D8%B9-%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%B0%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AD%D9%85%D9%8A%D9%84-%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%8A.jpg.jpg",
    ],
    discount: 42,
    price: 78.6,
    description:
      "جل برسيل باور للغسالات ذات التحميل العلوي يزيل البقع الصعبة ويحافظ على نضارة الملابس بتقنية التنظيف العميق.",
  },
  {
    name: "كلوركس مبيض سائل لتنظيف وتعقيم المنزل برائحة البرتقال أبيض 3.78لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000833/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%A8%D9%8A%D8%B6-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D9%88%D8%AA%D8%B9%D9%82%D9%8A%D9%85-%D8%A7%D9%84%D9%85%D9%86%D8%B2%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%A8%D8%B1%D8%AA%D9%82%D8%A7%D9%84-%D8%A3%D8%A8%D9%8A%D8%B6-378%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 27,
    price: 24.6,
    description:
      "مبيض كلوركس السائل برائحة البرتقال ينظف ويعقم المنزل بفعالية، مثالي للملابس والأسطح.",
  },
  {
    name: "جينتو Automatic Laundry Detergent Green Rose Scent 7 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000834/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-automatic-laundry-detergent-green-rose-scent-7-kg.jpg.jpg",
    ],
    discount: 16,
    price: 57.95,
    description:
      "مسحوق جينتو الأوتوماتيكي برائحة الورد الأخضر ينظف الملابس بعمق ويمنحها رائحة منعشة وطبيعية.",
  },
  {
    name: "برسيل منظف سائل أبيض، بتقنية التنظيف العميق للغسالات ذات التحميل العلوي، العود 3+1 لتر 4لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000835/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%B3%D8%A7%D8%A6%D9%84-%D8%A3%D8%A8%D9%8A%D8%B6-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%B0%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AD%D9%85%D9%8A%D9%84-%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%8A-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-31-%D9%84%D8%AA%D8%B1-4%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 17,
    price: 63.85,
    description:
      "جل برسيل السائل الأبيض برائحة العود للغسالات ذات التحميل العلوي ينظف بعمق ويحافظ على الألوان.",
  },
  {
    price: 33.95,
    name: "جينتو Power Laundry Detergent Gel , Automatic , Fresh Scent , 3L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000836/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-power-laundry-detergent-gel-automatic-fresh-scent-3l.jpg.jpg",
    ],
    description:
      "جل جينتو باور الأوتوماتيكي برائحة منعشة يزيل البقع الصعبة ويمنح الملابس نضارة تدوم طويلاً.",
  },
  {
    name: "Tide منظف غسيل جيل تايد برائحة الزهور مع داوني، 1.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000837/tide-%D9%85%D9%86%D8%B8%D9%81-%D8%BA%D8%B3%D9%8A%D9%84-%D8%AC%D9%8A%D9%84-%D8%AA%D8%A7%D9%8A%D8%AF-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%B2%D9%87%D9%88%D8%B1-%D9%85%D8%B9-%D8%AF%D8%A7%D9%88%D9%86%D9%8A-18-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 28,
    price: 34.95,
    description:
      "جل تايد برائحة الزهور مع لمسة داوني ينظف الملابس بعمق ويمنحها رائحة زهرية منعشة.",
  },

  {
    name: "بريل بريل سائل غسيل الصحون برائحة التفاح، 1.5 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000782/%D8%A8%D8%B1%D9%8A%D9%84-%D8%A8%D8%B1%D9%8A%D9%84-%D8%B3%D8%A7%D8%A6%D9%84-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B5%D8%AD%D9%88%D9%86-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D8%AD-15-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 6,
    price: 13.9,
    description:
      "سائل بريل لغسيل الصحون برائحة التفاح ينظف الأطباق بفعالية ويتركها لامعة برائحة منعشة.",
  },

  {
    name: "MOBi مسحوق غسيل مولي أزرق ، 10 كجم",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000785/mobi-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D9%85%D9%88%D9%84%D9%8A-%D8%A3%D8%B2%D8%B1%D9%82-10-%D9%83%D8%AC%D9%85.jpg.jpg",
    ],
    discount: 40,
    price: 93,
    description:
      "مسحوق مولي الأزرق يوفر تنظيفًا قويًا وفعالًا، مثالي للعائلات الكبيرة بكمية كبيرة اقتصادية.",
  },

  {
    name: "فانش سائل مزيل للبقع للملابس الملونة والبيضاء متعدد الألوان",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000787/%D9%81%D8%A7%D9%86%D8%B4-%D8%B3%D8%A7%D8%A6%D9%84-%D9%85%D8%B2%D9%8A%D9%84-%D9%84%D9%84%D8%A8%D9%82%D8%B9-%D9%84%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D8%A7%D9%84%D9%85%D9%84%D9%88%D9%86%D8%A9-%D9%88%D8%A7%D9%84%D8%A8%D9%8A%D8%B6%D8%A7%D8%A1-%D9%85%D8%AA%D8%B9%D8%AF%D8%AF-%D8%A7%D9%84%D8%A3%D9%84%D9%88%D8%A7%D9%86.jpg.jpg",
    ],
    discount: 27,
    price: 68.95,
    description:
      "سائل فانش لإزالة البقع يعمل بفعالية على الملابس الملونة والبيضاء، يزيل البقع الصعبة بسهولة.",
  },

  {
    name: "Tide مسحوق غسيل تايد شبه الأوتوماتيكي الأصلي، 5+1 كجم",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000800/tide-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%AA%D8%A7%D9%8A%D8%AF-%D8%B4%D8%A8%D9%87-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A-51-%D9%83%D8%AC%D9%85.jpg.jpg",
    ],
    discount: 21,
    price: 72.95,
    description:
      "مسحوق غسيل تايد شبه أوتوماتيكي أصلي بوزن 5 كجم مع 1 كجم إضافي مجانًا، يقدم تنظيفًا قويًا يزيل أصعب البقع مع الحفاظ على الألوان الزاهية والأقمشة.",
  },

  {
    name: "برسيل منظف الغسيل السائل باور جل بتقنية التنظيف العميق بالزهرة البيضاء",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000802/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D8%A8%D8%A7%D9%84%D8%B2%D9%87%D8%B1%D8%A9-%D8%A7%D9%84%D8%A8%D9%8A%D8%B6%D8%A7%D8%A1.jpg.jpg",
    ],
    discount: 42,
    price: 78.6,
    description:
      "منظف برسيل السائل باور جل بتقنية التنظيف العميق برائحة الزهرة البيضاء، يوفر نظافة فائقة ويزيل البقع العنيدة بسهولة، مثالي لجميع أنواع الغسالات.",
  },

  {
    name: "كمفورت منعم أقمشة لملابس ناعمة للغاية 3.0لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000805/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D9%86%D8%A7%D8%B9%D9%85%D8%A9-%D9%84%D9%84%D8%BA%D8%A7%D9%8A%D8%A9-30%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 16,
    price: 36.35,
    description:
      "منعم الأقمشة كمفورت بسعة 3 لترات، يمنح الملابس نعومة فائقة ورائحة منعشة تدوم طويلاً، مثالي لجميع أنواع الأقمشة.",
  },

  {
    name: "بونكس Bonux Original 3 In 1 Detergent Powder, Regular Washing Machines, Blue, 5Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000808/%D8%A8%D9%88%D9%86%D9%83%D8%B3-bonux-original-3-in-1-detergent-powder-regular-washing-machines-blue-5kg.jpg.jpg",
    ],
    discount: 37,
    price: 52.5,
    description:
      "مسحوق غسيل بونكس الأصلي 3 في 1 بوزن 5 كجم، يجمع بين التنظيف القوي، إزالة البقع، والرائحة المنعشة، مثالي للغسالات العادية.",
  },
  {
    name: "Ariel مسحوق غسيل أرييل الأوتوماتيكي الأصلي، 7 كج + 1",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000809/ariel-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A3%D8%B1%D9%8A%D9%8A%D9%84-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D8%A7%D9%84%D8%A3%D8%B5%D9%84%D9%8A-7-%D9%83%D8%AC-1.jpg.jpg",
    ],
    discount: 5,
    price: 99.95,
    description:
      "مسحوق غسيل أرييل الأوتوماتيكي الأصلي بوزن 7 كجم مع 1 كجم إضافي مجانًا، يوفر تنظيفًا عميقًا وإزالة فعالة للبقع مع الحفاظ على الألوان.",
  },
  {
    name: "جينتو مسحوق غسيل برائحة العود أبيض 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000811/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-%D8%A3%D8%A8%D9%8A%D8%B6-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    discount: 40,
    price: 39.1,
    description:
      "مسحوق غسيل جينتو برائحة العود الفاخرة بوزن 2.25 كجم، يوفر تنظيفًا قويًا مع رائحة مميزة تدوم طويلاً، مثالي للملابس البيضاء.",
  },
  {
    name: "جينتو مسحوق مزيل للبقع مضاد للبكتيريا أبيض",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000812/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D9%85%D8%B2%D9%8A%D9%84-%D9%84%D9%84%D8%A8%D9%82%D8%B9-%D9%85%D8%B6%D8%A7%D8%AF-%D9%84%D9%84%D8%A8%D9%83%D8%AA%D9%8A%D8%B1%D9%8A%D8%A7-%D8%A3%D8%A8%D9%8A%D8%B6.jpg.jpg",
    ],
    discount: 20,
    price: 54.95,
    description:
      "مسحوق جينتو المضاد للبكتيريا ومزيل البقع للملابس البيضاء، يوفر حماية صحية وتنظيفًا عميقًا يزيل البقع العنيدة بفعالية.",
  },

  {
    name: "جينتو مسحوق غسيل برائحة الورد أبيض 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000817/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF-%D8%A3%D8%A8%D9%8A%D8%B6-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    discount: 40,
    price: 39.1,
    description:
      "مسحوق غسيل جينتو برائحة الورد المنعشة بوزن 2.25 كجم، مثالي للملابس البيضاء، يوفر تنظيفًا فعالًا مع رائحة زكية تدوم طويلاً.",
  },
  {
    name: "نولين منعم الأقمشة برائحة نسيم الحدائق 3لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000819/%D9%86%D9%88%D9%84%D9%8A%D9%86-%D9%85%D9%86%D8%B9%D9%85-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D9%86%D8%B3%D9%8A%D9%85-%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-3%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 12,
    price: 25.15,
    description:
      "منعم الأقمشة نولين برائحة نسيم الحدائق بسعة 3 لترات، يمنح الملابس نعومة فائقة ورائحة طبيعية منعشة تدوم طويلاً.",
  },

  {
    name: "برسيل منظف ​​الغسيل السائل باور جل بتقنية التنظيف العميق، أزرق، 4.8 لتر أزرق 4.8لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000821/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D8%A3%D8%B2%D8%B1%D9%82-48-%D9%84%D8%AA%D8%B1-%D8%A3%D8%B2%D8%B1%D9%82-48%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 42,
    price: 78.6,
    description:
      "منظف برسيل السائل باور جل الأزرق بسعة 4.8 لتر، بتقنية التنظيف العميق، يزيل البقع الصعبة ويمنح الملابس نظافة فائقة ورائحة منعشة.",
  },

  {
    name: "كمفورت منعم منسوجات مركز أسود 1400ملليلتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000827/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D9%85%D9%86%D8%B3%D9%88%D8%AC%D8%A7%D8%AA-%D9%85%D8%B1%D9%83%D8%B2-%D8%A3%D8%B3%D9%88%D8%AF-1400%D9%85%D9%84%D9%84%D9%8A%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 11,
    price: 42.95,
    description:
      "منعم الأقمشة كمفورت المركز الأسود بسعة 1400 مل، يمنح الملابس نعومة فائقة ورائحة غنية تدوم طويلاً، مثالي لجميع الأقمشة.",
  },

  {
    name: "برسيل منظف الغسيل السائل باور جل مع تقنية التنظيف العميق للغسالات ذات التحميل العلوي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000832/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%A7%D9%88%D8%B1-%D8%AC%D9%84-%D9%85%D8%B9-%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%B0%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AD%D9%85%D9%8A%D9%84-%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%8A.jpg.jpg",
    ],
    discount: 42,
    price: 78.6,
    description:
      "جل غسيل برسيل باور جل للغسالات ذات التحميل العلوي، بتقنية التنظيف العميق، يزيل البقع العنيدة ويحافظ على نظافة الملابس.",
  },
  {
    name: "كلوركس مبيض سائل لتنظيف وتعقيم المنزل برائحة البرتقال أبيض 3.78لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000833/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%A8%D9%8A%D8%B6-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D9%88%D8%AA%D8%B9%D9%82%D9%8A%D9%85-%D8%A7%D9%84%D9%85%D9%86%D8%B2%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%A8%D8%B1%D8%AA%D9%82%D8%A7%D9%84-%D8%A3%D8%A8%D9%8A%D8%B6-378%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 27,
    price: 24.6,
    description:
      "مبيض كلوركس السائل برائحة البرتقال بسعة 3.78 لتر، مثالي لتنظيف وتعقيم المنزل، يزيل البقع ويمنح الأسطح نظافة وإشراقة.",
  },
  {
    name: "جينتو Automatic Laundry Detergent Green Rose Scent 7 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000834/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-automatic-laundry-detergent-green-rose-scent-7-kg.jpg.jpg",
    ],
    discount: 16,
    price: 57.95,
    description:
      "مسحوق غسيل جينتو الأوتوماتيكي برائحة الورد الأخضر بوزن 7 كجم، يوفر تنظيفًا فعالًا ورائحة منعشة تدوم طويلاً.",
  },
  {
    name: "برسيل منظف ​​سائل أبيض، بتقنية التنظيف العميق للغسالات ذات التحميل العلوي، العود 3+1 لتر 4لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000835/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%B3%D8%A7%D8%A6%D9%84-%D8%A3%D8%A8%D9%8A%D8%B6-%D8%A8%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%A7%D9%84%D8%B9%D9%85%D9%8A%D9%82-%D9%84%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A7%D8%AA-%D8%B0%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AD%D9%85%D9%8A%D9%84-%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%8A-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-31-%D9%84%D8%AA%D8%B1-4%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 17,
    price: 63.85,
    description:
      "منظف برسيل السائل الأبيض برائحة العود بسعة 4 لترات (3+1)، بتقنية التنظيف العميق، مثالي للغسالات ذات التحميل العلوي.",
  },

  {
    name: "Tide منظف غسيل جيل تايد برائحة الزهور مع داوني، 1.8 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747000837/tide-%D9%85%D9%86%D8%B8%D9%81-%D8%BA%D8%B3%D9%8A%D9%84-%D8%AC%D9%8A%D9%84-%D8%AA%D8%A7%D9%8A%D8%AF-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%B2%D9%87%D9%88%D8%B1-%D9%85%D8%B9-%D8%AF%D8%A7%D9%88%D9%86%D9%8A-18-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 28,
    price: 34.95,
    description:
      "جل غسيل تايد برائحة الزهور مع لمسة داوني بسعة 1.8 لتر، يوفر تنظيفًا عميقًا ورائحة منعشة تدوم طويلاً.",
  },
  {
    price: 27.95,
    name: "بونكس Bonux Soap Auto Original , 2.5Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001250/%D8%A8%D9%88%D9%86%D9%83%D8%B3-bonux-soap-auto-original-25kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل بونكس الأوتوماتيكي الأصلي بوزن 2.5 كجم، يقدم تنظيفًا فعالًا مع رائحة منعشة، مثالي للغسالات الأوتوماتيكية.",
  },
  {
    price: 10.95,
    name: "REX معطر ملابس ركس زهري، 2 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001251/rex-%D9%85%D8%B9%D8%B7%D8%B1-%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D8%B1%D9%83%D8%B3-%D8%B2%D9%87%D8%B1%D9%8A-2-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    description:
      "معطر ملابس ركس برائحة زهرية بسعة 2 لتر، يمنح الملابس رائحة منعشة ويدوم طويلاً، مثالي لجميع أنواع الأقمشة.",
  },
  {
    name: "ركس Rex Laundry Powder Detergent, 7.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001252/%D8%B1%D9%83%D8%B3-rex-laundry-powder-detergent-75-kg.jpg.jpg",
    ],
    discount: 35,
    price: 59.95,
    description:
      "مسحوق غسيل ركس بوزن 7.5 كجم، يوفر تنظيفًا قويًا وإزالة فعالة للبقع، مثالي للغسالات الأوتوماتيكية والنصف أوتوماتيكية.",
  },
  {
    price: 23.2,
    name: "جينتو مسحوق غسيل مركز برائحة الورد أبيض 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001253/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D9%85%D8%B1%D9%83%D8%B2-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF-%D8%A3%D8%A8%D9%8A%D8%B6-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    description:
      "مسحوق غسيل جينتو المركز برائحة الورد بوزن 2.25 كجم، مثالي للملابس البيضاء، يوفر تنظيفًا قويًا ورائحة منعشة.",
  },
  {
    price: 97.5,
    name: "Tide مسحوق منظف تيد المضاد للبكتيريا ، تلقائي ، 6.25 كجم +1",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001254/tide-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D9%85%D9%86%D8%B8%D9%81-%D8%AA%D9%8A%D8%AF-%D8%A7%D9%84%D9%85%D8%B6%D8%A7%D8%AF-%D9%84%D9%84%D8%A8%D9%83%D8%AA%D9%8A%D8%B1%D9%8A%D8%A7-%D8%AA%D9%84%D9%82%D8%A7%D8%A6%D9%8A-625-%D9%83%D8%AC%D9%85-1.jpg.jpg",
    ],
    description:
      "مسحوق غسيل تايد المضاد للبكتيريا بوزن 6.25 كجم مع 1 كجم إضافي، يوفر تنظيفًا عميقًا وحماية صحية للملابس.",
  },
  {
    name: "Fighter FLASH Flash Degreaser Tropicana Scent, 750ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001255/fighter-flash-flash-degreaser-tropicana-scent-750ml.jpg.jpg",
    ],
    price: 15,
    description:
      "مزيل الدهون فايتر فلاش برائحة تروبيكانا بسعة 750 مل، يزيل الدهون والأوساخ بفعالية من الأسطح مع رائحة منعشة.",
  },
  {
    name: "فنيش Quantum Lemon Dishwasher Detergent Tablets, 50 Tablets",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001256/%D9%81%D9%86%D9%8A%D8%B4-quantum-lemon-dishwasher-detergent-tablets-50-tablets.jpg.jpg",
    ],
    discount: 45,
    price: 109.95,
    description:
      "أقراص غسالة الأطباق فنيش كوانتوم برائحة الليمون، 50 قرصًا، توفر تنظيفًا قويًا ولمعانًا مثاليًا للأطباق.",
  },
  {
    name: "برسيل شامبو العباية منظف سائل بتركيبة ثلاثية الأبعاد فريدة لتجديد اللون الأسود ونظافة العباية وعطر العود الذي يدوم طويلاً",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001257/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%D8%A9-%D8%AB%D9%84%D8%A7%D8%AB%D9%8A%D8%A9-%D8%A7%D9%84%D8%A3%D8%A8%D8%B9%D8%A7%D8%AF-%D9%81%D8%B1%D9%8A%D8%AF%D8%A9-%D9%84%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF-%D8%A7%D9%84%D9%84%D9%88%D9%86-%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%AF-%D9%88%D9%86%D8%B8%D8%A7%D9%81%D8%A9-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%88%D8%B9%D8%B7%D8%B1-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-%D8%A7%D9%84%D8%B0%D9%8A-%D9%8A%D8%AF%D9%88%D9%85-%D8%B7%D9%88%D9%8A%D9%84%D8%A7.jpg.jpg",
    ],
    discount: 22,
    price: 64.65,
    description:
      "شامبو العباية برسيل بتركيبة ثلاثية الأبعاد، يجدد اللون الأسود، ينظف العباية بعمق، ويمنحها عطر العود الدائم.",
  },
  {
    price: 23.2,
    name: "جينتو مسحوق مركز أصلي أبيض 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001258/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D9%85%D8%B1%D9%83%D8%B2-%D8%A3%D8%B5%D9%84%D9%8A-%D8%A3%D8%A8%D9%8A%D8%B6-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    description:
      "مسحوق غسيل جينتو المركز الأصلي بوزن 2.25 كجم، مثالي للملابس البيضاء، يوفر تنظيفًا قويًا وإشراقة مميزة.",
  },
  {
    name: "فنيش Powerball Quantum Lemon Sparkle ,Dishwasher Detergent Powder, 40 Tablets",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001259/%D9%81%D9%86%D9%8A%D8%B4-powerball-quantum-lemon-sparkle-dishwasher-detergent-powder-40-tablets.jpg.jpg",
    ],
    discount: 39,
    price: 76.05,
    description:
      "أقراص غسالة الأطباق فنيش باوربول كوانتوم برائحة الليمون، 40 قرصًا، توفر تنظيفًا عميقًا ولمعانًا مثاليًا.",
  },
  {
    price: 37.95,
    name: "Comfort Comfort Concentrated Fabric Softener, Blue Love Scent, 1.5 L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001260/comfort-comfort-concentrated-fabric-softener-blue-love-scent-15-l.jpg.jpg",
    ],
    description:
      "منعم الأقمشة كمفورت المركز برائحة الحب الأزرق بسعة 1.5 لتر، يمنح الملابس نعومة فائقة ورائحة منعشة تدوم طويلاً.",
  },
  {
    name: "Downy منعم الأقمشة المركّز داوني ، ندى الوادي ، 1 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001261/downy-%D9%85%D9%86%D8%B9%D9%85-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D8%A7%D9%84%D9%85%D8%B1%D9%83%D8%B2-%D8%AF%D8%A7%D9%88%D9%86%D9%8A-%D9%86%D8%AF%D9%89-%D8%A7%D9%84%D9%88%D8%A7%D8%AF%D9%8A-1-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 26,
    price: 25.9,
    description:
      "منعم الأقمشة داوني المركز برائحة ندى الوادي بسعة 1 لتر، يوفر نعومة استثنائية ورائحة منعشة للملابس.",
  },
  {
    price: 37.95,
    name: "كمفورت Concentrated Fabric Softener Iris And Jasmine 1.5 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001262/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-concentrated-fabric-softener-iris-and-jasmine-15-liter.jpg.jpg",
    ],
    description:
      "منعم الأقمشة كمفورت المركز برائحة السوسن والياسمين بسعة 1.5 لتر، يمنح الملابس نعومة ورائحة زهرية تدوم طويلاً.",
  },
  {
    price: 41.95,
    name: "اريال Automatic Laundry Powder Detergent with Downy 2.25 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001263/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-automatic-laundry-powder-detergent-with-downy-225-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أرييل الأوتوماتيكي مع لمسة داوني بوزن 2.25 كجم، يوفر تنظيفًا عميقًا ورائحة منعشة تدوم طويلاً.",
  },
  {
    price: 23.95,
    name: "أمينو Omino Abaya Shampoo, Black, 2700ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001264/%D8%A3%D9%85%D9%8A%D9%86%D9%88-omino-abaya-shampoo-black-2700ml.jpg.jpg",
    ],
    description:
      "شامبو العباية أمينو للعبايات السوداء بسعة 2700 مل، ينظف بعمق ويحافظ على اللون الأسود الزاهي مع رائحة منعشة.",
  },
  {
    price: 67.95,
    name: "Tide تايد نصف أوتوماتيكي بلمسة من داوني مسحوق المنظف ، 4.5 + 1 كجم",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001265/tide-%D8%AA%D8%A7%D9%8A%D8%AF-%D9%86%D8%B5%D9%81-%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D8%A8%D9%84%D9%85%D8%B3%D8%A9-%D9%85%D9%86-%D8%AF%D8%A7%D9%88%D9%86%D9%8A-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%A7%D9%84%D9%85%D9%86%D8%B8%D9%81-45-1-%D9%83%D8%AC%D9%85.jpg.jpg",
    ],
    description:
      "مسحوق غسيل تايد نصف أوتوماتيكي بوزن 4.5 كجم مع 1 كجم إضافي، مع لمسة داوني، يوفر تنظيفًا قويًا ورائحة منعشة.",
  },
  {
    price: 41.95,
    name: "اريال Ariel Concentrated Laundry Powder Detergent, Manual Wash, 2.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001266/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-ariel-concentrated-laundry-powder-detergent-manual-wash-25-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أرييل المركز للغسيل اليدوي بوزن 2.5 كجم، يوفر تنظيفًا عميقًا وإزالة فعالة للبقع مع الحفاظ على الأقمشة.",
  },
  {
    price: 69.95,
    name: "فنيش جل مركز ليمون سباركل الكل في واحد ماكس لغسالة الأطباق",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001267/%D9%81%D9%86%D9%8A%D8%B4-%D8%AC%D9%84-%D9%85%D8%B1%D9%83%D8%B2-%D9%84%D9%8A%D9%85%D9%88%D9%86-%D8%B3%D8%A8%D8%A7%D8%B1%D9%83%D9%84-%D8%A7%D9%84%D9%83%D9%84-%D9%81%D9%8A-%D9%88%D8%A7%D8%AD%D8%AF-%D9%85%D8%A7%D9%83%D8%B3-%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D8%A3%D8%B7%D8%A8%D8%A7%D9%82.jpg.jpg",
    ],
    description:
      "جل فنيش المركز الكل في واحد برائحة ليمون سباركل، يوفر تنظيفًا قويًا ولمعانًا مثاليًا لغسالات الأطباق.",
  },
  {
    name: "برسيل شامبو العباية منظف سائل بتركيبة ثلاثية الأبعاد فريدة لتجديد اللون الأسود لنظافة العباية ورائحة كلاسيكية تدوم طويلاً",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001269/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%D8%A9-%D8%AB%D9%84%D8%A7%D8%AB%D9%8A%D8%A9-%D8%A7%D9%84%D8%A3%D8%A8%D8%B9%D8%A7%D8%AF-%D9%81%D8%B1%D9%8A%D8%AF%D8%A9-%D9%84%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF-%D8%A7%D9%84%D9%84%D9%88%D9%86-%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%AF-%D9%84%D9%86%D8%B8%D8%A7%D9%81%D8%A9-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%88%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D9%83%D9%84%D8%A7%D8%B3%D9%8A%D9%83%D9%8A%D8%A9-%D8%AA%D8%AF%D9%88%D9%85-%D8%B7%D9%88%D9%8A%D9%84%D8%A7.jpg.jpg",
    ],
    discount: 22,
    price: 64.65,
    description:
      "شامبو العباية برسيل بتركيبة ثلاثية الأبعاد، يجدد اللون الأسود وينظف العباية مع رائحة كلاسيكية تدوم طويلاً.",
  },
  {
    price: 18.95,
    name: "ركس Rex Powder Detergent 3 in 1, 2.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001270/%D8%B1%D9%83%D8%B3-rex-powder-detergent-3-in-1-25-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل ركس 3 في 1 بوزن 2.5 كجم، يجمع بين التنظيف القوي، إزالة البقع، والرائحة المنعشة، مثالي للغسيل.",
  },
  {
    price: 44.95,
    name: "برسيل Power Gel Liquid Detergent White Flowers, 2.9 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001271/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-power-gel-liquid-detergent-white-flowers-29-liter.jpg.jpg",
    ],
    description:
      "جل غسيل برسيل باور جل برائحة الزهور البيضاء بسعة 2.9 لتر، يوفر تنظيفًا عميقًا ورائحة منعشة تدوم طويلاً.",
  },
  {
    name: "Puriella Abaya Shampoo , 2.5 L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001272/puriella-abaya-shampoo-25-l.jpg.jpg",
    ],
    discount: 26,
    price: 26.5,
    description:
      "شامبو العباية بوريلا بسعة 2.5 لتر، ينظف العبايات بعمق ويحافظ على ألوانها الزاهية مع رائحة منعشة.",
  },
  {
    price: 8.5,
    name: "REX Rex Original Dishwashing Liquid, 1 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001274/rex-rex-original-dishwashing-liquid-1-liter.jpg.jpg",
    ],
    description:
      "سائل غسيل الأطباق ركس الأصلي بسعة 1 لتر، يزيل الدهون بفعالية ويترك الأطباق نظيفة ولامعة مع رائحة منعشة.",
  },
  {
    price: 48.4,
    name: "جينتو Washing Powder Original Scent Blue 7 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001275/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-washing-powder-original-scent-blue-7-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل جينتو الأصلي الأزرق بوزن 7 كجم، يوفر تنظيفًا قويًا ورائحة منعشة، مثالي للغسالات الأوتوماتيكية.",
  },
  {
    name: "كلوركس مزيل بقع ومثبت ألوان للملابس أرجواني 3لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001276/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%B2%D9%8A%D9%84-%D8%A8%D9%82%D8%B9-%D9%88%D9%85%D8%AB%D8%A8%D8%AA-%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D9%84%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D8%A3%D8%B1%D8%AC%D9%88%D8%A7%D9%86%D9%8A-3%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 32,
    price: 52.2,
    description:
      "منتج كلوركس بتركيبة فعّالة لإزالة البقع الصعبة وتثبيت ألوان الملابس، يمنح ملابسك نضارة تدوم طويلاً برائحة منعشة، مثالي للغسيل اليومي بسعة 3 لترات.",
  },
  {
    name: "أومو مسحوق غسيل باللون الأخضر 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001276/%D8%A3%D9%88%D9%85%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A8%D8%A7%D9%84%D9%84%D9%88%D9%86-%D8%A7%D9%84%D8%A3%D8%AE%D8%B6%D8%B1-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أومو الأخضر بقوة تنظيف فائقة، يزيل البقع العنيدة ويحافظ على نظافة الملابس مع رائحة منعشة، مثالي للغسالات العادية والأوتوماتيكية بسعة 2.25 كجم.",
  },
  {
    price: 30.5,
    name: "نولين منعم الأقمشة وردي 3لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001277/%D9%86%D9%88%D9%84%D9%8A%D9%86-%D9%85%D9%86%D8%B9%D9%85-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D9%88%D8%B1%D8%AF%D9%8A-3%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    description:
      "نولين منعم الأقمشة برائحة الورد المنعشة، يمنح ملابسك نعومة فائقة وحماية للألياف مع رائحة تدوم طويلاً، بسعة 3 لترات لاستخدام طويل الأمد.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Mountain Breeze, 25 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001279/klina-premium-automatic-washing-powder-mountain-breeze-25-kg.jpg.jpg",
    ],
    discount: 19,
    price: 141.95,
    description:
      "مسحوق غسيل كلينا بريميوم برائحة نسيم الجبل، مصمم للغسالات الأوتوماتيكية، يوفر تنظيفاً عميقاً وإزالة فعالة للبقع بسعة كبيرة 25 كجم.",
  },
  {
    price: 74.5,
    name: "Ariel Ariel Semi Automatic With Touch of Downy Powder Detergent , 4.5 + 1kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001281/ariel-ariel-semi-automatic-with-touch-of-downy-powder-detergent-45-1kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أريال نصف أوتوماتيكي مع لمسة من داوني، يقدم تنظيفاً قوياً مع نعومة فائقة ورائحة منعشة، بسعة 4.5 كجم مع 1 كجم إضافي.",
  },
  {
    name: "كمفورت مُنعّم الأقمشة فلورا وردي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001281/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D9%85%D9%86%D8%B9%D9%85-%D8%A7%D9%84%D8%A3%D9%82%D9%85%D8%B4%D8%A9-%D9%81%D9%84%D9%88%D8%B1%D8%A7-%D9%88%D8%B1%D8%AF%D9%8A.jpg.jpg",
    ],
    discount: 10,
    price: 24.65,
    description:
      "كمفورت فلورا منعم الأقمشة برائحة زهرية منعشة، يمنح الملابس نعومة استثنائية ورائحة تدوم طويلاً، مثالي لجميع أنواع الأقمشة.",
  },
  {
    name: "ركس Liquid Bleach Lemon Scented, 3.78 Liter + Gift",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001282/%D8%B1%D9%83%D8%B3-liquid-bleach-lemon-scented-378-liter-gift.jpg.jpg",
    ],
    discount: 44,
    price: 17.95,
    description:
      "مبيض ركس السائل برائحة الليمون المنعشة، يوفر تنظيفاً عميقاً وتعقيماً للملابس والأسطح، بسعة 3.78 لتر مع هدية إضافية.",
  },
  {
    price: 94.95,
    name: "Ariel مسحوق غسيل أريال الأوتوماتيكي المضاد للبكتيريا، 6.25 +1 كجم",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001284/ariel-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A3%D8%B1%D9%8A%D8%A7%D9%84-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D8%A7%D9%84%D9%85%D8%B6%D8%A7%D8%AF-%D9%84%D9%84%D8%A8%D9%83%D8%AA%D9%8A%D8%B1%D9%8A%D8%A7-625-1-%D9%83%D8%AC%D9%85.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أريال الأوتوماتيكي المضاد للبكتيريا، يزيل البقع ويقتل الجراثيم مع تنظيف عميق، بسعة 6.25 كجم مع 1 كجم إضافي.",
  },
  {
    name: "كلوركس مزيل بقع الملابس لبياض أنصع 1.8لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001286/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%B2%D9%8A%D9%84-%D8%A8%D9%82%D8%B9-%D8%A7%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D9%84%D8%A8%D9%8A%D8%A7%D8%B6-%D8%A3%D9%86%D8%B5%D8%B9-18%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 9,
    price: 35.25,
    description:
      "كلوركس مزيل البقع للملابس البيضاء، يمنح بياضاً ناصعاً ويزيل البقع الصعبة بفعالية، بسعة 1.8 لتر لتنظيف مثالي.",
  },
  {
    price: 37.95,
    name: "كمفورت Comfort Lavender & Magnolia Concentrated Fabric Conditioner, 1.5 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001292/%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-comfort-lavender-magnolia-concentrated-fabric-conditioner-15-liter.jpg.jpg",
    ],
    description:
      "كمفورت منعم الأقمشة المركز برائحة اللافندر والماغنوليا، يوفر نعومة فائقة ورائحة زهرية تدوم طويلاً، بسعة 1.5 لتر.",
  },
  {
    name: "Persil Persil Anaqa Abaya Liquid Washing Detergent, 3 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001293/persil-persil-anaqa-abaya-liquid-washing-detergent-3-liter.jpg.jpg",
    ],
    discount: 16,
    price: 59.95,
    description:
      "برسيل أناقة سائل غسيل العبايات، يحافظ على لون العباية السوداء ويمنحها نظافة عميقة مع رائحة تدوم، بسعة 3 لترات.",
  },
  {
    name: "أومو سائل غسيل الملابس مع لمسة من كمفورت شفاف 2لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001294/%D8%A3%D9%88%D9%85%D9%88-%D8%B3%D8%A7%D8%A6%D9%84-%D8%BA%D8%B3%D9%8A%D9%84-%D8%A7%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D9%85%D8%B9-%D9%84%D9%85%D8%B3%D8%A9-%D9%85%D9%86-%D9%83%D9%85%D9%81%D9%88%D8%B1%D8%AA-%D8%B4%D9%81%D8%A7%D9%81-2%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 6,
    price: 33.05,
    description:
      "سائل غسيل أومو مع لمسة كمفورت، يزيل البقع بفعالية ويمنح الملابس نعومة ورائحة منعشة، بسعة 2 لتر للغسيل اليومي.",
  },
  {
    name: "اريال Ariel Detergent Lavender Freshness , Automatic , 2.25 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001295/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-ariel-detergent-lavender-freshness-automatic-225-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أريال الأوتوماتيكي برائحة اللافندر المنعشة، يوفر تنظيفاً عميقاً ويزيل البقع بسهولة، بسعة 2.25 كجم.",
  },
  {
    price: 41.95,
    name: "Ariel Ariel Downy Blue Detergent Powder, 6.25+1 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001296/ariel-ariel-downy-blue-detergent-powder-6251-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أريال داوني الأزرق، يجمع بين قوة التنظيف ونعومة داوني مع رائحة منعشة، بسعة 6.25 كجم مع 1 كجم إضافي.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Spring Breeze, 3kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001297/klina-premium-automatic-washing-powder spring-breeze-3kg.jpg.jpg",
    ],
    discount: 9,
    price: 19.9,
    description:
      "مسحوق غسيل كلينا بريميوم برائحة نسيم الربيع، مثالي للغسالات الأوتوماتيكية، يزيل البقع ويمنح نضارة، بسعة 3 كجم.",
  },
  {
    price: 42.95,
    name: "أومو Active Detergent with Comfort Laundry 4.5kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001298/%D8%A3%D9%88%D9%85%D9%88-active-detergent-with-comfort-laundry-45kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أومو أكتيف مع كمفورت، يوفر تنظيفاً قوياً ونعومة فائقة مع رائحة منعشة، بسعة 4.5 كجم للغسيل اليومي.",
  },
  {
    price: 10.95,
    name: "ركس Rex Fabric Softener & Freshener, Blue, 2 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001300/%D8%B1%D9%83%D8%B3-rex-fabric-softener-freshener-blue-2-liter.jpg.jpg",
    ],
    description:
      "ركس منعم ومعطر الأقمشة الأزرق، يمنح الملابس نعومة استثنائية ورائحة منعشة تدوم طويلاً، بسعة 2 لتر.",
  },
  {
    name: "نولين Nolin Fabric Softener Nobility of the Past, 3 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001302/%D9%86%D9%88%D9%84%D9%8A%D9%86-nolin-fabric-softener-nobility-of-the-past-3-liter.jpg.jpg",
    ],
    discount: 11,
    price: 24.9,
    description:
      "نولين منعم الأقمشة برائحة أناقة الماضي، يوفر نعومة فائقة ورائحة كلاسيكية تدوم، بسعة 3 لترات لاستخدام طويل.",
  },
  {
    price: 8.5,
    name: "ركس Rex Abaya and Delicates Shampoo Detergent, 1 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001303/%D8%B1%D9%83%D8%B3-rex-abaya-and-delicates-shampoo-detergent-1-liter.jpg.jpg",
    ],
    description:
      "شامبو ركس للعبايات والأقمشة الرقيقة، ينظف بلطف ويحافظ على الألوان والأنسجة مع رائحة منعشة، بسعة 1 لتر.",
  },
  {
    name: "برسيل منظف ​​سائل شامبو العباية لحماية اللون الأسود وعطر يدوم طويلاً أسود 1 لتر أسود 1لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001304/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%B3%D8%A7%D8%A6%D9%84-%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%84%D8%AD%D9%85%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D9%84%D9%88%D9%86-%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%AF-%D9%88%D8%B9%D8%B7%D8%B1-%D9%8A%D8%AF%D9%88%D9%85-%D8%B7%D9%88%D9%8A%D9%84%D8%A7-%D8%A3%D8%B3%D9%88%D8%AF-1-%D9%84%D8%AA%D8%B1-%D8%A3%D8%B3%D9%88%D8%AF-1%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    price: 26.7,
    description:
      "شامبو برسيل للعبايات، يحمي اللون الأسود ويمنح نظافة عميقة مع عطر يدوم طويلاً، بسعة 1 لتر لعناية مثالية.",
  },
  {
    price: 23.95,
    name: "أمينو Omino Abaya Shampoo, Pink, 2700ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001305/%D8%A3%D9%85%D9%8A%D9%86%D9%88-omino-abaya-shampoo-pink-2700ml.jpg.jpg",
    ],
    description:
      "شامبو أمينو للعبايات برائحة وردية منعشة، ينظف بلطف ويحافظ على أناقة العبايات مع حماية الألوان، بسعة 2700 مل.",
  },
  {
    name: "فانش مسحوق أوكسي أكشن لإزالة البقع أبيض كريستالي 450 جرام لون أبيض 450جرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001306/%D9%81%D8%A7%D9%86%D8%B4-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%A3%D9%88%D9%83%D8%B3%D9%8A-%D8%A3%D9%83%D8%B4%D9%86-%D9%84%D8%A5%D8%B2%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D8%A8%D9%82%D8%B9-%D8%A3%D8%A8%D9%8A%D8%B6-%D9%83%D8%B1%D9%8A%D8%B3%D8%AA%D8%A7%D9%84%D9%8A-450-%D8%AC%D8%B1%D8%A7%D9%85-%D9%84%D9%88%D9%86-%D8%A3%D8%A8%D9%8A%D8%B6-450%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    discount: 22,
    price: 51.6,
    description:
      "مسحوق فانش أوكسي أكشن لإزالة البقع، يمنح بياضاً كريستالياً ويزيل البقع الصعبة بفعالية، بسعة 450 جرام للملابس البيضاء.",
  },
  {
    price: 54.95,
    name: "Al Emlaq Alemlaq Detergent Powder Lavender, 5K",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001307/al-emlaq-alemlaq-detergent-powder-lavender-5k.jpg.jpg",
    ],
    description:
      "مسحوق غسيل العملاق برائحة اللافندر، يوفر تنظيفاً قوياً ويزيل البقع مع رائحة منعشة، بسعة 5 كجم للغسيل اليومي.",
  },
  {
    name: "كلوركس مزيل بقع ومثبت ألوان للملابس 3لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001308/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%B2%D9%8A%D9%84-%D8%A8%D9%82%D8%B9-%D9%88%D9%85%D8%AB%D8%A8%D8%AA-%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D9%84%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-3%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 32,
    price: 52.2,
    description:
      "كلوركس مزيل بقع ومثبت ألوان، يزيل البقع الصعبة ويحافظ على ألوان الملابس الزاهية مع رائحة منعشة، بسعة 3 لترات.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Spring Breeze, 25 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001310/klina-premium-automatic-washing-powder spring-breeze-25-kg.jpg.jpg",
    ],
    discount: 19,
    price: 141.95,
    description:
      "مسحوق غسيل كلينا بريميوم برائحة نسيم الربيع، مصمم للغسالات الأوتوماتيكية، يوفر تنظيفاً عميقاً بسعة كبيرة 25 كجم.",
  },
  {
    price: 41.95,
    name: "اريال Ariel Concentrated Laundry Powder Detergent with the Essence of Downy Freshness, Manual Wash, 2.25 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001312/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-ariel-concentrated-laundry-powder-detergent-with-the-essence-of-downy-freshness-manual-wash-225-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أريال المركز للغسيل اليدوي مع رائحة داوني المنعشة، يزيل البقع ويمنح نعومة فائقة، بسعة 2.25 كجم.",
  },
  {
    price: 55.95,
    name: "أومو Active Blue Soap for Regular Washing Machines, 6 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001428/%D8%A3%D9%88%D9%85%D9%88-active-blue-soap-for-regular-washing-machines-6-kg.jpg.jpg",
    ],
    description:
      "صابون أومو أكتيف الأزرق للغسالات العادية، يوفر تنظيفاً قوياً ويزيل البقع مع رائحة منعشة، بسعة 6 كجم.",
  },
  {
    price: 67.95,
    name: "Tide مسحوق تنظيف تيد الأوتوماتيكي المضاد للبكتيريا، 4.5 +1 كغ",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001429/tide-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D8%AA%D9%8A%D8%AF-%D8%A7%D9%84%D8%A3%D9%88%D8%AA%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D9%83%D9%8A-%D8%A7%D9%84%D9%85%D8%B6%D8%A7%D8%AF-%D9%84%D9%84%D8%A8%D9%83%D8%AA%D9%8A%D8%B1%D9%8A%D8%A7-45-1-%D9%83%D8%BA.jpg.jpg",
    ],
    description:
      "مسحوق تيد الأوتوماتيكي المضاد للبكتيريا، يقتل الجراثيم ويزيل البقع بفعالية مع تنظيف عميق، بسعة 4.5 كجم مع 1 كجم إضافي.",
  },
  {
    name: "تايد Tide Automatic Laundry Powder Detergent Original Scent, 1.5 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001430/%D8%AA%D8%A7%D9%8A%D8%AF-tide-automatic-laundry-powder-detergent-original-scent-15-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل تيد الأوتوماتيكي برائحة أصلية، يوفر تنظيفاً قوياً ويزيل البقع الصعبة، بسعة 1.5 كجم للغسالات الأوتوماتيكية.",
  },
  {
    name: "جينتو مسحوق مركز برائحة العود أبيض 2.25كيلوجرام",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001431/%D8%AC%D9%8A%D9%86%D8%AA%D9%88-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D9%85%D8%B1%D8%B3%D8%A8%D8%B1-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-%D8%A3%D8%A8%D9%8A%D8%B6-225%D9%83%D9%8A%D9%84%D9%88%D8%AC%D8%B1%D8%A7%D9%85.jpg.jpg",
    ],
    discount: 36,
    price: 36.35,
    description:
      "مسحوق جينتو المركز برائحة العود الفاخرة، يمنح تنظيفاً عميقاً ورائحة شرقية تدوم، بسعة 2.25 كجم للغسيل اليومي.",
  },
  {
    name: "اريال Ariel Lavender Detergent Powder Automatic Laundry, 6.25kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001432/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-ariel-lavender-detergent-powder-automatic-laundry-625kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل أريال الأوتوماتيكي برائحة اللافندر، يزيل البقع بفعالية ويمنح الملابس نضارة طويلة الأمد، بسعة 6.25 كجم.",
  },
  {
    name: "ركس Rex Washing Powder Detergent, 4 Kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001433/%D8%B1%D9%83%D8%B3-rex-washing-powder-detergent-4-kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل ركس، يوفر تنظيفاً قوياً ويزيل البقع الصعبة مع رائحة منعشة، بسعة 4 كجم للغسيل اليومي.",
  },
  {
    name: "كلوركس مبيض سائل لتنظيف وتعقيم المنزل برائحة الزهور 3.78لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001433/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%A8%D9%8A%D8%B6-%D8%B3%D8%A7%D8%A6%D9%84-%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D9%88%D8%AA%D8%B9%D9%82%D9%8A%D9%85-%D8%A7%D9%84%D9%85%D9%86%D8%B2%D9%84-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%B2%D9%87%D9%88%D8%B1-378%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 25,
    price: 24.6,
    description:
      "مبيض كلوركس السائل برائحة الزهور، ينظف ويعقم المنزل والملابس بفعالية، بسعة 3.78 لتر لاستخدام متعدد الأغراض.",
  },
  {
    price: 29.95,
    name: "تايد Tide Automatic Concentrated Laundry Powder Detergent, Original Scent, 1.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001434/%D8%AA%D8%A7%D9%8A%D8%AF-tide-automatic-concentrated-laundry-powder-detergent-original-scent-25-kg.jpg.jpg",
    ],
    description:
      "مسحوق تيد المركز الأوتوماتيكي برائحة أصلية، يوفر تنظيفاً قوياً ويزيل البقع بسهولة، بسعة 1.5 كجم للغسالات الأوتوماتيكية.",
  },
  {
    name: "فنيش غسالة أطباق كوانتوم ألتيميت 32 قرص ليمون",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001435/%D9%81%D9%86%D9%8A%D8%B4-%D8%BA%D8%B3%D8%A7%D9%84%D8%A9-%D8%A3%D8%B7%D8%A8%D8%A7%D9%82-%D9%83%D9%88%D8%A7%D9%86%D8%AA%D9%88%D9%85-%D8%A3%D9%84%D8%AA%D9%8A%D9%85%D9%8A%D8%AA-32-%D9%82%D8%B1%D8%B5-%D9%84%D9%8A%D9%85%D9%88%D9%86.jpg.jpg",
    ],
    discount: 61,
    price: 118.75,
    description:
      "أقراص فنيش كوانتوم ألتيميت لغسالة الأطباق برائحة الليمون، توفر تنظيفاً قوياً وإزالة الدهون بفعالية، تحتوي على 32 قرص.",
  },
  {
    name: "كلوركس مزيل للبقع ومعزز للألوان برائحة الزهور أرجواني 1.8لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001436/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%B2%D9%8A%D9%84-%D9%84%D9%84%D8%A8%D9%82%D8%B9-%D9%88%D9%85%D8%B9%D8%B2%D8%B2-%D9%84%D9%84%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D8%A8%D8%B1%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%B2%D9%87%D9%88%D8%B1-%D8%A3%D8%B1%D8%AC%D9%88%D8%A7%D9%86%D9%8A-18%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 6,
    price: 35.25,
    description:
      "كلوركس مزيل البقع ومعزز الألوان برائحة الزهور، يحافظ على ألوان الملابس ويزيل البقع بفعالية، بسعة 1.8 لتر.",
  },
  {
    price: 31.95,
    name: "برسيل Persil Green Concentrated Washing Powder, 2.25kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001437/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-persil-green-concentrated-washing-powder-225kg.jpg.jpg",
    ],
    description:
      "مسحوق برسيل الأخضر المركز، يوفر تنظيفاً قوياً ويزيل البقع الصعبة مع رائحة منعشة، بسعة 2.25 كجم للغسيل اليومي.",
  },
  {
    price: 59.95,
    name: "فنيش Ultimate Lemon Dishwasher Detergent Tablets, 48 Tablets",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001438/%D9%81%D9%86%D9%8A%D8%B4-ultimate-lemon-dishwasher-detergent-tablets-48-tablets.jpg.jpg",
    ],
    description:
      "أقراص فنيش ألتيميت لغسالة الأطباق برائحة الليمون، توفر تنظيفاً عميقاً وإزالة الدهون، تحتوي على 48 قرص لاستخدام طويل.",
  },
  {
    name: "كلوركس مزيل بقع الملابس 900ملليلتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001440/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%B2%D9%8A%D9%84-%D8%A8%D9%82%D8%B9-%D8%A7%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-900%D9%85%D9%84%D9%84%D9%8A%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    discount: 8,
    price: 19.7,
    description:
      "كلوركس مزيل بقع الملابس، يزيل البقع الصعبة بفعالية ويمنح الملابس نضارة، بسعة 900 مل للاستخدام اليومي.",
  },
  {
    price: 16.95,
    name: "بريل Max Power Apple Dishwashing Liquid, 1 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001441/%D8%A8%D8%B1%D9%8A%D9%84-max-power-apple-dishwashing-liquid-1-liter.jpg.jpg",
    ],
    description:
      "سائل غسيل الأطباق بريل ماكس باور برائحة التفاح، يزيل الدهون بسهولة ويمنح الأطباق لمعاناً، بسعة 1 لتر.",
  },
  {
    name: "فنيش سائل مساعد الشطف لغسالة الأطباق بالليمون",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001442/%D9%81%D9%86%D9%8A%D8%B4-%D8%B3%D8%A7%D8%A6%D9%84-%D9%85%D8%B3%D8%A7%D8%B9%D8%AF-%D8%A7%D9%84%D8%B4%D8%B7%D9%81-%D9%84%D8%BA%D8%B3%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D8%A3%D8%B7%D8%A8%D8%A7%D9%82-%D8%A8%D8%A7%D9%84%D9%84%D9%8A%D9%85%D9%88%D9%86.jpg.jpg",
    ],
    discount: 15,
    price: 62.95,
    description:
      "سائل فنيش مساعد الشطف برائحة الليمون، يعزز لمعان الأطباق ويمنع البقع المائية في غسالة الأطباق، مثالي لنتائج مثالية.",
  },
  {
    price: 30.95,
    name: "أومو سائل أومو للغسيل، أكتيف، يصل إلى ١٠٠٪ فعالية في إزالة البقع في غسلة واحدة*، ٢ لتر، قد يختلف التغليف 2لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001443/%D8%A3%D9%88%D9%85%D9%88-%D8%B3%D8%A7%D8%A6%D9%84-%D8%A3%D9%88%D9%85%D9%88-%D9%84%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D8%A3%D9%83%D8%AA%D9%8A%D9%81-%D9%8A%D8%B5%D9%84-%D8%A5%D9%84%D9%89-%D9%A1%D9%A0%D9%A0-%D9%81%D8%B9%D8%A7%D9%84%D9%8A%D8%A9-%D9%81%D9%8A-%D8%A5%D8%B2%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D8%A8%D9%82%D8%B9-%D9%81%D9%8A-%D8%BA%D8%B3%D9%84%D8%A9-%D9%88%D8%A7%D8%AD%D8%AF%D8%A9-%D9%A2-%D9%84%D8%AA%D8%B1-%D9%82%D8%AF-%D9%8A%D8%AE%D8%AA%D9%84%D9%81-%D8%A7%D9%84%D8%AA%D8%BA%D9%84%D9%8A%D9%81-2%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    description:
      "سائل أومو أكتيف للغسيل، يوفر فعالية بنسبة 100% في إزالة البقع من الغسلة الأولى، بسعة 2 لتر لتنظيف قوي.",
  },
  {
    price: 29.95,
    name: "تايد Tide Concentrated Laundry Powder Detergent, Original Scent, Manual Wash, 1.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001444/%D8%AA%D8%A7%D9%8A%D8%AF-tide-concentrated-laundry-powder-detergent-original-scent-manual-wash-15-kg.jpg.jpg",
    ],
    description:
      "مسحوق تيد المركز للغسيل اليدوي برائحة أصلية، يزيل البقع بسهولة ويمنح الملابس نضارة، بسعة 1.5 كجم.",
  },
  {
    price: 31.95,
    name: "برسيل Persil Blue Concentrated Washing Powder, 2.25kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001445/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-persil-blue-concentrated-washing-powder-225kg.jpg.jpg",
    ],
    description:
      "مسحوق برسيل الأزرق المركز، يوفر تنظيفاً قوياً ويزيل البقع الصعبة مع رائحة منعشة، بسعة 2.25 كجم للغسيل اليومي.",
  },
  {
    name: "فانش مزيل بقع الغسيل مسحوق وردي",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001447/%D9%81%D8%A7%D9%86%D8%B4-%D9%85%D8%B2%D9%8A%D9%84-%D8%A8%D9%82%D8%B9-%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84-%D9%85%D8%B3%D8%AD%D9%88%D9%82-%D9%88%D8%B1%D8%AF%D9%8A.jpg.jpg",
    ],
    discount: 28,
    price: 98.3,
    description:
      "مسحوق فانش الوردي لإزالة البقع، يعزز نظافة الملابس ويزيل البقع الصعبة بفعالية، مثالي للغسيل اليومي.",
  },
  {
    name: "برسيل شامبو العباية منظف سائل بتركيبة ثلاثية الأبعاد فريدة لتجديد اللون الأسود ونظافة العباية وعطر العود الذي يدوم طويلاً",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001448/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%85%D9%86%D8%B8%D9%81-%D8%B3%D8%A7%D8%A6%D9%84-%D8%A8%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%D8%A9-%D8%AB%D9%84%D8%A7%D8%AB%D9%8A%D8%A9-%D8%A7%D9%84%D8%A3%D8%A8%D8%B9%D8%A7%D8%AF-%D9%81%D8%B1%D9%8A%D8%AF%D8%A9-%D9%84%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF-%D8%A7%D9%84%D9%84%D9%88%D9%86-%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%AF-%D9%88%D9%86%D8%B8%D8%A7%D9%81%D8%A9-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%88%D8%B9%D8%B7%D8%B1-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-%D8%A7%D9%84%D8%B0%D9%8A-%D9%8A%D8%AF%D9%88%D9%85-%D8%B7%D9%88%D9%8A%D9%84%D8%A7.jpg.jpg",
    ],
    price: 26.7,
    description:
      "شامبو برسيل للعبايات بتركيبة ثلاثية الأبعاد، يجدد اللون الأسود وينظف العباية بعمق مع عطر العود الدائم.",
  },
  {
    name: "Flash Degreaser Lavender Scent, 750ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001448/flash-degreaser-lavender-scent-750ml.jpg.jpg",
    ],
    price: 15,
    description:
      "فلاش مزيل الدهون برائحة اللافندر، يزيل الدهون الصعبة بسهولة ويترك الأسطح نظيفة ومعطرة، بسعة 750 مل.",
  },
  {
    name: "برسيل منظف ​​سائل شامبو العباية لحماية اللون أسود 1 لتر أسود 1لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001449/%D8%A8%D8%B1%D8%B3%D9%8A%D9%84-%D9%85%D9%86%D8%B8%D9%81-%D8%B3%D8%A7%D8%A6%D9%84-%D8%B4%D8%A7%D9%85%D8%A8%D9%88-%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D9%8A%D8%A9-%D9%84%D8%AD%D9%85%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D9%84%D9%88%D9%86-%D8%A3%D8%B3%D9%88%D8%AF-1-%D9%84%D8%AA%D8%B1-%D8%A3%D8%B3%D9%88%D8%AF-1%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    price: 26.7,
    description:
      "شامبو برسيل للعبايات، يحمي اللون الأسود ويمنح نظافة عميقة مع عطر يدوم طويلاً، بسعة 1 لتر لعناية مثالية.",
  },
  {
    name: "Smac Smac Express Degreasers with Bleach, 650ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001450/smac-smac-express-degreasers-with-bleach-650ml.jpg.jpg",
    ],
    discount: 9,
    price: 19.9,
    description:
      "سماق إكسبريس مزيل الدهون مع مبيض، ينظف الأسطح ويزيل الدهون بفعالية مع تعقيم فائق، بسعة 650 مل.",
  },
  {
    price: 55.95,
    name: "Omo Omo Soap Comfort, 6KG",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001451/omo-omo-soap-comfort-6kg.jpg.jpg",
    ],
    description:
      "صابون أومو كمفورت، يوفر تنظيفاً قوياً ونعومة فائقة مع رائحة منعشة، بسعة 6 كجم للغسيل اليومي.",
  },
  {
    price: 9,
    name: "Fighter FLASH Flash Fighter Lemon Dishwashing Liquid, 1 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001452/fighter-flash-flash-fighter-lemon-dishwashing-liquid-1-liter.jpg.jpg",
    ],
    description:
      "سائل غسيل الأطباق فلاش فايتر برائحة الليمون، يزيل الدهون بسهولة ويمنح الأطباق لمعاناً، بسعة 1 لتر.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Spring Breeze, 7.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001453/klina-premium-automatic-washing-powder spring-breeze-75-kg.jpg.jpg",
    ],
    discount: 18,
    price: 61.5,
    description:
      "مسحوق غسيل كلينا بريميوم برائحة نسيم الربيع، مصمم للغسالات الأوتوماتيكية، يزيل البقع بفعالية، بسعة 7.5 كجم.",
  },
  {
    price: 14.75,
    name: "Al-Ajeeb جيل العجيب سوبر بين, 1.2 لتر",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001454/al-ajeeb-%D8%AC%D9%8A%D9%84-%D8%A7%D9%84%D8%B9%D8%AC%D9%8A%D8%A8-%D8%B3%D9%88%D8%A8%D8%B1-%D8%A8%D9%8A%D9%86-12-%D9%84%D8%AA%D8%B1.jpg.jpg",
    ],
    description:
      "جيل العجيب سوبر بين، يوفر تنظيفاً قوياً للملابس ويزيل البقع بفعالية مع رائحة منعشة، بسعة 1.2 لتر.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Mountain Breeze, 3kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001455/klina-premium-automatic-washing-powder-mountain-breeze-3kg.jpg.jpg",
    ],
    discount: 9,
    price: 19.9,
    description:
      "مسحوق غسيل كلينا بريميوم برائحة نسيم الجبل، مثالي للغسالات الأوتوماتيكية، يمنح نظافة عميقة، بسعة 3 كجم.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Spring Breeze, 10 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001456/klina-premium-automatic-washing-powder spring-breeze-10-kg.jpg.jpg",
    ],
    discount: 16,
    price: 71.95,
    description:
      "مسحوق غسيل كلينا بريميوم برائحة نسيم الربيع، يوفر تنظيفاً قوياً للغسالات الأوتوماتيكية، بسعة 10 كجم.",
  },
  {
    name: "QUINEEX Bleach Clothing, 1Gallon",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001457/quineex-bleach-clothing-1gallon.jpg.jpg",
    ],
    discount: 12,
    price: 15.9,
    description:
      "مبيض كوينيكس للملابس، يزيل البقع ويمنح بياضاً ناصعاً مع تعقيم فعال، بسعة 1 جالون لاستخدام طويل.",
  },
  {
    price: 16.95,
    name: "بريل Max Power Lemon Dishwashing Liquid, 1 Liter",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001457/%D8%A8%D8%B1%D9%8A%D9%84-max-power-lemon-dishwashing-liquid-1-liter.jpg.jpg",
    ],
    description:
      "سائل غسيل الأطباق بريل ماكس باور برائحة الليمون، يزيل الدهون بسهولة ويمنح الأطباق لمعاناً، بسعة 1 لتر.",
  },
  {
    price: 41.95,
    name: "اريال Ariel Protect Semi Automatic Antibacterial Laundry Detergent, 2.25kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001458/%D8%A7%D8%B1%D9%8A%D8%A7%D9%84-ariel-protect-semi-automatic-antibacterial-laundry-detergent-225kg.jpg.jpg",
    ],
    description:
      "مسحوق أريال بروتكت نصف أوتوماتيكي المضاد للبكتيريا، يقتل الجراثيم ويزيل البقع بفعالية، بسعة 2.25 كجم.",
  },
  {
    price: 3.95,
    name: "REX Rex 3 In 1 Laundry Powder Detergent, 190 g",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001459/rex-rex-3-in-1-laundry-powder-detergent-190-g.jpg.jpg",
    ],
    description:
      "مسحوق ركس 3 في 1، يجمع بين التنظيف القوي، إزالة البقع والرائحة المنعشة، بسعة 190 جرام للاستخدام اليومي.",
  },
  {
    name: "Al-Ajeeb Al Ajeeb Lemon Dishwashing Liquid, 1000 ml",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001461/al-ajeeb-al-ajeeb-lemon-dishwashing-liquid-1000-ml.jpg.jpg",
    ],
    price: 8.9,
    description:
      "سائل غسيل الصحون بالليمون من العجيب العجيب، 1000 مل، يوفر تنظيفًا قويًا للأطباق مع رائحة ليمون منعشة تدوم طويلاً.",
  },
  {
    name: "Persil Persil Abaya Wash Shampoo Liquid Detergent, For Black Color Protection & Renewal, Long-lasting Fragrance, Classic, 2.9L + Persil 2in1 Abaya Wash Shampoo, Rose, 900ML",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001462/persil-persil-abaya-wash-shampoo-liquid-detergent-for-black-color-protection-renewal-long-lasting-fragrance-classic-29l-persil-2in1-abaya-wash-shampoo-rose-900ml.jpg.jpg",
    ],
    discount: 12,
    price: 55.95,
    description:
      "شامبو برسيل للعبايات السوداء، 2.9 لتر، يحمي الألوان ويجددها مع رائحة كلاسيكية تدوم طويلاً، مع شامبو برسيل 2 في 1 برائحة الورد، 900 مل.",
  },
  {
    price: 37.5,
    name: "تايد Tide Protect Anti-Bacterial Laundry Powder Detergent, Automatic, 2.25kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001463/%D8%AA%D8%A7%D9%8A%D8%AF-tide-protect-anti-bacterial-laundry-powder-detergent-automatic-225kg.jpg.jpg",
    ],
    description:
      "مسحوق غسيل تايد بروتكت المضاد للبكتيريا، 2.25 كجم، مصمم للغسالات الأوتوماتيكية، يوفر نظافة عميقة وحماية من البكتيريا.",
  },
  {
    name: "كلوركس مزيل بقع ومثبت ألوان للملابس 1.8لترات",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001463/%D9%83%D9%84%D9%88%D8%B1%D9%83%D8%B3-%D9%85%D8%B2%D9%8A%D9%84-%D8%A8%D9%82%D8%B9-%D9%88%D9%85%D8%AB%D8%A8%D8%AA-%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D9%84%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-18%D9%84%D8%AA%D8%B1%D8%A7%D8%AA.jpg.jpg",
    ],
    discount: 6,
    price: 35.25,
    description:
      "كلوركس مزيل البقع ومثبت الألوان، 1.8 لتر، يزيل البقع الصعبة ويحافظ على ألوان الملابس زاهية ومشرقة.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Mountain Breeze, 10 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001464/klina-premium-automatic-washing-powder-mountain-breeze-10-kg.jpg.jpg",
    ],
    discount: 12,
    price: 68.5,
    description:
      "مسحوق غسيل كلينا بريميوم الأوتوماتيكي، نسيم الجبل، 10 كجم، يوفر نظافة مثالية مع رائحة منعشة تدوم طويلاً.",
  },
  {
    name: "Klina Premium Automatic Washing Powder, Mountain Breeze, 7.5 kg",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001465/klina-premium-automatic-washing-powder-mountain-breeze-75-kg.jpg.jpg",
    ],
    discount: 19,
    price: 61.95,
    description:
      "مسحوق غسيل كلينا بريميوم الأوتوماتيكي، نسيم الجبل، 7.5 كجم، يضمن تنظيفًا عميقًا ورائحة جبلية منعشة.",
  },
  {
    price: 30.95,
    name: "Persil Persil Colored Abaya Shampoo , For Color Renewal and Protection, 1L",
    images: [
      "https://res.cloudinary.com/dbyc0sncy/image/upload/v1747001466/persil-persil-colored-abaya-shampoo-for-color-renewal-and-protection-1l.jpg.jpg",
    ],
    description:
      "شامبو برسيل للعبايات الملونة، 1 لتر، يجدد الألوان ويحميها للحفاظ على مظهر العبايات مشرقًا وجذابًا.",
  },
];

// To insert all products without filtering:
seedProducts(electronicsCategoryId, sampleProducts, "كارفور");
