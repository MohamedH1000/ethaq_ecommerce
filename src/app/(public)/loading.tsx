/* eslint-disable @next/next/no-img-element */
import { Icons } from "@/components/ui/icons";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Simulated Banner Carousel Loading */}
      <div className="w-full h-[400px] bg-gray-100 animate-pulse max-sm:h-[200px]">
        <div className="flex items-center justify-center h-full">
          <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>

      {/* Simulated Categories Section */}
      <div className="py-5 md:py-10 container mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4 overflow-hidden py-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Simulated Products Section */}
      <div className="container py-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 relative animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.spinner className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Promo Carousel */}
      <div className="h-[200px] bg-gray-100 my-8 animate-pulse flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin text-gray-400" />
      </div>

      {/* Simulated Second Products Section */}
      <div className="container py-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 relative animate-pulse"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
