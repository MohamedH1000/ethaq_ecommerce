"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import usePrice from "@/hooks/use-price";
import { useCartStore } from "@/store/cart/cart.store";
import Link from "next/link";
import { CartItemDetails } from "./cart-item";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createOrder,
  decreaseOrderItem,
  deleteOrderItem,
  getOrdersItemsByUserId,
  increaseOrderItem,
} from "@/lib/actions/order.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/configs/routes";
import { Loader } from "lucide-react";

const CartItemsDetails = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser: any = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const response: any = await getOrdersItemsByUserId(user?.id);
      setItems(response || []);
    } catch (error) {
      console.log(error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchItems();
    }
  }, [user?.id, fetchItems]);

  const handleIncrement = useCallback(
    async (id: string) => {
      try {
        await increaseOrderItem(id);
        // Refresh the items after successful increment
        await fetchItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchItems]
  );

  const handleDecrement = useCallback(
    async (id: string) => {
      try {
        await decreaseOrderItem(id);
        // Refresh the items after successful decrement
        await fetchItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchItems]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteOrderItem(id);
        // Refresh the items after successful delete
        await fetchItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchItems]
  );

  const totalPrice = useMemo(() => {
    return items
      .map((item) => item.product.price * item.quantity)
      .reduce((sum, price) => sum + price, 0)
      .toFixed(2);
  }, [items]); // Only depends on items now

  const handleRequest = async () => {
    if (!user?.id || items.length === 0) return;
    setIsLoading(true);
    try {
      const response = await createOrder(user?.id, items);
      if (response.success) {
        // Close the cart modal and redirect to checkout or order confirmation
        router.push(`${ROUTES.CHECKOUT}?orderId=${response.orderId}`);

        setItems([]); // Optionally clear the cart
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container flex flex-col xl:flex-row  gap-8 py-12  ">
      <div className="w-full  xl:w-[70%] whitespace-nowrap rounded-md h-auto">
        <ScrollArea className=" whitespace-nowrap rounded-md border ">
          {items.length > 0 && items ? (
            items.map((item) => (
              <CartItemDetails
                item={item}
                key={item._id}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <div className="w-full flex items-center justify-center font-bold text-2xl my-3">
              لم يتم اضافة منتجات لعربة التسوق
            </div>
          )}

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className=" w-full xl:w-[30%] bg-gray-100 dark:bg-background p-5 flex flex-col space-y-6">
        <h1 className="text-xl text-gray-900 dark:text-white font-semibold">
          اجمالي عربة التسوق
        </h1>

        <div className="border border-t" />
        <div className="flex flex-col justify-center">
          <div className="flex ">
            <h1 className=" text-gray-600 dark:text-white font-semibold">
              المجموع الفرعي
            </h1>
            <span className="ml-auto  text-gray-600 dark:text-white font-semibold">
              {/* {cartTotal} */}
            </span>
          </div>
          <div className="flex ">
            <h1 className=" text-gray-600 dark:text-white font-semibold">
              شحن
            </h1>
            <span className="ml-auto  text-gray-600 dark:text-white font-semibold">
              التكلفة عند الدفع
            </span>
          </div>
          <div className="flex ">
            <h1 className=" text-gray-600 dark:text-white font-semibold">
              الضريبة
            </h1>
            <span className="ml-auto  text-gray-600 dark:text-white font-semibold">
              التكلفة عند الدفع
            </span>
          </div>
        </div>
        <div className="border border-t" />

        <div className="flex flex-col justify-center space-y-3">
          <div className="flex ">
            <h1 className="text-lg text-gray-900 dark:text-white font-semibold">
              المجموع الكلي
            </h1>
            <span className="ml-auto text-lg text-primary font-semibold">
              {totalPrice} SAR
            </span>
          </div>

          <button
            className="px-4 w-full py-2 bg-red-500 text-white rounded-lg"
            onClick={handleRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" /> جاري ارسال الطلب
              </>
            ) : (
              "ارسال طلب"
            )}
          </button>

          <button className="px-4 w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg grid place-items-center">
            <Link href="/products">العودة الى المتجر</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemsDetails;
