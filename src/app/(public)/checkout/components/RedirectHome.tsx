"use client";
import { useRouter } from "next/navigation";
import React from "react";

const RedirectHome = () => {
  const router = useRouter();
  return (
    <button
      className="w-full mt-4 bg-primary text-white p-4 rounded-lg font-bold text-md"
      onClick={() => router.push("/")}
    >
      الرجوع للصفحة الرئيسية
    </button>
  );
};

export default RedirectHome;
