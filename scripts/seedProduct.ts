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
    const createdProducts = await prisma.$transaction(
      products.map((product) =>
        prisma.product.create({
          //@ts-ignore
          data: {
            ...product,
            category: {
              connect: { id: categoryId },
            },
          },
        })
      )
    );

    console.log(`✅ Successfully created ${createdProducts.length} products`);
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
const electronicsCategoryId = "67e47178b9ff67ae7d25f77b"; // Replace with actual category ID

const sampleProducts: ProductData[] = [
  {
    name: "طماطم",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hec/hb9/12624678027294/78493_main.jpg?im=Resize=400",
    ],
    price: 2.95,
    description:
      "طماطم طازجة ومختارة بعناية، تتميز بلونها الأحمر الزاهي وطعمها العصيري. مثالية لتحضير السلطات، الصلصات، أو كإضافة لأطباقك المفضلة. جودة عالية بأفضل سعر!",
  },
  {
    name: "كيس بصل أحمر متوسط طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h44/h02/9169836015646/78731_main.jpg?im=Resize=400",
    ],
    price: 10.95,
    description:
      "كيس بصل أحمر طازج متوسط الحجم، يتميز بنكهته القوية ولونه الجذاب. مثالي لتحضير السلطات أو إضافته إلى الأطباق المطهية. اختيار اقتصادي لمطبخك اليومي!",
  },
  {
    name: "فطر ابيض محلي - عبوة 250 جرام",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he4/h75/9169830248478/78567_main.jpg?im=Resize=400",
    ],
    price: 7.7,
    description:
      "فطر أبيض محلي طازج (250 جرام)، يتميز بملمسه الطري ونكهته الرقيقة. مثالي لتحضير الشوربات، البيتزا، أو كإضافة لأطباقك المفضلة. جودة محلية مضمونة!",
  },
  {
    name: "جزر مستورد طازج - خضروات جذرية حلوة كاملة",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h44/hff/9216714768414/78636_main.jpg?im=Resize=400",
    ],
    price: 2.73,
    description:
      "جزر مستورد طازج، يتميز بحلاوته الطبيعية ولونه البرتقالي الزاهي. مثالي لتحضير السلطات، العصائر، أو كوجبة خفيفة صحية. اختيار غني بالفيتامينات!",
  },
  {
    name: "بصل أبيض",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h83/h26/9191059324958/78737_main.jpg?im=Resize=400",
    ],
    price: 2.73,
    description:
      "بصل أبيض طازج، يتميز بنكهته الحادة وملمسه المقرمش. مثالي لتحضير الأطباق المطهية، الشوربات، أو كإضافة للسلطات. أساسي في كل مطبخ بجودة عالية!",
  },
  {
    name: "بطاطس، كيس وسط 1.6 إلى 1.8 كج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he2/h78/9169830182942/78683_main.jpg?im=Resize=400",
    ],
    price: 5.45,
    description:
      "كيس بطاطس طازجة (1.6 إلى 1.8 كجم)، مثالية لتحضير البطاطس المقلية، المشوية، أو المهروسة. تتميز بجودتها العالية وطعمها اللذيذ. اختيار اقتصادي لكل العائلة!",
  },
  {
    name: "خس آيسبيرغ",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h89/h1e/63026598019102/78511_main.jpg?im=Resize=400",
    ],
    price: 7.7,
    description:
      "خس آيسبيرغ طازج، يتميز بأوراقه المقرمشة ونكهته المنعشة. مثالي لتحضير السلطات أو كإضافة للساندويتشات. اختيار صحي يضيف لمسة من الانتعاش لوجباتك!",
  },
  {
    name: "جزر سعودي طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h1e/hf5/9216714473502/78635_main.jpg?im=Resize=400",
    ],
    price: 5.95,
    description:
      "جزر سعودي طازج، يتميز بحلاوته الطبيعية وجودته المحلية. مثالي لتحضير السلطات، العصائر، أو كوجبة خفيفة صحية. جزر غني بالفيتامينات من مزارع المملكة!",
  },
  {
    name: "باذنجان كبير",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h54/h90/9216715948062/78458_main.jpg?im=Resize=400",
    ],
    price: 2.95,
    description:
      "باذنجان كبير طازج، يتميز بملمسه الطري ولونه الأرجواني اللامع. مثالي لتحضير المقليات، المشويات، أو أطباق الباذنجان التقليدية. اختيار مثالي لمحبي الخضروات!",
  },
  {
    name: "بصل أحمر",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h6a/h1b/9452360630302/78735_main.jpg?im=Resize=400",
    ],
    price: 7.95,
    description:
      "بصل أحمر طازج، يتميز بنكهته القوية ولونه الجذاب. مثالي لتحضير السلطات، المخللات، أو كإضافة للأطباق المطهية. أضف لمسة من النكهة واللون لوجباتك!",
  },
  {
    name: "فلفل رومي (فليفلة) أحمر طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h2d/hfb/9216714604574/78436_main.jpg?im=Resize=400",
    ],
    price: 13.45,
    description:
      "فلفل رومي أحمر طازج، يتميز بلونه الزاهي وحلاوته الطبيعية. مثالي لتحضير السلطات، المحاشي، أو كإضافة للأطباق المشوية. اختيار صحي ومليء بالفيتامينات!",
  },
  {
    name: "كوسا",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/he2/h9d/9216715554846/78497_main.jpg?im=Resize=400",
    ],
    price: 5.95,
    description:
      "كوسا طازجة، تتميز بملمسها الطري ونكهتها الخفيفة. مثالية لتحضير المحاشي، الشوربات، أو كإضافة للأطباق المشوية. خضار صحي ومتعدد الاستخدامات!",
  },
  {
    name: "خس روماني",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h89/h4c/9180053340190/78506_main.jpg?im=Resize=400",
    ],
    price: 2.48,
    description:
      "خس روماني طازج، يتميز بأوراقه الخضراء المقرمشة ونكهته المنعشة. مثالي لتحضير السلطات أو كإضافة للساندويتشات. اختيار صحي بأفضل سعر!",
  },
  {
    name: "بطاطس طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/had/h95/9216713785374/78680_main.jpg?im=Resize=400",
    ],
    price: 2.5,
    description:
      "بطاطس طازجة، مثالية لتحضير البطاطس المقلية، المشوية، أو المهروسة. تتميز بجودتها العالية وطعمها اللذيذ. أساسي في كل مطبخ بأفضل سعر!",
  },
  {
    name: "فلفل رومي (فليفلة) أخضر طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb2/ha4/9216715358238/78424_main.jpg?im=Resize=400",
    ],
    price: 8.95,
    description:
      "فلفل رومي أخضر طازج، يتميز بنكهته المنعشة وملمسه المقرمش. مثالي لتحضير السلطات، المحاشي، أو كإضافة للأطباق المطهية. اختيار صحي ومليء بالنكهة!",
  },
  {
    name: "طماطم طازجة مختارة",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd7/hae/9216715063326/78461_main.jpg?im=Resize=400",
    ],
    price: 6.7,
    description:
      "طماطم طازجة مختارة بعناية، تتميز بطعمها العصيري ولونها الأحمر اللامع. مثالية لتحضير الصلصات، السلطات، أو كإضافة لأطباقك المفضلة. جودة مضمونة!",
  },
  {
    name: "خيار",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h6f/hab/9216715161630/78541_main.jpg?im=Resize=400",
    ],
    price: 2.75,
    description:
      "خيار طازج، يتميز بملمسه المقرمش ونكهته المنعشة. مثالي لتحضير السلطات، الساندويتشات، أو كوجبة خفيفة صحية. اختيار منعش بأفضل سعر!",
  },
  {
    name: "بروكلي طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h0f/h5b/9180037546014/78620_main.jpg?im=Resize=400",
    ],
    price: 6.52,
    description:
      "بروكلي طازج، يتميز بلونه الأخضر الزاهي وفوائده الصحية العديدة. مثالي لتحضير السلطات، الشوربات، أو كإضافة للأطباق المطهية. خضار صحي وغني بالفيتامينات!",
  },
  {
    name: "بصل ذهبي",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hb2/h8c/9191058440222/78727_main.jpg?im=Resize=400",
    ],
    price: 6.7,
    description:
      "بصل ذهبي طازج، يتميز بنكهته العطرية ولونه الذهبي اللامع. مثالي لتحضير الأطباق المطهية، الشوربات، أو كإضافة للسلطات. أساسي في كل مطبخ!",
  },
  {
    name: "ثوم كيس 300 جرام",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/heb/h67/9169832542238/78714_main.jpg?im=Resize=400",
    ],
    price: 3.2,
    description:
      "كيس ثوم طازج (300 جرام)، يتميز بنكهته القوية وفوائده الصحية. مثالي لإضافته إلى الأطباق المطهية، الصلصات، أو التتبيلات. اختيار اقتصادي بجودة عالية!",
  },
  {
    name: "ملفوف ابيض طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/haa/h4d/9193843752990/78632_main.jpg?im=Resize=400",
    ],
    price: 6.4,
    description:
      "ملفوف أبيض طازج، يتميز بأوراقه المقرمشة ونكهته الخفيفة. مثالي لتحضير السلطات، المحاشي، أو كإضافة للأطباق المطهية. خضار صحي ومتعدد الاستخدامات!",
  },
  {
    name: "رمان - الهند",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h6f/hca/11622415368222/404935_main.jpg?im=Resize=400",
    ],
    price: 10.97,
    description:
      "رمان هندي طازج، يتميز بحباته العصيرية وحلاوته الطبيعية. مثالي كوجبة خفيفة، لتحضير العصائر، أو كإضافة للسلطات. اختيار غني بالفيتامينات والمذاق!",
  },
  {
    name: "زنجبيل صيني",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h77/h5e/9180037644318/78720_main.jpg?im=Resize=400",
    ],
    price: 2.74,
    description:
      "زنجبيل صيني طازج، يتميز بنكهته الحارة وفوائده الصحية. مثالي لإضافته إلى الشاي، التتبيلات، أو الأطباق الآسيوية. اختيار صحي بأفضل سعر!",
  },
  {
    name: "زهرة طازجة",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h8a/h69/63026597920798/78650_main.jpg?im=Resize=400",
    ],
    price: 6.7,
    description:
      "زهرة طازجة (قرنبيط)، تتميز بملمسها الطري ونكهتها الخفيفة. مثالية لتحضير المقليات، الشوربات، أو كإضافة للأطباق المشوية. خضار صحي وغني بالفوائد!",
  },
  {
    name: "بطاطس حلوة",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h66/h5b/9180037578782/78699_main.jpg?im=Resize=400",
    ],
    price: 4.45,
    description:
      "بطاطس حلوة طازجة، تتميز بحلاوتها الطبيعية ولونها البرتقالي الزاهي. مثالية لتحضير المشويات، المهروس، أو كوجبة خفيفة صحية. اختيار غني بالفيتامينات!",
  },
  {
    name: "شمندر (بنجر)",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h72/h06/9452357648414/78792_main.jpg?im=Resize=400",
    ],
    price: 2.23,
    description:
      "شمندر (بنجر) طازج، يتميز بلونه الأحمر العميق وفوائده الصحية. مثالي لتحضير السلطات، العصائر، أو كإضافة للأطباق. خضار صحي بأفضل سعر!",
  },
  {
    name: "فلفل أخضر حار",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hee/h10/9452357320734/78444_main.jpg?im=Resize=400",
    ],
    price: 1.68,
    description:
      "فلفل أخضر حار طازج، يتميز بنكهته الحارة وملمسه المقرمش. مثالي لإضافته إلى الأطباق المطهية، التتبيلات، أو المخللات. أضف لمسة من الحرارة لوجباتك!",
  },
  {
    name: "طبق كوسا 1كج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h78/h23/9181587701790/78498_main.jpg?im=Resize=400",
    ],
    price: 12.45,
    description:
      "طبق كوسا طازجة (1 كجم)، تتميز بملمسها الطري ونكهتها الخفيفة. مثالية لتحضير المحاشي، الشوربات، أو كإضافة للأطباق المشوية. خضار صحي بجودة عالية!",
  },
  {
    name: "طماطم محلي صندوق فلين 900 جرام",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h5c/he0/11148279218206/78490_main.jpg?im=Resize=400",
    ],
    price: 16.45,
    description:
      "طماطم محلية طازجة في صندوق فلين (900 جرام)، تتميز بطعمها العصيري وجودتها المحلية. مثالية لتحضير الصلصات، السلطات، أو الأطباق اليومية. اختيار عائلي مثالي!",
  },
  {
    name: "فطر بني محلي 250 جرام",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h10/hf8/9191256686622/613253_main.jpg?im=Resize=400",
    ],
    price: 10.95,
    description:
      "فطر بني محلي طازج (250 جرام)، يتميز بنكهته الغنية وملمسه الطري. مثالي لتحضير البيتزا، الشوربات، أو كإضافة للأطباق المطهية. جودة محلية بطعم مميز!",
  },
  {
    name: "فلفل بارد برتقالي",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hc5/h94/14379755831326/78432_main.jpg?im=Resize=400",
    ],
    price: 5.47,
    description:
      "فلفل بارد برتقالي طازج، يتميز بلونه الزاهي وحلاوته الطبيعية. مثالي لتحضير السلطات، المحاشي، أو كإضافة للأطباق المشوية. اختيار صحي ومليء بالفيتامينات!",
  },
  {
    name: "كرفس طازج",
    images: [
      "https://cdn.mafrservices.com/sys-master-root/h5e/h44/9452361351198/78655_main.jpg?im=Resize=400",
    ],
    price: 2.73,
    description:
      "كرفس طازج، يتميز بملمسه المقرمش ونكهته المنعشة. مثالي لتحضير السلطات، العصائر، أو كوجبة خفيفة صحية. خضار غني بالفوائد بأفضل سعر!",
  },
];

seedProducts(electronicsCategoryId, sampleProducts);
