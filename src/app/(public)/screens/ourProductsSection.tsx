import ProductCard from "@/components/cards/ProductCard";
import { getSomeProducts } from "@/lib/actions/product.action";
import { getCurrentUser } from "@/lib/actions/user.action";

const OurProductsSection = async ({ type }: any) => {
  const products = await getSomeProducts(type);
  const user = await getCurrentUser();
  return (
    <section className="py-5 md:py-10  container">
      <div className="flex flex-col items-start mb-10 group">
        <h1 className="text-3xl md:text-4xl font-bold font-tajawal text-gray-800 dark:text-white relative">
          {type === "offers" ? "خصومات حصرية" : "احدث المنتجات"}
          <span className="absolute bottom-0 right-0 w-0 h-1 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {type === "offers"
            ? "عروض محدودة لفترة قصيرة"
            : "أجود المنتجات المختارة بعناية"}
        </p>
      </div>

      <div className="py-4  border-t-2 mt-3" />
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-7 md:gap-4 2xl:gap-5">
        <>
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              user={user}
              {...{ product }}
              type={"offers"}
            />
          ))}
        </>
      </div>
    </section>
  );
};

export default OurProductsSection;
