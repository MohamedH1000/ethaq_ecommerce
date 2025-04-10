// components/PerfumeBanner.js
import Image from "next/image";

const PerfumeBanner = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/path-to-your-background-image.jpg')", // Replace with your background image path
        }}
      >
        {/* Gradient Overlay (optional, to match the image's look) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}

        {/* Perfume Bottles */}
        <div className="flex space-x-4 md:space-x-6 lg:space-x-8 mb-4">
          <div className="flex flex-col items-center">
            <Image
              src="/assets/banner1.png" // Replace with your perfume image
              alt="banner 1"
              width={100}
              height={200}
              className="object-contain"
            />
            {/* <p className="text-white text-sm md:text-base mt-2">عود</p> */}
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/assets/banner2.png"
              alt="banner 2"
              width={100}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/assets/banner3.png"
              alt="banner 3"
              width={100}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/assets/banner4.png"
              alt="banner 4"
              width={100}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/assets/banner5.png"
              alt="banner 5"
              width={100}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/assets/banner6.png"
              alt="banner 6"
              width={100}
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        {/* Arabic Text */}
        <p className="text-white text-lg md:text-xl lg:text-2xl text-right">
          أروع العطور من مزارع الورد الطائفية
        </p>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-4 flex space-x-2">
        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
      </div>
    </div>
  );
};

export default PerfumeBanner;
