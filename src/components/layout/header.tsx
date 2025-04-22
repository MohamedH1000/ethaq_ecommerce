"use client";
import { useIsHomePage } from "@/hooks/use-is-homepage";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart/cart.store";
import { Menu, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "../ui/button";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";
import { Icons } from "../ui/icons";
import { OrderItem, User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { getOrdersItemsByUserId } from "@/lib/actions/order.action";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const Search = dynamic(() => import("@/components/ui/search/search"));
const CartCounterButton = dynamic(() => import("../cart/cart-count-button"), {
  ssr: false,
});

const Header = ({
  currentUser,
  orderItems,
}: {
  currentUser: User;
  orderItems: OrderItem;
}) => {
  const { totalItems } = useCartStore((state) => state);
  const isHomePage = useIsHomePage();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false); // Optional: for loading state
  // console.log("orderItems", orderItems);
  const { user } = useUser();
  // console.log(user, "user");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true); // Optional: show loading state
    try {
      await signOut({ redirect: false }); // Sign out without immediate redirect
      window.location.href = "/signin"; // Manually redirect after sign-out
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setIsSigningOut(false); // Reset loading state
    }
  };

  return (
    <header className=" lg:justify-between lg:w-full hidden lg:flex ">
      <div className="flex items-center w-full ">
        <Link href={"/"}>
          <Image
            src={"/assets/Logo.png"}
            alt={"ايثاق ماركت"}
            width={190}
            height={190}
          />
        </Link>

        {/* <div className="hidden ml-10  mr-auto  xl:block">
            <GroupsDropdownMenu />
          </div> */}
        <div className="w-2/3">
          {isHomePage ? (
            <>
              {/* {(headerSearch.showHeaderSearch) && ( */}
              <div className="w-full lg:w-[60%] mx-auto overflow-hidden border-[#000957] border-[1px] rounded-3xl lg:mr-[250px] px-8 lg:px-0">
                <Search
                  label="Search"
                  variant={isMobile ? "minimal-mobile" : "minimal"}
                  className="text-sm lg:text-base"
                />
              </div>
              {/* )} */}
            </>
          ) : null}
        </div>
      </div>

      <ul className="items-center shrink-0 hidden lg:flex space-x-10 space-x-reverse">
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* <Link
            href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/signup`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center shrink-0 px-3 py-0 text-sm font-semibold leading-none transition duration-300 ease-in-out border border-transparent rounded outline-none h-9 bg-primary text-white hover:bg-primary focus:outline-none focus:shadow focus:ring-1 focus:ring-primary-700"
          >
            كن بائعا
          </Link> */}

          {/* <div className="border-r h-6 border-border" />
          <HeartIcon className="w-5" /> */}
          <div className="border-r h-6 border-border" />
          <CartCounterButton
            orderItems={orderItems}
            currentUser={currentUser}
          />
          <div className="border-r h-6 border-border" />
          {currentUser ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md  px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                  <div className="relative flex gap-2 items-center cursor-pointer">
                    <Avatar className="h-8 w-8  rounded-full">
                      <AvatarImage
                        src={currentUser?.image || "/assets/avatar.png"}
                        alt={currentUser.name}
                      />
                      <AvatarFallback>{currentUser?.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 ">
                      <span className="text-gray-600 text-sm">
                        مرحبا, {currentUser?.name}
                      </span>
                      <h3 className="text-gray-900 dark:text-white text-md ">
                        حسابي
                      </h3>
                    </div>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute right-0 top-10 mt-2 w-56 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
                >
                  <Menu.Item
                    as="div"
                    className="m-2 flex items-center  rounded-lg px-4 py-2 text-sm text-gray-700"
                  >
                    <div className="flex 1 flex-col gap-2">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </Menu.Item>
                  <div className="divider" />

                  <div className="divider" />
                  <Menu.Item
                    as="div"
                    className={({ active }: { active: boolean }) =>
                      cn({ "dropdown-active": active }, "menu-item ")
                    }
                  >
                    <Link
                      href="/account/dashboard"
                      className="flex items-center gap-1"
                    >
                      <Icons.user className="mr-1 h-4 w-4" aria-hidden="true" />
                      الحساب
                    </Link>
                  </Menu.Item>

                  {/* <Menu.Item
                    as="div"
                    className={({ active }: { active: boolean }) =>
                      cn({ "dropdown-active": active }, "menu-item flex")
                    }
                  >
                    <Link
                      href="/account/dashboard"
                      className="flex items-center gap-1"
                    >
                      <Icons.user className="mr-1 h-4 w-4" aria-hidden="true" />
                      لوحة التحكم
                      <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                    </Link>
                  </Menu.Item> */}
                  <Menu.Item
                    as="div"
                    className={({ active }: { active: boolean }) =>
                      cn({ "dropdown-active": active }, "menu-item ")
                    }
                  >
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex items-center gap-1 w-full text-left"
                    >
                      {isSigningOut ? (
                        <Icons.spinner
                          className="mr-1 h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Icons.logout
                          className="mr-1 h-4 w-4"
                          aria-hidden="true"
                        />
                      )}
                      تسجيل الخروج
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link
              href="/signin"
              className={buttonVariants({
                size: "sm",
              })}
            >
              تسجيل الدخول
              <span className="sr-only">تسجيل الدخول</span>
            </Link>
          )}
        </div>
      </ul>
    </header>
  );
};

export default Header;
