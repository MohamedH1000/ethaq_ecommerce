import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export const CategoryFilter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Track only one selected category
  // Function to fetch categories with a limit of 10
  const getCategories = async () => {
    try {
      const response = await fetch("/api/categories?limit=10", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.slice(0, 10)); // Ensure we only take 10 items
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Set empty array on error
    }
  };

  // Fetch categories when component mounts
  useEffect(() => {
    getCategories();
  }, []);

  // Initialize form state from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const urlCategory = params.get("category") || "";
    setSelectedCategory(urlCategory);
  }, [searchParams]);

  // Handle checkbox changes
  const handleItemClick = (identifier: string) => {
    setSelectedCategory((prev) => (prev === identifier ? "" : identifier));
  };

  // Update the URL with selected categories
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedCategory, pathname, router, searchParams]);

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <div className="text-gray-900 dark:text-white text-sm md:text-base font-semibold mb-7 ">
        <h6>الفئات</h6>
        <div className="border-b border-primary w-[85px] mt-1" />
      </div>
      <div className="mt-2 flex flex-col space-y-4">
        {categories?.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Checkbox
              id={`category-${item.id}`}
              checked={selectedCategory === item.id} // Only true if this item is selected
              onCheckedChange={() => handleItemClick(item.id)}
            />
            <Label htmlFor={`category-${item.id}`}>{item.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
