"use client";

import Counter from "@/components/ui/counter";
import usePrice from "@/hooks/use-price";
import { deleteOrderItem } from "@/lib/actions/order.action";
import Image from "next/image";
import { toast } from "sonner";

interface CartItemProps {
  item: any;
  handleIncrement: any;
  handleDecrement: any;
  handleDelete: any;
}
export const CartItemDetails = ({
  item,
  handleIncrement,
  handleDecrement,
}: CartItemProps) => {
  console.log("item", item);
  const { basePrice, discount } = usePrice({
    amount: item?.sale_price ? item?.sale_price : item?.price,
    baseAmount: item?.price,
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
                <p className=" text-gray-500">ايثاق ماركت</p>
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
              {item?.product?.discount > 0 ? (
                <h6 className="text-gray-800 font-semibold dark:text-white">
                  {(
                    item?.product.price *
                    (1 - item?.product.discount / 100)
                  ).toFixed(2)}{" "}
                  ريال
                </h6>
              ) : (
                <h6 className="text-gray-800 font-semibold dark:text-white">
                  {item?.product.price.toFixed(2)} ريال
                </h6>
              )}

              {item.product.discount > 0 && (
                <del className=" text-gray-500">
                  {item.product.price.toFixed(2)}
                </del>
              )}
            </div>

            <div className="flex gap-1 items-center">
              <h6 className="text-primary font-semibold ">لقد وفرت:</h6>
              <p className="text-base text-gray-500">
                {item?.product?.discount > 0
                  ? item?.product?.discount + "%"
                  : "لا يوجد عرض"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-gray-600 dark:text-white">الكمية</h1>
          <div className="flex flex-col mt-2">
            <Counter
              value={item.quantity}
              onIncrement={async () => {
                handleIncrement(item.id);
              }}
              onDecrement={async () => {
                handleDecrement(item.id);
              }}
              variant="cart"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-gray-600 dark:text-white">الاجمالي</h1>
          <div className="flex flex-col mt-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {(
                (item.product.discount > 0
                  ? item.product.price * (1 - item.product.discount / 100)
                  : item.product.price) * item.quantity
              ).toFixed(2)}{" "}
              ريال
            </h3>
            {item.product.discount > 0 && (
              <del className="text-sm text-gray-500 dark:text-gray-400">
                {(item.product.price * item.quantity).toFixed(2)} ريال
              </del>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-gray-600 dark:text-white">الاجراء</h1>
          <div className="flex flex-col mt-2">
            {/* <button className="text-green-400 underline">الحفظ لاحقا</button> */}

            <button
              className="text-red-400 underline"
              onClick={() => {
                deleteOrderItem(item.id);
                toast.success("تم حذف المنتج من عربة التسوق");
              }}
            >
              ازالة العنصر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
