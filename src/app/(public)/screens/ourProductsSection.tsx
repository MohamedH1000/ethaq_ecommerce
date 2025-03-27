import ProductCard from "@/components/cards/ProductCard";
import ProductFeedLoader from "@/components/skelaton/product-feed-loader";
import { getSomeProducts } from "@/lib/actions/product.action";

const OurProductsSection = async () => {
  const products = await getSomeProducts();
  return (
    <section className="py-5 md:py-10  container">
      <div className="flex items-center ">
        <h1 className="text-3xl font-bold font-sans ">منتجاتنا</h1>
      </div>

      <div className="py-4  border-t-2 mt-3" />
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-7 md:gap-4 2xl:gap-5">
        <>
          {products?.map((product) => (
            <ProductCard key={product.id} {...{ product }} />
          ))}
        </>
      </div>
    </section>
  );
};

export default OurProductsSection;
