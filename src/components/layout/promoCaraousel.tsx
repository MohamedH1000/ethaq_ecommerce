// components/PromoCarousel.jsx
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

// Sample data (extended for better looping demonstration)
const promoItems = [
  {
    id: 1,
    image: "/assets/category1.png",
    alt: "Promo 1",
    categoryId: "67e470ecb9ff67ae7d25f779",
  },
  {
    id: 2,
    image: "/assets/category2.png",
    alt: "Promo 2",
    categoryId: "67f68fcc279409a453604d33",
  },
  {
    id: 3,
    image: "/assets/category3.png",
    alt: "Promo 3",
    categoryId: "67f43eb349e57d3fa16aa152",
  },
  {
    id: 4,
    image: "/assets/category4.png",
    alt: "Promo 4",
    categoryId: "67e47116b9ff67ae7d25f77a",
  },
  {
    id: 5,
    image: "/assets/category5.png",
    alt: "Promo 5",
    categoryId: "67f80092a55079d73926dca4",
  },
];

const PromoCarousel = () => {
  const scrollRef = useRef(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const router = useRouter();
  // Infinite scroll handling
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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full py-8">
      {/* Header */}
      {/* <h2 className="text-right text-2xl font-bold mb-6 pr-4 text-gray-800">
        أفضل العروض الحصرية
      </h2> */}

      {/* Carousel Container */}
      <div className="relative px-12">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg z-10 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-6 scrollbar-hide snap-x snap-mandatory"
        >
          {/* Duplicate items at start and end for infinite loop */}
          {[
            ...promoItems.slice(-2),
            ...promoItems,
            ...promoItems.slice(0, 2),
          ].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-full max-w-[300px] h-[450px] rounded-xl 
              overflow-hidden flex-shrink-0 snap-center shadow-md 
              hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                router.push(`products?category=${item.categoryId}`)
              }
            >
              <Image
                src={item.image}
                alt={item.alt}
                width={300}
                height={350}
                className="w-full h-full object-center"
                priority={index < 3} // Preload first few images
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg z-10 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Controls */}
      {/* <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {isAutoPlaying ? "Pause" : "Play"}
        </button>
      </div> */}

      {/* Enhanced Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PromoCarousel;
