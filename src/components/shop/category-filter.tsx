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
  const [formState, setFormState] = useState<string[]>([]);

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
    const urlCategories = params.get("category")?.split(",") || [];
    setFormState(urlCategories);
  }, [searchParams]);

  // Handle checkbox changes
  const handleItemClick = (identifier: string) => {
    setFormState((prev) =>
      prev.includes(identifier)
        ? prev.filter((item) => item !== identifier)
        : [...prev, identifier]
    );
  };

  // Update the URL with selected categories
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (formState.length > 0) {
      params.set("category", formState.join(","));
    } else {
      params.delete("category");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [formState, pathname, router, searchParams]);

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
              checked={
                formState.includes(item.id) || formState.includes(item.name)
              }
              onCheckedChange={() => handleItemClick(item.id)} // Or item.name depending on your API
            />
            <Label htmlFor={`category-${item.id}`}>{item.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
