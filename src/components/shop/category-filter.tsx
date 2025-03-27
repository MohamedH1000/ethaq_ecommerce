import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export const CategoryFilter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
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

  // Handle checkbox changes
  const handleItemClick = (name: string) => {
    setFormState((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  // Update the URL with selected categories
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (formState.length > 0) {
      params.set("categories", formState.join(","));
    } else {
      params.delete("categories");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [formState, pathname, router, searchParams]);

  // Fetch filtered data based on URL parameters
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const selectedCategories =
          searchParams.get("categories")?.split(",") || [];

        const response = await fetch(
          `/api/data?categories=${selectedCategories.join(",")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch filtered data");
        }

        const data = await response.json();
        console.log("Filtered data:", data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    fetchFilteredData();
  }, [searchParams]);

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <div className="text-gray-900 dark:text-white text-sm md:text-base font-semibold mb-7 ">
        <h6>الفئات</h6>
        <div className="border-b border-primary w-[85px] mt-1" />
      </div>
      <div className="mt-2 flex flex-col space-y-4">
        {categories?.map((item: any) => (
          <div key={item.name} className="flex items-center space-x-3">
            <Checkbox
              name={item.name.toLowerCase()}
              checked={formState.includes(item.name)}
              value={item.name}
              onCheckedChange={() => handleItemClick(item.name)}
            />
            <Label>{item.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
