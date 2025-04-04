import { ProductsFilters } from "@/components/shop/products-filter";
import SearchTopBar from "@/components/shop/top-bar";
import Breadcrumb from "@/components/ui/breadcrumb";
import Products from "./components/Products";
import { Suspense } from "react";
import { Loader } from "lucide-react";

const ProductsPage = () => {
  return (
    <div>
      <section className="h-12 py-10 bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <Breadcrumb />
      </section>

      <div className="container py-5 overflow-hidden">
        <div className="flex pt-8 pb-16 lg:pb-20">
          <div className="flex-shrink-0 pr-20 hidden lg:block w-96 pt-1 px-3 h-full border-r">
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  تحميل المصفيات... <Loader className="animate-spin" />
                </div>
              }
            >
              <ProductsFilters />
            </Suspense>
          </div>

          <div className="w-full">
            <SearchTopBar />
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  تحميل المنتجات... <Loader className="animate-spin" />
                </div>
              }
            >
              <Products />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
