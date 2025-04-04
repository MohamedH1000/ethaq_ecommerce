"use client";

import { User } from "@prisma/client";
import Header from "./header";
import MobileHeader from "./MobileHeader";

export function SiteHeader({ currentUser }: { currentUser: User }) {
  return (
    <header className="sticky top-0 z-50 w-full  bg-white dark:bg-black shadow-sm h-16 flex justify-center">
      <div className="container flex items-center">
        <div className="flex flex-1 items-center justify-end space-x-4 z-50">
          <Header currentUser={currentUser} />

          <div className="flex flex-1 items-center space-x-4 lg:hidden">
            <MobileHeader currentUser={currentUser} />
          </div>
        </div>
      </div>
      <div className="border-b-1" />
    </header>
  );
}
