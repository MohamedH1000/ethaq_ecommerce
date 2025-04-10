"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Item } from "@radix-ui/react-dropdown-menu";

const promoItems = [
  {
    id: 1,
    image: "/assets/banner1.png",
    alt: "Promo 1",
  },
  {
    id: 2,
    image: "/assets/banner2.png",
    alt: "Promo 2",
  },
  {
    id: 3,
    image: "/assets/banner3.png",
    alt: "Promo 3",
  },
  {
    id: 4,
    image: "/assets/banner4.png",
    alt: "Promo 4",
  },
  {
    id: 5,
    image: "/assets/banner5.png",
    alt: "Promo 5",
  },
  {
    id: 6,
    image: "/assets/banner6.png",
    alt: "Promo 6",
  },
];

const BannerCarousel = () => {
  const scrollRef = useRef(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    if (scrollLeft === 0) {
      scrollRef.current.scrollTo({
        left: scrollWidth - clientWidth * 2,
        behavior: "instant",
      });
    } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
      scrollRef.current.scrollTo({
        left: clientWidth,
        behavior: "instant",
      });
    }
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        // Scroll by exactly one item's width
        scrollRef.current.scrollBy({
          left: scrollRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <Carousel className="w-[90%]  mx-auto mt-10">
      <CarouselContent className="flex flex-row-reverse">
        {promoItems.map((img, index) => (
          <CarouselItem key={index}>
            <Image
              width={1920}
              height={500}
              src={img.image}
              alt={`Banner ${index + 1}`}
              className="w-full h-auto max-sm:h-[200px] rounded-3xl"
              priority={index === 0} // Only prioritize first image
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default BannerCarousel;
