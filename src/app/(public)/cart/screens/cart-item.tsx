"use client";

import Counter from "@/components/ui/counter";
import usePrice from "@/hooks/use-price";
import {
  decreaseOrderItem,
  increaseOrderItem,
} from "@/lib/actions/order.action";
import { useCartStore } from "@/store/cart/cart.store";
import Image from "next/image";

interface CartItemProps {
  item: any;
}
export const CartItemDetails = ({ item }: CartItemProps) => {
  console.log("item", item);
  const { price, basePrice, discount } = usePrice({
    amount: item?.sale_price ? item?.sale_price : item?.price,
    baseAmount: item?.price,
    currencyCode: "SAR",
  });

  const { isInStock, clearItemFromCart, addItemToCart, removeItemFromCart } =
    useCartStore((state) => state);
  const { price: itemPrice } = usePrice({
    amount: item.price,
    currencyCode: "SAR",
  });

  return (
    <div
      className="min-w-[800px] bg-gray-100 dark:bg-background px-4 py-2 border border-b"
      dir="rtl"
    >
      <div className="p-3 px-4 flex justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="max-w-[100px] w-full">
            <Image
              src={item?.product?.images[0] as string}
              alt={item?.name}
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-600 dark:text-white w-full text-ellipsis line-clamp-1">
              {item?.name}
            </h1>
            <div className="flex flex-col mt-2">
              <div className="flex gap-1 items-center">
                <h6 className="text-gray-800 font-semibold dark:text-white">
                  تم البيع بواسطة:
                </h6>
                <p className=" text-gray-500">Jazila Bazar</p>
              </div>
              {item?.unit && (
                <div className="flex gap-1 items-center">
                  <h6 className="text-gray-800 font-semibold dark:text-white">
                    الوحدة:
                  </h6>
                  <p className="text-base text-gray-500">{item?.unit}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-gray-600 dark:text-white">السعر</h1>
          <div className="flex flex-col mt-2">
            <div className="flex gap-1 items-center">
              <h6 className="text-gray-800 font-semibold dark:text-white">
                {price}
              </h6>
              <del className=" text-gray-500">{basePrice}</del>
            </div>

            <div className="flex gap-1 items-center">
              <h6 className="text-primary font-semibold ">لقد وفرت:</h6>
              <p className="text-base text-gray-500">
                {discount ? discount : "لا يوجد عرض"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-gray-600 dark:text-white">الكمية</h1>
          <div className="flex flex-col mt-2">
            <Counter
              value={item.quantity}
              onIncrement={async () => await increaseOrderItem(item.id)}
              onDecrement={async () => await decreaseOrderItem(item.id)}
              variant="cart"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-gray-600 dark:text-white">الاجمالي</h1>
          <div className="flex flex-col mt-2">
            <h3 className="text-lg text-gray-800 dark:text-white font-semibold">
              {itemPrice}
            </h3>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-gray-600 dark:text-white">الاجراء</h1>
          <div className="flex flex-col mt-2">
            <button className="text-green-400 underline">الحفظ لاحقا</button>

            <button
              className="text-red-400 underline"
              onClick={() => clearItemFromCart(item._id)}
            >
              ازالة العنصر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
