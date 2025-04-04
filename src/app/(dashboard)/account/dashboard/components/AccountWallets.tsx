import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";
import { WalletIcon } from "lucide-react";
import React from "react";

const AccountWallets = ({ currentUser }: { currentUser: User }) => {
  const NoOrders = currentUser.orders.length || 0;
  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3  items-center gap-5 my-5">
      <Card className="p-2 md:p-4 flex  items-center min-w-[250px] w-full gap-4 relative overflow-hidden group ">
        <WalletIcon className="w-12 h-12 text-primary" />
        <div className="">
          <h5 className="text-gray-600">الميزانية</h5>
          <h6>{currentUser.balance || 0}</h6>
        </div>
        <span className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 group-hover:-rotate-12 group-hover:-right-2 md:group-hover:-right-4 transition-all duration-500">
          <WalletIcon className="w-16 h-16 text-gray-200 " />
        </span>
      </Card>
      {/* <Card className="p-4 flex items-center min-w-[300px] w-full gap-4 relative ">
        <WalletIcon className="w-12 h-12 text-primary" />
        <div className="">
          <h5 className="text-gray-600">مجموع العملات</h5>
          <h6>300</h6>
        </div>
      </Card> */}
      <Card className="p-4 flex items-center min-w-[300px] w-full gap-4 relative ">
        <WalletIcon className="w-12 h-12 text-primary" />
        <div className="">
          <h5 className="text-gray-600">مجموع الطلبات</h5>
          <h6>{NoOrders}</h6>
        </div>
      </Card>
    </div>
  );
};

export default AccountWallets;
