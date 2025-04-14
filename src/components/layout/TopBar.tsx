"use client";
import { PhoneIcon } from "lucide-react";
import React from "react";

const TopBar = () => {
  return (
    <section
      className="bg-[#000957] dark:bg-[#e11d48] 
   py-3 overflow-hidden"
    >
      {" "}
      {/* Lighter color */}
      <div className="container">
        <div className="flex items-center text-md text-white gap-2 animate-marquee whitespace-nowrap">
          <span>
            {" "}
            🛒 اشترِ الآن وادفع لاحقًا مع ايثاق مارت – تسوق بدون قلق!
          </span>
          <span>
            {" "}
            🚚 توصيل سريع وآمن لجميع الطلبات – اطلب الآن من لايثاق مارت!
          </span>
          <span> 🎁 عروض وخصومات يومية بانتظارك – لا تفوّتها!</span>
          <span> 🧼 منتجات منزلية وبقالة طازجة بأسعار منافسة!</span>
        </div>
      </div>
      {/* Add this to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TopBar;
