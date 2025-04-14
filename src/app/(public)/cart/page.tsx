import Breadcrumb from "@/components/ui/breadcrumb";
import React from "react";
import CartItemsDetails from "./screens/cart-items-details";
import ClientOnly from "@/components/common/shared/ClientOnly";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getOrdersItemsByUserId } from "@/lib/actions/order.action";
import { Loader } from "lucide-react";

const CartPage = async () => {
  const [currentUser, items] = await Promise.all([
    getCurrentUser(),
    getCurrentUser().then((user) => getOrdersItemsByUserId(user?.id)),
  ]);

  return (
    <div className="">
      {/* <div className="py-3 bg-gray-100 dark:bg-gray-800">
        <Breadcrumb />
      </div> */}
      <ClientOnly
        fallback={
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin w-8 h-8" />
          </div>
        }
      >
        <CartItemsDetails user={currentUser} items={items} />
      </ClientOnly>
    </div>
  );
};

export default CartPage;
