import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProductData {
  name: string;
  price: number;
  description?: string;
  images?: string[];
  discount?: number;
  // Add other product fields as needed
}

// Example usage to delete all products from a category
// deleteAllProductsFromCategory(electronicsCategoryId);
async function seedProducts(categoryId: string, products: ProductData[]) {
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

    // Create products with category relation
    const createdProducts = [];

    for (const product of products) {
      // Check if product already exists in this category
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: product.name,
          categoryId: categoryId,
        },
      });

      if (existingProduct) {
        console.log(`⏩ Skipping existing product: ${product.name}`);
        continue;
      }

      // Create the product if it doesn't exist
      const createdProduct = await prisma.product.create({
        //@ts-ignore
        data: {
          ...product,
          category: {
            connect: { id: categoryId },
          },
        },
      });

      createdProducts.push(createdProduct);
      console.log(`✅ Created product: ${product.name}`);
    }

    console.log(`✅ Successfully created ${createdProducts.length} products`);
    console.log(
      `⏩ Skipped ${products.length - createdProducts.length} existing products`
    );
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
const electronicsCategoryId = "67e47004b9ff67ae7d25f777"; // Replace with actual category ID

const sampleProducts: any = [
  {
    name: "اليوم دجاج فاخر طازج مبرد 1 كجم",
    description:
      "دجاجة كاملة فاخرة طازجة ومبردة من اليوم، مثالية للطهي اليومي، بعبوة 1 كجم.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h47/h46/50520421662750/504974_main.jpg?im=Resize=400",
    ],
    price: 19.95,
  },
  {
    name: "لحم بقري مفروم طازج محلي (للكيلو)",
    description:
      "لحم بقري مفروم طازج محلي، مثالي لتحضير الكفتة أو البرغر، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h4b/hf4/26516762066974/553261_main.jpg?im=Resize=400",
    ],
    price: 21.45,
  },
  {
    name: "إنتاج صدور دجاج فيليه 450 جرام",
    description:
      "صدور دجاج فيليه طازجة من إنتاج، خالية من العظم ومثالية للشواء أو الطهي، بعبوة 450 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hc7/hea/63282204082206/450442_main.jpg?im=Resize=400",
    ],
    price: 24.95,
    discount: 24,
  },
  {
    name: "إنتاج دجاجة كاملة طازجة 1000 جرام",
    description:
      "دجاجة كاملة طازجة من إنتاج، مناسبة للتحمير أو الطهي التقليدي، بعبوة 1000 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h95/hf4/63282204344350/91932_main.jpg?im=Resize=400",
    ],
    price: 20.25,
    discount: 14,
  },
  {
    name: "لحم عجل طازج مفروم (للكيلو)",
    description:
      "لحم عجل مفروم طازج، مثالي لتحضير الأطباق المتنوعة مثل الكفتة، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd2/h6f/9194856054814/577125_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "اليوم شرائح صدور دجاج طازجة 900 جرام",
    description:
      "شرائح صدور دجاج طازجة من اليوم، مثالية للوجبات الصحية والسريعة، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h22/h9f/50520585437214/634473_main.jpg?im=Resize=400",
    ],
    price: 44,
  },
  {
    name: "اليوم فيليه صدور دجاج مبرد 450 جرام",
    description:
      "فيليه صدور دجاج مبرد من اليوم، خالٍ من العظم ومثالي للشواء، بعبوة 450 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h3e/hf8/50520568266782/599582_main.jpg?im=Resize=400",
    ],
    price: 21.25,
  },
  {
    name: "الفروج الذهبي فيليه صدور دجاج طازجة 900جرام",
    description:
      "فيليه صدور دجاج طازجة من الفروج الذهبي، مثالية للطبخ الصحي، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h11/hc9/13926233210910/607938_main.jpg?im=Resize=400",
    ],
    price: 46.5,
    discount: 21,
  },
  {
    name: "اليوم أرجل دجاج كاملة طازجة فاخرة 900 جرام",
    description:
      "أرجل دجاج كاملة طازجة فاخرة من اليوم، مثالية للشواء أو القلي، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h29/hfa/50520592646174/652028_main.jpg?im=Resize=400",
    ],
    price: 21.5,
    discount: 35,
  },
  {
    name: "لحم بقري مفروم مبرد برازيلي",
    description:
      "لحم بقري مفروم مبرد من البرازيل، مثالي لتحضير البرغر أو الأطباق اليومية، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/haf/hc3/9169095458846/571447_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "التنمية صدور دجاج بدون عظم طازجة 450 جرام",
    description:
      "صدور دجاج طازجة بدون عظم من التنمية، مثالية للوجبات الصحية، بعبوة 450 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb1/hd1/49802999660574/97684_main.jpg?im=Resize=400",
    ],
    price: 24.25,
    discount: 34,
  },
  {
    name: "التنمية كيس دجاج طازج 1 كج",
    description:
      "دجاجة كاملة طازجة من التنمية، مناسبة للطهي اليومي، بعبوة 1 كجم.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h40/hdc/49802999332894/97658_main.jpg?im=Resize=400",
    ],
    price: 21,
    discount: 12,
  },
  {
    name: "الفروج الذهبي فيليه صدور دجاج طازجة 450جرام",
    description:
      "فيليه صدور دجاج طازجة من الفروج الذهبي، خالية من العظم ومثالية للشواء، بعبوة 450 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hfa/hc4/13926233374750/607937_main.jpg?im=Resize=400",
    ],
    price: 22.95,
    discount: 17,
  },
  {
    name: "دجاج رضوى دجاج مفروم طازج 400 جرام",
    description:
      "دجاج مفروم طازج من رضوى، مثالي لتحضير الكفتة أو الحشوات، بعبوة 400 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/562186/1737874803/562186_main.jpg?im=Resize=400",
    ],
    price: 16.25,
    discount: 14,
  },
  {
    name: "التنمية دجاج طازج 1100 جرام",
    description:
      "دجاجة كاملة طازجة من التنمية، مثالية للتحمير أو الطهي التقليدي، بعبوة 1100 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/ha4/hc4/49802998677534/97659_main.jpg?im=Resize=400",
    ],
    price: 22,
    discount: 5,
  },
  {
    name: "كتف عجل طازج بدون عظم",
    description:
      "كتف عجل طازج بدون عظم، مثالي للطهي البطيء أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h20/h42/52611230040094/713635_main.jpg?im=Resize=400",
    ],
    price: 29.95,
    discount: 17,
  },
  {
    name: "إنتاج قطع دجاج مشكلة طازجة 900 جرام",
    description:
      "قطع دجاج مشكلة طازجة من إنتاج، مثالية للطهي المتنوع، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/451037/1742194803/451037_main.jpg?im=Resize=400",
    ],
    price: 14.95,
    discount: 27,
  },
  {
    name: "لحم بقري طازج بدون عظم محلي (للكيلو)",
    description:
      "لحم بقري طازج بدون عظم محلي، مثالي للشواء أو الطهي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h77/hb9/9169095753758/553260_main.jpg?im=Resize=400",
    ],
    price: 24.95,
  },
  {
    name: "إنتاج صدور دجاج فيليه 900 جرام",
    description:
      "صدور دجاج فيليه طازجة من إنتاج، خالية من العظم ومثالية للشواء، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h93/hf7/63282204409886/712029_main.jpg?im=Resize=400",
    ],
    price: 43.95,
    discount: 9,
  },
  {
    name: "ربع خروف أمامي استرالي",
    description:
      "ربع خروف أمامي مبرد من أستراليا، مثالي للمناسبات والطهي التقليدي.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h82/hb2/9881923911710/4953_main.jpg?im=Resize=400",
    ],
    price: 137,
  },
  {
    name: "مفروم خروف نعيمي ذكر",
    description:
      "لحم خروف نعيمي مفروم ذكر، مثالي لتحضير الكفتة أو الحشوات، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h5e/h61/11892378009630/577095_main.jpg?im=Resize=400",
    ],
    price: 49.95,
  },
  {
    name: "لحم عجل بالعظم طازج",
    description:
      "لحم عجل طازج بالعظم، مثالي لتحضير اليخنات أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb2/hd5/51509451391006/5088_main.jpg?im=Resize=400",
    ],
    price: 19.95,
  },
  {
    name: "لحم حاشي بالعظم طازج",
    description:
      "لحم حاشي طازج بالعظم، مثالي للطهي التقليدي مثل المندي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h95/h92/51509337686046/115817_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "لحم بقري طازج بالعظم محلي (للكيلو)",
    description:
      "لحم بقري طازج بالعظم محلي، مثالي لتحضير المرق أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h7e/he8/51509472624670/553262_main.jpg?im=Resize=400",
    ],
    price: 39.9,
  },
  {
    name: "فخذ حاشي بدون عظم طازج (للكيلو)",
    description:
      "فخذ حاشي طازج بدون عظم، مثالي للشواء أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h51/h47/51509474525214/577131_main.jpg?im=Resize=400",
    ],
    price: 19.98,
  },
  {
    name: "قطع خروف نعيمي ذكر",
    description:
      "قطع خروف نعيمي ذكر، مثالية للطهي التقليدي أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h12/h76/51509455192094/5172_main.jpg?im=Resize=400",
    ],
    price: 37.95,
  },
  {
    name: "لحم خروف نعيمي بدون عظم ذكر",
    description:
      "لحم خروف نعيمي بدون عظم ذكر، مثالي للشواء أو الطهي السريع، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h20/hbb/51509473247262/577094_main.jpg?im=Resize=400",
    ],
    price: 49.95,
  },
  {
    name: "التنمية قطع دجاج مشكلة طازجة 800 جرام",
    description:
      "قطع دجاج مشكلة طازجة من التنمية، مثالية للوجبات العائلية، بعبوة 800 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he1/h0b/49802996744222/695535_main.jpg?im=Resize=400",
    ],
    price: 14.25,
    discount: 16,
  },
  {
    name: "كتف خروف نعيمي ذكر",
    description:
      "كتف خروف نعيمي ذكر، مثالي للشواء أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he7/hb0/51509473542174/577098_main.jpg?im=Resize=400",
    ],
    price: 42.45,
  },
  {
    name: "إنتاج دجاجة كاملة طازجة 1.1 كج",
    description:
      "دجاجة كاملة طازجة من إنتاج، مثالية للتحمير أو الطهي التقليدي، بعبوة 1.1 كجم.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hfd/hf7/63282204442654/91933_main.jpg?im=Resize=400",
    ],
    price: 22.95,
    discount: 9,
  },
  {
    name: "لحم بقري برازيلي مفروم قليلة الدسم مبرد (للكيلو)",
    description:
      "لحم بقري مفروم مبرد قليل الدسم من البرازيل، مثالي للوجبات الصحية، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hbc/h26/12066793422878/571448_main.jpg?im=Resize=400",
    ],
    price: 28.45,
  },
  {
    name: "لحم عجل محلي مكعبات طازج",
    description:
      "لحم عجل محلي مكعبات طازج، مثالي لتحضير اليخنات أو الكباب، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h21/hc2/9384328986654/5089_main.jpg?im=Resize=400",
    ],
    price: 33.95,
  },
  {
    name: "الفروج الذهبي قطع دجاج طازجة 800جرام",
    description:
      "قطع دجاج مشكلة طازجة من الفروج الذهبي، مثالية للطهي المتنوع، بعبوة 800 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h9a/h9a/50564262985758/627581_main.jpg?im=Resize=400",
    ],
    price: 15,
    discount: 27,
  },
  {
    name: "خروف استرالي مبرد حوالي 14 ~ 16 كج",
    description:
      "خروف استرالي مبرد كامل، مثالي للمناسبات الكبيرة، بوزن يتراوح بين 14 إلى 16 كجم.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd1/h79/63026597494814/709961_main.jpg?im=Resize=400",
    ],
    price: 813.9,
  },
  {
    name: "لحم بقر طازج محلي ستيك (للكيلو)",
    description:
      "لحم بقري طازج محلي ستيك، مثالي للشواء أو القلي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h32/hc2/27675590098974/553268_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "لحم غنم أسترالي، لكل كغ",
    description:
      "لحم غنم أسترالي مبرد، مثالي لتحضير اليخنات أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h31/h31/50868895776798/714420_main.jpg?im=Resize=400",
    ],
    price: 27.95,
  },
  {
    name: "ريش غنم روماني طازجة (للكيلو)",
    description:
      "ريش غنم روماني طازجة، مثالية للشواء أو الطهي على الفحم، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/ha2/h69/52081511858206/623400_main.jpg?im=Resize=400",
    ],
    price: 42.45,
  },
  {
    name: "إسكالوب عجل محلي طازج",
    description:
      "إسكالوب عجل محلي طازج، مثالي للقلي أو الشواء السريع، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/5090/1722151803/5090_main.jpg?im=Resize=400",
    ],
    price: 37.45,
  },
  {
    name: "فخذ خروف نعيمي ذكر",
    description:
      "فخذ خروف نعيمي ذكر، مثالي للشواء أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h07/hdf/51509472395294/577093_main.jpg?im=Resize=400",
    ],
    price: 41.25,
  },
  {
    name: "لحم بقري محلي مكعبات قليل الدهون - محلي (للكيلو)",
    description:
      "لحم بقري محلي مكعبات قليل الدهون، مثالي للوجبات الصحية، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h80/h28/63026593234974/606878_main.jpg?im=Resize=400",
    ],
    price: 26.45,
  },
  {
    name: "لحم بقري برازيلي مبرد ستروجنوف (للكيلو)",
    description:
      "لحم بقري برازيلي مبرد ستروجنوف، مثالي لتحضير أطباق الستروجنوف، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hfe/hdd/9384328134686/571441_main.jpg?im=Resize=400",
    ],
    price: 27.45,
  },
  {
    name: "التنمية صدور دجاج بدون عظم طازجة 900 جرام",
    description:
      "صدور دجاج طازجة بدون عظم من التنمية، مثالية للشواء أو الطهي الصحي، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he9/hdb/49802999365662/97699_main.jpg?im=Resize=400",
    ],
    price: 46.25,
    discount: 9,
  },
  {
    name: "دجاج رضوى شرائح صدور دجاج طازجه 900 جرام",
    description:
      "شرائح صدور دجاج طازجة من رضوى، مثالية للوجبات السريعة والصحية، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/555355/1737874803/555355_main.jpg?im=Resize=400",
    ],
    price: 43,
  },
  {
    name: "فخذ غنم روماني طازج (للكيلو)",
    description:
      "فخذ غنم روماني طازج، مثالي للشواء أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h9e/h77/51509492187166/623399_main.jpg?im=Resize=400",
    ],
    price: 34.95,
    discount: 14,
  },
  {
    name: "كتف خروف روماني طازج",
    description:
      "كتف خروف روماني طازج، مثالي للطهي البطيء أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h2d/h18/51509491499038/623401_main.jpg?im=Resize=400",
    ],
    price: 33.95,
    discount: 12,
  },
  {
    name: "موزات عجل محلي بالعظم طازج",
    description:
      "موزات عجل محلي بالعظم طازج، مثالية لتحضير اليخنات، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd1/he8/9384331411486/4944_main.jpg?im=Resize=400",
    ],
    price: 32.45,
  },
  {
    name: "لحم العجل بدون عظم",
    description:
      "لحم عجل بدون عظم، مثالي للشواء أو الطهي السريع، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hf5/h1f/16749202112542/577122_main.jpg?im=Resize=400",
    ],
    price: 29.98,
  },
  {
    name: "كبدة غنم طازجة",
    description: "كبدة غنم طازجة، مثالية للقلي أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h11/he3/51509456273438/5270_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "لحم بقري برازيلي مبرد ستربلوين (للكيلو)",
    description:
      "لحم بقري برازيلي مبرد ستربلوين، مثالي للشواء أو القلي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he8/h6c/9384329379870/571422_main.jpg?im=Resize=400",
    ],
    price: 34.95,
  },
  {
    name: "لحم بقري برازيلي مبرد فيليه (للكيلو)",
    description:
      "لحم بقري برازيلي مبرد فيليه، مثالي لتحضير الستيك الفاخر، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h6f/h66/9384329543710/571420_main.jpg?im=Resize=400",
    ],
    price: 49.95,
  },
  {
    name: "كفتة لحم بقر طازجة",
    description:
      "كفتة لحم بقر طازجة جاهزة، مثالية للشواء أو الطهي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he4/h0f/11892377747486/5197_main.jpg?im=Resize=400",
    ],
    price: 19.95,
    discount: 25,
  },
  {
    name: "رضوى دجاج طازج فاخر مبرد 1 كج",
    description:
      "دجاجة كاملة طازجة فاخرة ومبردة من رضوى، مثالية للطهي اليومي، بعبوة 1 كجم.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/555331/1737879003/555331_main.jpg?im=Resize=400",
    ],
    price: 22.5,
    discount: 14,
  },
  {
    name: "مفروم عجل مبرد - باكستاني",
    description:
      "لحم عجل مفروم مبرد من باكستان، مثالي لتحضير الكفتة أو البرغر، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h46/h15/49110936059934/377099_main.jpg?im=Resize=400",
    ],
    price: 27.45,
  },
  {
    name: "ضلوع خروف متبلة",
    description:
      "ضلوع خروف متبلة جاهزة للطهي، مثالية للشواء أو الفرن، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he1/hc2/15846371065886/562890_main.jpg?im=Resize=400",
    ],
    price: 45.95,
  },
  {
    name: "رقبة خروف نعيمي ذكر",
    description:
      "رقبة خروف نعيمي ذكر، مثالية لتحضير المرق أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h3d/h70/9384329281566/577096_main.jpg?im=Resize=400",
    ],
    price: 39.95,
  },
  {
    name: "دجاج رضوى دجاج مبرد فاخر فاخر 1200 جرام",
    description:
      "دجاجة كاملة فاخرة ومبردة من رضوى، مثالية للتحمير أو الطهي، بعبوة 1200 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/555333/1737879003/555333_main.jpg?im=Resize=400",
    ],
    price: 24.5,
    discount: 12,
  },
  {
    name: "موزات لحم خروف استرالي مبرد",
    description:
      "موزات خروف استرالي مبرد، مثالية للطهي البطيء أو اليخنات، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h12/h7e/16411384807454/4950_main.jpg?im=Resize=400",
    ],
    price: 39.9,
  },
  {
    name: "لحم بقري مكعبات قليلة الدسم مبرد برازيلي (للكيلو)",
    description:
      "لحم بقري مكعبات قليل الدسم مبرد من البرازيل، مثالي للوجبات الصحية، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd0/h23/9181587734558/571446_main.jpg?im=Resize=400",
    ],
    price: 28.45,
  },
  {
    name: "لحم بقري برازيلي توب سايد (للكيلو)",
    description:
      "لحم بقري برازيلي مبرد توب سايد، مثالي للشواء أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/ha7/hb4/51509473411102/571433_main.jpg?im=Resize=400",
    ],
    price: 27.45,
  },
  {
    name: "قطع لحم فاخرة من متن العجل",
    description:
      "قطع لحم فاخرة من متن العجل، مثالية لتحضير الستيك الفاخر، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h85/hbe/51509605335070/662840_main.jpg?im=Resize=400",
    ],
    price: 50.95,
  },
  {
    name: "لحم بقري طازج محلي - شرائح من الظهر (للكيلو)",
    description:
      "شرائح لحم بقري طازج محلي من الظهر، مثالية للشواء أو القلي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he3/hbd/9194855890974/553265_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "كفتة لحم غنم طازجة",
    description:
      "كفتة لحم غنم طازجة جاهزة، مثالية للشواء أو الطهي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h25/h0c/11892377616414/5218_main.jpg?im=Resize=400",
    ],
    price: 34.98,
  },
  {
    name: "لحم العجل الطازج",
    description:
      "لحم عجل طازج توب سايد، مثالي للشواء أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb7/h8c/14624789528606/650314_main.jpg?im=Resize=400",
    ],
    price: 37.45,
  },
  {
    name: "ساق لحم العجل الطازج",
    description:
      "ساق لحم عجل طازج، مثالية للطهي البطيء أو اليخنات، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h68/h7e/14624789987358/650312_main.jpg?im=Resize=400",
    ],
    price: 32.95,
  },
  {
    name: "لحم بقري برازيلي مبرد روست",
    description:
      "لحم بقري برازيلي مبرد روست، مثالي للتحمير أو الشواء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h64/h77/9384329052190/571428_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "ريش خروف نعيمي ذكر",
    description:
      "ريش خروف نعيمي ذكر، مثالية للشواء أو الطهي على الفحم، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h4a/h34/12066793816094/5168_main.jpg?im=Resize=400",
    ],
    price: 64.95,
  },
  {
    name: "سجق عربي",
    description:
      "سجق عربي طازج بنكهة تقليدية، مثالي للشواء أو القلي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h05/ha2/11416871010334/5227_main.jpg?im=Resize=400",
    ],
    price: 23.45,
  },
  {
    name: "الفروج الذهبي دجاجة كاملة طازجة متبلة- تتبيلة الفلفل والليمون 700جرام",
    description:
      "دجاجة كاملة طازجة متبلة بنكهة الفلفل والليمون من الفروج الذهبي، جاهزة للطهي، بعبوة 700 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h7c/h8a/49171561087006/657254_main.jpg?im=Resize=400",
    ],
    price: 18.25,
    discount: 13,
  },
  {
    name: "تنمية 8 أرباع دجاج طازجة مع أوميجا 3 900 جرام",
    description:
      "8 أرباع دجاج طازجة مدعمة بأوميجا 3 من التنمية، مثالية للوجبات الصحية، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h79/h08/49802996842526/702709_main.jpg?im=Resize=400",
    ],
    price: 20,
    discount: 13,
  },
  {
    name: "كتف عجل محلي بالعظم طازج (للكيلو)",
    description:
      "كتف عجل محلي بالعظم طازج، مثالي للطهي البطيء أو اليخنات، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h07/h63/9384329642014/5092_main.jpg?im=Resize=400",
    ],
    price: 27.95,
  },
  {
    name: "كباب لحم غنم",
    description:
      "كباب لحم غنم طازج جاهز، مثالي للشواء أو الطهي على الفحم، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h1b/hf3/15846368870430/5219_main.jpg?im=Resize=400",
    ],
    price: 32.45,
  },
  {
    name: "إنتاج - أفخاذ دجاج طازج 900 جرام",
    description:
      "أفخاذ دجاج طازجة من إنتاج، مثالية للشواء أو القلي، بعبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/744316/1734859803/744316_main.jpg?im=Resize=400",
    ],
    price: 21.95,
    discount: 14,
  },
  {
    name: "سمان طازج ~600 جرام",
    description:
      "سمان طازج، مثالي للشواء أو الطهي التقليدي، بوزن حوالي 600 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h47/hb9/9181880778782/110965_main.jpg?im=Resize=400",
    ],
    price: 26.9,
    discount: 11,
  },
  {
    name: "برجر لحم بقر محلي",
    description:
      "برجر لحم بقر محلي جاهز، مثالي للشواء أو القلي، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h13/h97/61851462631454/562880_main.jpg?im=Resize=400",
    ],
    price: 7.98,
  },
  {
    name: "موزات خروف نعيمي ذكر",
    description:
      "موزات خروف نعيمي ذكر، مثالية للطهي البطيء أو اليخنات، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/536430/1742980204/536430_main.jpg?im=Resize=400",
    ],
    price: 44.95,
  },
  {
    name: "دجاج بلدي 1 كج إلى 1.2 كج",
    description:
      "دجاج بلدي طازج، مثالي للطهي التقليدي، بوزن يتراوح بين 1 إلى 1.2 كجم.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/ha2/h7e/62005671591966/711826_main.jpg?im=Resize=400",
    ],
    price: 33.9,
  },
  {
    name: "التنمية شيش طاووق 400 جرام",
    description:
      "شيش طاووق طازج من التنمية، متبل وجاهز للشواء، بعبوة 400 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/741322/1728911404/741322_main.jpg?im=Resize=400",
    ],
    price: 27.75,
    discount: 12,
  },
  {
    name: "إنتاج صدور دجاج بالعظم مبرد 500 جرام",
    description:
      "صدور دجاج بالعظم مبردة من إنتاج، مثالية للطهي أو الشواء، بعبوة 500 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/595605/1737373999/595605_main.png?im=Resize=400",
    ],
    price: 14.95,
    discount: 10,
  },
  {
    name: "أضلع عجل محلي بالعظم طازج",
    description:
      "أضلع عجل محلي بالعظم طازج، مثالية للشواء أو الطهي البطيء، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/had/h94/29941174042654/577124_main.jpg?im=Resize=400",
    ],
    price: 31.45,
  },
  {
    name: "لحم ضلوع غنم أسترالي مبرد",
    description:
      "ضلوع غنم أسترالي مبرد، مثالية للشواء أو الطهي على الفحم، يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h40/h05/46004190937118/4951_main.jpg?im=Resize=400",
    ],
    price: 49.95,
  },
  {
    name: "كتف لحم البقر النيوزيلندي لكل كيلو",
    description:
      "كتف لحم بقر طازج من نيوزيلندا، مثالي للطهي البطيء أو الشواء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hf5/hde/14662023872542/566131_main.jpg?im=Resize=400",
    ],
    price: 34.95,
  },
  {
    name: "دجاج رضوى أرجل دجاج كاملة 500 جرام",
    description:
      "أرجل دجاج كاملة طازجة من رضوى، مثالية للشواء أو الطبخ. عبوة 500 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/555348/1737879003/555348_main.jpg?im=Resize=400",
    ],
    price: 10.75,
    discount: 12,
  },
  {
    name: "دجاج رضوى مرتديلا دجاج 500 جرام",
    description:
      "مرتديلا دجاج طازجة من رضوى، مثالية للساندويتشات والمقبلات. عبوة 500 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/595067/1737882603/595067_main.jpg?im=Resize=400",
    ],
    price: 16.75,
    discount: 14,
  },
  {
    name: "الفروج الذهبي دجاجة كاملة طازجة متبلة- تيكا 600جرام",
    description:
      "دجاجة كاملة طازجة متبلة بنكهة التيكا من الفروج الذهبي، جاهزة للشواء. عبوة 600 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hac/heb/13926237601822/620029_main.jpg?im=Resize=400",
    ],
    price: 17,
    discount: 12,
  },
  {
    name: "الاسياح دجاج طازج 350 جرام × 2",
    description:
      "دجاج طازج من الأسياح، مثالي للوجبات العائلية. عبوة 2 × 350 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h7b/hd6/9226105946142/224503_main.jpg?im=Resize=400",
    ],
    price: 25,
  },
  {
    name: "التنمية دجاج متبل حراق 600 جرام",
    description:
      "دجاج متبل بنكهة حارة من التنمية، جاهز للطهي أو الشواء. عبوة 600 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he9/h18/49802991894558/442775_main.jpg?im=Resize=400",
    ],
    price: 19,
    discount: 8,
  },
  {
    name: "ستيك لحم بافلو هندي",
    description:
      "ستيك لحم جاموس هندي طازج، مثالي للشواء أو القلي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h64/hea/49217183285278/702955_main.jpg?im=Resize=400",
    ],
    price: 39.9,
  },
  {
    name: "دجاج رضوى مرتديلا دجاج 250 جرام",
    description:
      "مرتديلا دجاج طازجة من رضوى، مثالية للوجبات الخفيفة. عبوة 250 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/587296/1737874803/587296_main.jpg?im=Resize=400",
    ],
    price: 9.25,
  },
  {
    name: "دجاج رضوى نقانق دجاج طازجة حارة 400 جرام",
    description:
      "نقانق دجاج طازجة حارة من رضوى، مثالية للشواء أو القلي. عبوة 400 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/619901/1737874803/619901_main.jpg?im=Resize=400",
    ],
    price: 8.25,
  },
  {
    name: "كتف لحم بقري برازيلي",
    description:
      "كتف لحم بقر برازيلي مبرد، مثالي للطهي الطويل أو الشواء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h3f/h77/49346340847646/571444_main.jpg?im=Resize=400",
    ],
    price: 22.45,
  },
  {
    name: "لحم بقري برازيلي مبرد توب سايد مكعبات (للكيلو)",
    description:
      "مكعبات لحم بقر برازيلي مبرد توب سايد، مثالية للطبخ السريع. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hcf/hc2/9384328921118/584176_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "التنمية أسرار الطعم صدور دجاج طازجة وطرية تندوري 400 جرام",
    description:
      "صدور دجاج طازجة متبلة بنكهة تندوري من التنمية، جاهزة للطهي. عبوة 400 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/739152/1723116603/739152_main.jpg?im=Resize=400",
    ],
    price: 27.75,
    discount: 17,
  },
  {
    name: "لحم بقري مكعبات مبرد قليل الدسم نيوزلندي (للكيلو)",
    description:
      "مكعبات لحم بقر مبرد قليل الدسم من نيوزيلندا، مثالي للوجبات الصحية. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h38/h08/11892377026590/441917_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "التنمية دجاجة كاملة طازجة مع أوميجا3 - 800جرام",
    description:
      "دجاجة كاملة طازجة غنية بأوميجا3 من التنمية، صحية ولذيذة. عبوة 800 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h74/h61/49802997858334/702705_main.jpg?im=Resize=400",
    ],
    price: 22.5,
    discount: 9,
  },
  {
    name: "لحم بقري توب سايد مبرد نيوزلندي (للكيلو)",
    description:
      "لحم بقر توب سايد مبرد من نيوزيلندا، مثالي للشواء أو الطهي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h1a/h62/52081404379166/441833_main.jpg?im=Resize=400",
    ],
    price: 34.95,
  },
  {
    name: "فوندو لحم برازيلي مبرد (للكيلو)",
    description:
      "لحم بقر فوندو برازيلي مبرد، مثالي للشواء أو الطهي السريع. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hf6/h91/14624768688158/571440_main.jpg?im=Resize=400",
    ],
    price: 27.45,
  },
  {
    name: "سجق بقري مرقاز طازج (للكيلو)",
    description: "سجق بقري مرقاز طازج، مثالي للشواء أو القلي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hf6/h12/11892377813022/5235_main.jpg?im=Resize=400",
    ],
    price: 23.45,
  },
  {
    name: "لحم بقري برازيلي مبرد سمانة (للكيلو)",
    description:
      "لحم بقر سمانة برازيلي مبرد، مثالي للطهي البطيء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h09/h60/9384329707550/571431_main.jpg?im=Resize=400",
    ],
    price: 28.45,
  },
  {
    name: "مفصل لحم العجل طازج",
    description:
      "مفصل لحم عجل طازج محلي، مثالي للشوربة أو الطهي الطويل. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he6/h85/14624789725214/650313_main.jpg?im=Resize=400",
    ],
    price: 37.45,
  },
  {
    name: "لحم جاموس هندي خاصرة خلفية",
    description:
      "خاصرة خلفية لحم جاموس هندي، مثالية للشواء أو الطهي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hf3/h8a/49217182597150/702668_main.jpg?im=Resize=400",
    ],
    price: 34.9,
  },
  {
    name: "إنتاج قلوب دجاج طازجة 400 جرام",
    description:
      "قلوب دجاج طازجة من إنتاج، مثالية للشواء أو القلي. عبوة 400 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h4b/h9c/63282203885598/450436_main.jpg?im=Resize=400",
    ],
    price: 10.95,
    discount: 23,
  },
  {
    name: "لحم جاموس هندي مكعبات",
    description:
      "مكعبات لحم جاموس هندي، مثالية للطبخ السريع أو الكاري. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h59/haf/49217184170014/702954_main.jpg?im=Resize=400",
    ],
    price: 29.95,
  },
  {
    name: "كباب بقري",
    description: "كباب بقري طازج، جاهز للشواء بنكهة تقليدية. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/5208/1733404040/5208_main.jpg?im=Resize=400",
    ],
    price: 21.45,
  },
  {
    name: "دجاج رضوى دجاج مبرد فاخر 1100 جرام",
    description:
      "دجاج مبرد فاخر من رضوى، مثالي للوجبات العائلية. عبوة 1100 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/555332/1737874803/555332_main.jpg?im=Resize=400",
    ],
    price: 23.5,
  },
  {
    name: "كبدة عجل محلي طازجة (للكيلو)",
    description: "كبدة عجل طازجة محلية، مثالية للقلي أو الشواء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/ha6/hdd/9384328167454/5261_main.jpg?im=Resize=400",
    ],
    price: 24.98,
  },
  {
    name: "الفروج الذهبي قوانص دجاج طازجة 350جرام",
    description:
      "قوانص دجاج طازجة من الفروج الذهبي، مثالية للطهي أو القلي. عبوة 350 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h0d/hdb/13926237143070/627577_main.jpg?im=Resize=400",
    ],
    price: 9.5,
  },
  {
    name: "أضلاع حاشي طازجة",
    description:
      "أضلاع حاشي طازجة، مثالية للشواء أو الطهي البطيء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hca/hb5/49411322937374/577133_main.jpg?im=Resize=400",
    ],
    price: 44.9,
  },
  {
    name: "رضوى شاورما دجاج فاخر حارة ومتبلة 400جرام",
    description: "شاورما دجاج متبلة حارة من رضوى، جاهزة للطهي. عبوة 400 جرام.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/708043/1737874803/708043_main.jpg?im=Resize=400",
    ],
    price: 17.75,
    discount: 13,
  },
  {
    name: "طيبة قطع دجاج مشكلة طازجة 900 جرام",
    description:
      "قطع دجاج مشكلة طازجة من طيبة، مثالية للوجبات المتنوعة. عبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd4/hc6/51002655965214/712233_main.jpg?im=Resize=400",
    ],
    price: 15,
    discount: 17,
  },
  {
    name: "إنتاج دجاج كامل مجمد 1200 جرام",
    description:
      "دجاج كامل مجمد من إنتاج، مثالي للتخزين والطهي لاحقاً. عبوة 1200 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h2f/hee/63282204180510/595604_main.jpg?im=Resize=400",
    ],
    price: 22.95,
    discount: 9,
  },
  {
    name: "أرجل عجل طازجة",
    description:
      "أرجل عجل طازجة محلية، مثالية لتحضير الشوربة أو الأطباق التقليدية. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hc7/hda/49346338062366/5258_main.jpg?im=Resize=400",
    ],
    price: 19.95,
  },
  {
    name: "نصف دجاجة مع تتبيلة الثوم",
    description:
      "نصف دجاجة متبلة بنكهة الثوم، جاهزة للشواء أو الطهي. يُباع بالقطعة.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/634140/1733379712/634140_main.jpg?im=Resize=400",
    ],
    price: 14.9,
  },
  {
    name: "الفروج الذهبي صدور دجاج طازجة بالعظم 500جرام",
    description:
      "صدور دجاج طازجة بالعظم من الفروج الذهبي، مثالية للشواء. عبوة 500 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/ha7/hcc/13926241239070/657253_main.jpg?im=Resize=400",
    ],
    price: 15.75,
  },
  {
    name: "كتف لحم الضأن مبرد",
    description:
      "كتف لحم ضأن مبرد من أستراليا، مثالي للشواء أو الطهي البطيء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb3/hee/14661728305182/577108_main.jpg?im=Resize=400",
    ],
    price: 32.95,
  },
  {
    name: "روست عجل محلي طازج (للكيلو)",
    description:
      "لحم عجل روست طازج محلي، مثالي للشواء أو الفرن. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd3/hbb/9384330887198/577121_main.jpg?im=Resize=400",
    ],
    price: 36.45,
  },
  {
    name: "دواجن الوطنية دجاج طازج 1000 جرام",
    description:
      "دجاج طازج كامل من دواجن الوطنية، مثالي للوجبات العائلية. عبوة 1000 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hf4/hb6/9970841649182/97608_main.jpg?im=Resize=400",
    ],
    price: 20.5,
  },
  {
    name: "فروج الأسياح دجاج متبل أرجل كاملة 600 جرام",
    description:
      "أرجل دجاج كاملة متبلة من فروج الأسياح، جاهزة للشواء. عبوة 600 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/ha9/h18/12778281238558/529212_main.jpg?im=Resize=400",
    ],
    price: 16.25,
  },
  {
    name: "ديامانتينا - ستيك تندرلوين بقر واجيو أسترالي 250 جرام",
    description:
      "ستيك تندرلوين واجيو أسترالي فاخر من ديامانتينا، مثالي للشواء. عبوة 250 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hed/h26/51343278604318/701802_main.jpg?im=Resize=400",
    ],
    price: 107.9,
  },
  {
    name: "لحم بقري ستروجنوف مبرد نيوزلندي (للكيلو)",
    description:
      "لحم بقر ستروجنوف مبرد من نيوزيلندا، مثالي لتحضير الستروجنوف. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h57/h02/11892377354270/441919_main.jpg?im=Resize=400",
    ],
    price: 30.95,
  },
  {
    name: "لحم بقري ريب اي مبرد نيوزلندي (للكيلو)",
    description:
      "لحم بقر ريب آي مبرد من نيوزيلندا، مثالي للشواء الفاخر. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h3d/h7a/11892378796062/441837_main.jpg?im=Resize=400",
    ],
    price: 68.45,
  },
  {
    name: "دايامانتينا - ستيك واجيو ستريبلوين أسترالي 250جرام",
    description:
      "ستيك واجيو ستريبلوين أسترالي فاخر من دايامانتينا، مثالي للشواء. عبوة 250 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/had/h85/51308361809950/701804_main.jpg?im=Resize=400",
    ],
    price: 119.9,
  },
  {
    name: "فخذ خروف بدون عظم مبرد أسترالي",
    description:
      "فخذ خروف بدون عظم مبرد من أستراليا، مثالي للشواء أو الفرن. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h76/hcf/11892379189278/531222_main.jpg?im=Resize=400",
    ],
    price: 125.85,
  },
  {
    name: "فروج الاسياح - قطع دجاج مشكلة 900 جرام",
    description:
      "قطع دجاج مشكلة طازجة من فروج الأسياح، مثالية للوجبات المتنوعة. عبوة 900 جرام.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h37/h82/49929503637534/529211_main.jpg?im=Resize=400",
    ],
    price: 17.5,
  },
  {
    name: "امعاء خروف طازجة",
    description:
      "أمعاء خروف طازجة محلية، مثالية لتحضير الأطباق التقليدية. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h8b/he8/52426817273886/5273_main.jpg?im=Resize=400",
    ],
    price: 14.95,
  },
  {
    name: "ضلوع جمل طازجة",
    description:
      "ضلوع جمل طازجة، مثالية للشواء أو الطهي البطيء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb8/h32/51410992267294/115821_main.jpg?im=Resize=400",
    ],
    price: 44.9,
  },
  {
    name: "شيش طاووق باربيكيو",
    description: "شيش طاووق متبل بنكهة الباربيكيو، جاهز للشواء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h42/hd4/15846371590174/634136_main.jpg?im=Resize=400",
    ],
    price: 22.95,
    discount: 13,
  },
  {
    name: "قلب عجل طازج",
    description: "قلب عجل طازج محلي، مثالي للشواء أو القلي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd3/hdb/51292975595550/5259_main.jpg?im=Resize=400",
    ],
    price: 33.67,
  },
  {
    name: "قلب ضان طازج",
    description:
      "قلب ضأن طازج محلي، مثالي للشواء أو الطهي التقليدي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb2/h2b/49411320512542/5268_main.jpg?im=Resize=400",
    ],
    price: 28.45,
  },
  {
    name: "فخذ غنم استرالي مبرد (للكيلو)",
    description:
      "فخذ غنم مبرد من أستراليا، مثالي للشواء أو الفرن. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hfa/hf6/11416870649886/577107_main.jpg?im=Resize=400",
    ],
    price: 34.95,
  },
  {
    name: "لحم بقري فوندو مبرد نيوزلندي (للكيلو)",
    description:
      "لحم بقر فوندو مبرد من نيوزيلندا، مثالي للشواء أو الطهي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb4/h56/11892376829982/441920_main.jpg?im=Resize=400",
    ],
    price: 30.95,
  },
  {
    name: "لحم بقري روست مبرد نيوزلندي (للكيلو)",
    description:
      "لحم بقر روست مبرد من نيوزيلندا، مثالي للشواء أو الفرن. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h67/h01/11892377223198/449484_main.jpg?im=Resize=400",
    ],
    price: 39.95,
  },
  {
    name: "لحم بقري مكعبات توب سايد طازج نيوزلندي (للكيلو)",
    description:
      "مكعبات لحم بقر توب سايد طازج من نيوزيلندا، مثالية للطبخ. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he6/h0c/11892377681950/584175_main.jpg?im=Resize=400",
    ],
    price: 31.45,
  },
  {
    name: "لحم بقري مكعبات مبرد نيوزلندي (للكيلو)",
    description:
      "مكعبات لحم بقر مبرد من نيوزيلندا، مثالية للطهي السريع. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hf0/h68/11892378271774/441841_main.jpg?im=Resize=400",
    ],
    price: 28.95,
  },
  {
    name: "شرائح فخذ خروف مبرد أسترالي",
    description:
      "شرائح فخذ خروف مبرد من أستراليا، مثالية للشواء أو القلي. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h16/h06/11892377485342/5102_main.jpg?im=Resize=400",
    ],
    price: 187.25,
  },
  {
    name: "أرجل خروف طازجة",
    description:
      "أرجل خروف طازجة محلية، مثالية لتحضير الأطباق التقليدية. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hbf/h2c/51859831226398/5267_main.jpg?im=Resize=400",
    ],
    price: 14.95,
  },
  {
    name: "لحم بقري ستربلوين مبرد نيوزلندي (للكيلو)",
    description:
      "لحم بقر ستريبلوين مبرد من نيوزيلندا، مثالي للشواء الفاخر. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h4c/h80/11892378927134/441836_main.jpg?im=Resize=400",
    ],
    price: 54.95,
  },
  {
    name: "شيش طاووق - بنكهة الثوم",
    description: "شيش طاووق متبل بنكهة الثوم، جاهز للشواء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hfe/hda/15846371786782/634137_main.jpg?im=Resize=400",
    ],
    price: 22.95,
  },
  {
    name: "نصف دجاجة مع تتبيلة الباربيكيو",
    description:
      "نصف دجاجة متبلة بنكهة الباربيكيو، جاهزة للشواء أو الطهي. يُباع بالقطعة.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h2b/h17/61776225763358/634139_main.jpg?im=Resize=400",
    ],
    price: 14.9,
  },
  {
    name: "شيش طاووق حار",
    description: "شيش طاووق متبل بنكهة حارة، جاهز للشواء. يُباع بالكيلو.",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h6f/hd0/15846371459102/634135_main.jpg?im=Resize=400",
    ],
    price: 22.95,
  },
  {
    name: "نصف دجاجة مع تتبيلة حارة",
    description:
      "نصف دجاجة متبلة بنكهة حارة، جاهزة للشواء أو الطهي. يُباع بالقطعة.",
    images: [
      "https://cdn.mafrservices.com/pim-content/SAU/media/product/634138/1733314203/634138_main.jpg?im=Resize=400",
    ],
    price: 14.9,
  },
];
// .map((item) => {
//   const { url, ...newItem } = item;
//   return newItem;
// });
seedProducts(electronicsCategoryId, sampleProducts);
