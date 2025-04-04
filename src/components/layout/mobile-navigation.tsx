"use client";
import { motion } from "framer-motion";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { useGlobalModalStateStore } from "@/store/modal";
import { useRouter } from "next/navigation";
import { Icons } from "../ui/icons";
import { User } from "@prisma/client";
export default function MobileNavigation({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User;
}) {
  const router = useRouter();
  const globalModal = useGlobalModalStateStore();
  // const [_, setDrawerView] = useAtom(drawerAtom);

  // const hasFilter = `[manufacturer], ${ROUTES?.SEARCH}`.includes(
  //   router.pathname.split('/').pop()!
  // );

  // const { totalUniqueItems } = useCart();

  // function handleSidebar(view: string) {
  //   setDrawerView({ display: true, view });
  // }

  return (
    <div className="visible h-12 sm:hidden md:h-14 ">
      <nav className="h-12 md:h-14 w-full py-1.5 px-2 flex justify-between fixed left-0 right-0 bottom-0 z-10 bg-primary shadow-400 text-white">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => router.push("/")}
          className="flex items-center justify-center h-full p-2 focus:outline-none focus:text-green-500"
        >
          <span className="sr-only">الرئيسية</span>
          <HomeIcon className=" w-5 " />
        </motion.button>

        {/* <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => globalModal.onMenubar()}
          className="flex items-center justify-center h-full p-2 focus:outline-none focus:text-green-500"
        >
          <span className="sr-only">burger menu</span>
          <Icons.menu className={`${"transform rotate-180"} text-white`} />
        </motion.button> */}
        {/* <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => router.push("/search")}
          className="flex items-center justify-center h-full p-2 focus:outline-none focus:text-green-700"
        >
          <span className="sr-only">بحث</span>
          <Icons.search width="17.05" height="18" />
        </motion.button> */}

        {children}

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => router.push("/cart")}
          className="relative flex items-center justify-center h-full p-2 focus:outline-none focus:text-green-500/60"
        >
          <span className="sr-only">عربة التسوق</span>
          <Icons.cart className=" w-5" />

          {/* {totalUniqueItems > 0 && (
            <span className="bg-accent py-1 px-1.5 text-10px leading-none font-semibold text-light rounded-full absolute top-0 ltr:right-0 left-0 mt-0.5 ltr:-mr-0.5 -ml-0.5">
              {totalUniqueItems}
            </span>
          )} */}
        </motion.button>

        {currentUser ? (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => globalModal.onUserMenu()}
            className="flex items-center justify-center h-full p-2 focus:outline-none focus:text-green-500"
          >
            <span className="sr-only">المستخدم</span>
            <Icons.user className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.88 }}
            className="flex items-center justify-center h-full p-2 focus:outline-none focus:text-green-500"
          >
            <span className="sr-only">المستخدم</span>
            <Link href={"/signin"}>
              <Icons.user className="w-5" />
              <span className="sr-only">تسجيل الدخول</span>
            </Link>
          </motion.button>
        )}
      </nav>
    </div>
  );
}
