"use client";
import ProductCard from "@/components/cards/ProductCard";
import { ProductsFilters } from "@/components/shop/products-filter";
import SearchTopBar from "@/components/shop/top-bar";
import ProductFeedLoader from "@/components/skelaton/product-feed-loader";
import Breadcrumb from "@/components/ui/breadcrumb";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
export const dynamic = "force-dynamic"; // Will prevent static export

type Props = {
  searchParams: {
    category?: string;
    price?: string;
  };
};
const ProductsPage = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Or loading state

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;
  const params: any = useSearchParams();
  const categoryId = params.get("category");
  // console.log(products, "products");
  const fetchProducts = async (currentPage: number) => {
    setIsLoading(true);
    try {
      let url = `/api/products?page=${currentPage}&limit=${limit}`;
      if (categoryId) {
        url += `&category=${categoryId}`;
      }

      const res = await fetch(url, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      // console.log("Fetched data:", data);
      setProducts(data.products || []);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <Suspense fallback={<div>Loading search params...</div>}>
      <div>
        <section className="h-12 py-10 bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
          <Breadcrumb />
        </section>
        <div className="container py-5 overflow-hidden">
          <div className="flex pt-8 pb-16 lg:pb-20">
            <div className="flex-shrink-0 pr-20 hidden lg:block w-96 pt-1 px-3 h-full border-r">
              <ProductsFilters />
            </div>
            <div className="w-full ">
              <SearchTopBar />
              <section className="w-full">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 md:gap-4 2xl:gap-5 w-[95%] max-md:w-full">
                  {isLoading ? (
                    <ProductFeedLoader limit={12} uniqueKey="search-product" />
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} {...{ product }} />
                    ))
                  ) : (
                    <p>لا يوجد منتجات لعرضها</p>
                  )}
                </div>
                {totalPages > 0 && (
                  <div className="flex items-center justify-between border-t border-border border-opacity-70 mt-6 py-4">
                    <div className="text-xs text-body text-opacity-70">
                      صفحة {page} من {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        السابق
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded ${
                              page === pageNum
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        القادم
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ProductsPage;
