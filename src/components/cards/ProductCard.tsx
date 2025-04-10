"use client";
import usePrice from "@/hooks/use-price";
import { useCartStore } from "@/store/cart/cart.store";
import { useGlobalModalStateStore } from "@/store/modal";
import { IProduct } from "@/types";
import { generateCartItem } from "@/utils/generate-cart-item";
import { calculateDiscountPercentage } from "@/utils/util";
import { EyeIcon, HeartIcon, RefreshCwIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { addOrderItem } from "@/lib/actions/order.action";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.action";

interface Props {
  product: any;
  type: any;
}
const ProductCard = ({ product, type }: Props) => {
  const [user, setUser] = useState([]);
  // console.log(user, "user");
  useEffect(() => {
    const currentUser = async () => {
      const response: any = await getCurrentUser();
      // console.log("response", response);
      setUser(response);
    };
    currentUser();
  }, []);
  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price,
    baseAmount: product?.price,
    currencyCode: "SAR",
  });
  const { price: minPrice } = usePrice({
    amount: product?.min_price ?? 0,
    currencyCode: "SAR",
  });
  const { price: maxPrice } = usePrice({
    amount: product?.max_price ?? 0,
    currencyCode: "SAR",
  });
  let selectedVariation: any = {};
  const globalModal = useGlobalModalStateStore((state) => state);
  const { addItemToCart } = useCartStore((state) => state);
  const item = generateCartItem(product, selectedVariation);
  // console.log(item, "item");
  const isVariation = (product.variation_options?.length as number) > 0;
  async function addToCart() {
    if (isVariation) {
      return globalModal.setQuickViewState(true, product);
    }
    if (!isVariation) {
      try {
        const response = await addOrderItem(user?.id, product?.id, item);
        if (!response?.success) {
          toast.error("حصل خطا اثناء اضافة المنتج");
        } else {
          addItemToCart(item, 1);
          globalModal.setQuickViewState(false, null);

          toast.success("تم اضافة المنتج للكارت");
        }
        // @ts-ignore
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div className=" flex flex-col group overflow-hidden rounded-xl transition-all duration-300 shadow-card hover:shadow-cardHover  relative h-full">
      <Card className="bg-[#FAFAFA] dark:bg-gray-900 border-none shadow-sm rounded-md w-full h-full group flex flex-col pb-5  relative">
        <div className="w-full min-h-[150px] flex items-center relative justify-center overflow-hidden ">
          <Link href={`/products/${product.id}`} className="w-full">
            <Image
              className="object-center group-hover:scale-110 transition-all duration-700 w-full"
              src={product?.images[0] as string}
              alt={product.name}
              width={150}
              height={100}
            />
          </Link>
          <div className="absolute -bottom-12 bg-white dark:bg-black/80 dark:shadow-sm dark:shadow-gray-200 rounded-lg group-hover:bottom-5 transition-all duration-500 py-2 px-4 z-[100] flex items-center space-x-2">
            <button
              onClick={() => globalModal.setQuickViewState(true, product)}
            >
              <EyeIcon className="w-5 h-5" />
              <span className="sr-only">نظرة سريعة</span>
            </button>
            <span className="border-l-2 h-full" />
            <button>
              <RefreshCwIcon className="w-5 h-5" />
              <span className="sr-only">مقارنة</span>
            </button>
            <div className="border border-l-2 h-full"></div>

            {/* <button>
              <HeartIcon className="w-5 h-5" />
              <span className="sr-only">قائمة الرغبات</span>
            </button> */}
          </div>
        </div>
        <div className="flex flex-col px-4">
          <Link
            className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white w-full line-clamp-1 text-ellipsis"
            href={`/products/${product.id}`}
          >
            {product.name}
          </Link>
          {/* {product.unit ? (
            <p className="text-sm text-gray-600">{product.unit}</p>
          ) : (
            <p className="text-sm text-gray-600">1(items)</p>
          )} */}
          <div className="flex gap-3 items-center">
            {product.discount > 0 ? (
              <p className="text-primary font-medium text-xs xs:text-sm md:text-base">
                {product.product_type === "variable" ? (
                  `${minPrice} - ${maxPrice}`
                ) : (
                  <>
                    {(product.price * (1 - product.discount / 100)).toFixed(2)}{" "}
                    ريال
                  </>
                )}
              </p>
            ) : (
              <p className="text-primary font-medium text-xs xs:text-sm md:text-base">
                {product.product_type === "variable" ? (
                  `${minPrice} - ${maxPrice}`
                ) : (
                  <>{product.price.toFixed(2)} ريال</>
                )}
              </p>
            )}
            {product?.discount > 0 && (
              <del className="mx-1 text-xs md:text-sm text-gray-600 text-opacity-70">
                {product.price.toFixed(2)} ريال
              </del>
            )}
          </div>
        </div>

        <div className="flex items-center">
          {/* <div className="flex -mx-0.5 ">
            {[...Array(5)].map((_, idx) => (
              <StarIcon
                key={idx}
                color={idx < product.ratings ? "#F3B81F" : "#fff"}
                className="w-3.5 lg:w-4 h-3.5 lg:h-4 mx-0.5"
              />
            ))}
          </div> */}
          {/* <p className="text-sm ml-3">
            {product.in_stock ? "In-Stock" : "Out of Stock"}
          </p> */}
        </div>
        <Button
          variant={"outline"}
          className="mt-4 rounded-full mx-4 text-white bg-[#000957] 
          hover:bg-[#000957] hover:text-white"
          onClick={() => globalModal.setQuickViewState(true, product)}
        >
          <p className="sm:hidden">اضافة</p>
          <p className="hidden sm:block">اضافة للكارت</p>
        </Button>
        {product.discount ? (
          <div className="bg-primary p-1 absolute top-3 right-3 rounded-lg">
            <p className="text-xs text-white">{product?.discount}%</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default ProductCard;
