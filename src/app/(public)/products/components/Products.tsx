"use client";
import ProductCard from "@/components/cards/ProductCard";
import ProductFeedLoader from "@/components/skelaton/product-feed-loader";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@prisma/client";

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;

  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category") || null;
  const priceRange = searchParams?.get("price") || null;

  const fetchProducts = async (currentPage: number) => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", limit.toString());

      if (categoryId) {
        params.set("category", categoryId);
      }

      if (priceRange) {
        params.set("price", priceRange);
      }

      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [categoryId, priceRange]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, categoryId, priceRange]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 md:gap-4 2xl:gap-5 w-[95%] max-md:w-full">
        {isLoading ? (
          <ProductFeedLoader limit={12} uniqueKey="search-product" />
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center py-10">
            لا يوجد منتجات لعرضها
          </p>
        )}
      </div>

      {totalPages > 1 && (
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

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    page === pageNum ? "bg-primary text-white" : "bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

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
  );
};

export default Products;
