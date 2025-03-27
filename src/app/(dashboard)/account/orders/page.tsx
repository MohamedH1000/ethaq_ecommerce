import React from "react";
import { OrderTable } from "./components/order-table";
import { columns } from "./components/columns";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getMyOrders } from "@/lib/actions/order.action";

const MyOrders = async () => {
  const currentUser = await getCurrentUser();
  const myorders = await getMyOrders(currentUser?.id);
  // console.log("myorders", myorders);
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-xl">الطلبات</h1>
      </div>
      <div className="mt-5 w-full">
        <OrderTable columns={columns} data={myorders} />
      </div>
    </>
  );
};

export default MyOrders;
