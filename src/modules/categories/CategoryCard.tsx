import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/configs/routes";
import type { ICategory } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  category: ICategory;
}

const CategoryCard = ({ category }: Props) => {
  return (
    <div className="relative w-[250px] h-[280px] rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Image container with gradient overlay */}
      <div className="absolute inset-0 w-full h-[65%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-800 z-10 opacity-70" />
        <Image
          src={category.images || "/placeholder.svg"}
          alt={category.name}
          width={250}
          height={180}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content container */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-primary dark:text-white mb-1 line-clamp-1">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {category.products.length} منتج
          </p>
        </div>

        <Button
          variant="default"
          className={cn(
            "w-full rounded-xl transition-all duration-300",
            "bg-primary/90 hover:bg-primary",
            "flex items-center justify-between"
          )}
        >
          <Link
            href={`${ROUTES.PRODUCT}?category=${category.id}`}
            className="w-full flex items-center justify-between"
          >
            <span>تسوق الان</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </Button>
      </div>

      {/* Decorative element */}
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default CategoryCard;
