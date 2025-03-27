"use client";
import { getCurrentUser } from "@/lib/actions/user.action";
import { Icons } from "../ui/icons";
import { useCartStore } from "@/store/cart/cart.store";
import { useGlobalModalStateStore } from "@/store/modal";
import { useEffect, useState } from "react";
import { getOrdersItemsByUserId } from "@/lib/actions/order.action";

const CartCounterButton = () => {
  const globalModal = useGlobalModalStateStore((state) => state);
  function handleCartSidebar() {
    globalModal.onCartState();
  }
  const [orderItems, setOrderItems] = useState([]);
  // console.log("orderItems", orderItems);
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
  useEffect(() => {
    const orderItems = async () => {
      const response: any = await getOrdersItemsByUserId(user?.id);
      // console.log("response", response);
      setOrderItems(response);
    };
    orderItems();
  }, [user?.id, orderItems.length]);
  return (
    <button className="flex relative" onClick={handleCartSidebar}>
      <Icons.cart className="w-5" />
      {orderItems.length > 0 && (
        <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] absolute left-1/2 -top-1/2">
          {orderItems.length}
        </span>
      )}
    </button>
  );
};

export default CartCounterButton;
