import React from "react";
import { OrderTable } from "./components/order-table";
import { columns } from "./components/columns";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getMyOrders } from "@/lib/actions/order.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
const MyOrders = async () => {
  const currentUser: any = await getCurrentUser();
  const myorders = await getMyOrders(currentUser?.id);
  // console.log("myorders", myorders);
  // const { totalPaid, totalRemaining }: any = myorders?.reduce(
  //   (acc: any, order: any) => {
  //     return {
  //       totalPaid: acc.totalPaid + order.paidAmount,
  //       totalRemaining: acc.totalRemaining + order.remainingAmount,
  //     };
  //   },
  //   { totalPaid: 0, totalRemaining: 0 } // Initial values
  // );
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-xl">المبالغ</h1>
      </div>

      <div className="mt-5 w-full">
        <OrderTable columns={columns} data={myorders} />
      </div>
    </>
  );
};

export default MyOrders;
