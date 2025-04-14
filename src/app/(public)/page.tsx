/* eslint-disable @next/next/no-img-element */

import CategoriesCarousel from "@/modules/categories/category-carousel";
import Image from "next/image";
import Link from "next/link";
import OurProductsSection from "./screens/ourProductsSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import PromoCarousel from "@/components/layout/promoCaraousel";
import PerfumeBanner from "@/components/layout/perfumeBanner";
import BannerCarousel from "@/components/layout/BannerCaraousel";
import { getCategories } from "@/lib/actions/category.action";

export default async function IndexPage() {
  const bannerImages = [
    "/assets/90.png", // Add your other images
    "/assets/901.png",
    "/assets/902.png",
    "/assets/903.png",
  ];
  const allCategories: any = await getCategories();

  return (
    <div className="">
      <Carousel className="w-full">
        <CarouselContent className="flex flex-row-reverse">
          {bannerImages.map((img, index) => (
            <CarouselItem key={index}>
              <Image
                width={1920}
                height={500}
                src={img}
                alt={`Banner ${index + 1}`}
                className="w-full h-auto max-sm:h-[200px]"
                priority={index === 0} // Only prioritize first image
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* <div className="py-10 container">
        <div className="overflow-hidden">
          <PromotionalBannerCarousel />
        </div>
      </div> */}
      <div className="py-5 md:py-10  container mt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-sans ">التسوق بالفئات</h1>
          <Link href={"/products"}>جميع الفئات</Link>
        </div>
      </div>
      <div className="py-4  border-t-2 mt-3">
        <CategoriesCarousel allCategories={allCategories} />
      </div>
      <OurProductsSection type={"offers"} />
      <div>
        <PromoCarousel />
      </div>

      <OurProductsSection />

      <div>
        <BannerCarousel />
      </div>

      {/* <TopRateProducts /> */}
    </div>
  );
}
