"use client";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import SearchBox from "./search-box";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icons } from "../icons";

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
}

interface Props {
  label: string;
  variant?: "minimal" | "normal" | "with-shadow" | "flat";
  [key: string]: unknown;
}

const Search: React.FC<Props> = ({ label, variant, ...props }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();
  // console.log("searchResults", searchResults);
  // console.log("searchTerm", searchTerm);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when debounced term changes
  useEffect(() => {
    if (debouncedTerm === undefined) return;

    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      text: debouncedTerm || undefined, // Remove key if empty
    };

    const url = qs.stringifyUrl(
      { url: "/", query: updatedQuery },
      { skipNull: true }
    );

    router.push(url, { scroll: false });
  }, [debouncedTerm, params, router]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedTerm) {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?query=${debouncedTerm}&page=${currentPage}&limit=6`
        );
        const data = await response.json();
        setSearchResults(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedTerm, currentPage]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setDebouncedTerm(""); // This will trigger URL update to remove the search param
  };

  return (
    <div className=" w-full" ref={searchContainerRef}>
      <SearchBox
        label={label}
        onSubmit={(e) => e.preventDefault()}
        onClearSearch={clearSearch}
        onChange={handleOnChange}
        value={searchTerm}
        name="search"
        placeholder=""
        variant={variant}
        {...props}
      />

      {/* Search Results Dropdown */}
      {searchTerm && (
        <div
          className="absolute left-auto max-sm:!left-[50px] 
        top-15 z-50 mt-1 max-h-96 overflow-y-auto 
        rounded-lg border border-gray-200 bg-white 
        shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4 w-[600px] max-sm:w-[250px]">
              <Icons.spinner className="h-5 w-5 animate-spin" />
            </div>
          ) : searchResults?.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setSearchResults([]);
                      }} // Close dropdown when product is selected
                    >
                      <img
                        src={product?.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <span className="truncate">{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 p-3 dark:border-gray-700">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded px-3 py-1 disabled:opacity-50"
                  >
                    السابق
                  </button>
                  <span>
                    الصفحة {currentPage} من {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded px-3 py-1 disabled:opacity-50"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 w-[600px] max-sm:w-[250px]">
              لا توجد نتائج
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
