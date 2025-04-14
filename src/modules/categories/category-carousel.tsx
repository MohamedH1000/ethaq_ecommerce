"use client";
import ClientOnly from "@/components/common/shared/ClientOnly";
import SkelatonLoader from "@/components/skelaton/SkelatonLoader";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import CategoryCard from "./CategoryCard";
import { getCategories } from "@/lib/actions/category.action";

const CategoriesCarousel = ({ allCategories }: any) => {
  const [isLoading, setIsLoading] = useState(false);

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
                className="flex flex-col xs:gap-[14px] gap-2 max-w-[250px]  rounded-lg"
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
