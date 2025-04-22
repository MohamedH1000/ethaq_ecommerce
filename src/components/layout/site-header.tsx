"use client";

import { OrderItem, User } from "@prisma/client";
import Header from "./header";
import MobileHeader from "./MobileHeader";

export function SiteHeader({
  currentUser,
  orderItems,
}: {
  currentUser: User;
  orderItems: OrderItem;
}) {
  return (
    <header className="sticky top-0 z-50 w-full  bg-[#FAFAFA] dark:bg-black shadow-sm h-16 flex justify-center">
      <div className="container flex items-center max-sm:!px-1">
        <div className="flex flex-1 items-center justify-end space-x-4 z-50">
          <Header currentUser={currentUser} orderItems={orderItems} />

          <div className="flex flex-1 items-center space-x-4 lg:hidden">
            <MobileHeader currentUser={currentUser} />
          </div>
        </div>
      </div>
      <div className="border-b-1" />
    </header>
  );
}
