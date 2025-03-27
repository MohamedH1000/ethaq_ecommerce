"use client";
import ClientOnly from "@/components/common/shared/ClientOnly";
import SkelatonLoader from "@/components/skelaton/SkelatonLoader";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import CategoryCard from "./CategoryCard";
import { getCategories } from "@/lib/actions/category.action";

const CategoriesCarousel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  console.log("all categories", allCategories);
  useEffect(() => {
    setIsLoading(true);
    const fetchCategories = async () => {
      try {
        const allCategories: any = await getCategories();
        setAllCategories(allCategories);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <React.Fragment>
      {isLoading ? (
        <ClientOnly>
          <SkelatonLoader />
        </ClientOnly>
      ) : (
        <Swiper
          slidesPerView="auto"
          spaceBetween={11}
          // modules={[Autoplay]}
          // autoplay={{ delay: 5000, disableOnInteraction: false }}

          loop={true}
          className="mySwiper"
        >
          {allCategories?.map((d: any) => {
            return (
              <SwiperSlide
                key={d.id}
                className="flex flex-col xs:gap-[14px] gap-2 max-w-[170px]  rounded-lg"
              >
                <CategoryCard category={d} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </React.Fragment>
  );
};

export default CategoriesCarousel;
