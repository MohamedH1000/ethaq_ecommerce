"use client";

import { ROUTES } from "@/configs/routes";
import { cn } from "@/lib/utils";
import { useGlobalModalStateStore } from "@/store/modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "../ui/icons";
import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getOrdersItemsByUserId,
  createOrder,
  deleteOrderItem,
  increaseOrderItem,
  decreaseOrderItem,
} from "@/lib/actions/order.action";
import {
  addAddress,
  getCurrentUser,
  myAddresses,
} from "@/lib/actions/user.action";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { useCartStore } from "@/store/cart/cart.store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

const CartSidebarView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const { user } = useUser(); // Changed to null for better initial state
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const globalModal = useGlobalModalStateStore((state) => state);
  const router = useRouter();
  // console.log("orderItems", orderItems);
  // Fetch current user
  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    const userAddresses = await myAddresses(user.id);
    // console.log("user addresses", userAddresses);
    setAddresses(userAddresses);
  }, [user?.id]);
  useEffect(() => {
    if (addressDialogOpen) {
      fetchAddresses();
    }
  }, [addressDialogOpen, fetchAddresses]);
  // Fetch order items - memoized
  const handleRequestWithAddress = async () => {
    if (!selectedAddressId) {
      toast.error("الرجاء اختيار عنوان التوصيل");
      return;
    }

    const response = await createOrder(user.id, orderItems, selectedAddressId);
    if (response.success) {
      toast.success("تم إنشاء الطلب بنجاح");
      setAddressDialogOpen(false);
      globalModal.closeCartState();
      useCartStore.getState().setOrderItems([]);
      // Clear cart and close modal
    } else {
      toast.error(response.message);
    }
  };

  const handleCreateNewAddress = async (addressData: any) => {
    setIsCreatingAddress(true);
    try {
      const newAddress = await addAddress(addressData);
      setAddresses((prev: any) => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      toast.success("تم إضافة العنوان بنجاح");
    } catch (error) {
      toast.error("فشل في إضافة العنوان");
    } finally {
      setIsCreatingAddress(false);
    }
  };
  const fetchOrderItems = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response: any = await getOrdersItemsByUserId(user.id);
      setOrderItems(response || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch order items when user is available
  useEffect(() => {
    if (user?.id) {
      fetchOrderItems();
    }
  }, [user?.id, fetchOrderItems]);
  // Handle order creation
  const handleRequest = async () => {
    if (!user?.id || orderItems.length === 0) return;

    const response = await createOrder(user?.id, orderItems);
    if (response.success) {
      // Close the cart modal and redirect to checkout or order confirmation
      globalModal.closeCartState();
      toast.success("تم انشاء الطلب بنجاح وسيتم ارسال رسالة لكم بتفاصيل الطلب");
      // router.push(`${ROUTES.CHECKOUT}?orderId=${response.orderId}`);

      setOrderItems([]); // Optionally clear the cart
      useCartStore.getState().setOrderItems([]);
    } else {
      toast.error(response.message);
      console.error(response.message);
      // Optionally show an error message to the user
    }
  };
  const handleIncrement = useCallback(
    async (id: string) => {
      try {
        await increaseOrderItem(id);
        await fetchOrderItems(); // Just call it directly
      } catch (error) {
        console.log(error);
      }
    },
    [fetchOrderItems]
  ); // Empty dependency array

  const handleDecrement = useCallback(
    async (id: string) => {
      try {
        await decreaseOrderItem(id);
        await fetchOrderItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchOrderItems]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await deleteOrderItem(id);
        if (response.success) {
          toast.success("تم حذف المنتج بنجاح من عربة التسوق");
          await fetchOrderItems();
          const updatedItems = await getOrdersItemsByUserId(user.id);
          useCartStore.getState().setOrderItems(updatedItems);
        }
      } catch (error) {
        toast.error("حصل خطا اثناء حذف المنتج من عربة التسوق");
        console.log(error);
      }
    },
    [fetchOrderItems]
  );

  const totalPrice = useMemo(() => {
    return orderItems
      .map((item) => item.priceAtPurchase * item.quantity)
      .reduce((sum, priceAtPurchase) => sum + priceAtPurchase, 0)
      .toFixed(2);
  }, [orderItems]);

  const taxAmount = useMemo(() => {
    return Number(totalPrice) * (16 / 100);
  }, [orderItems, totalPrice]);

  const total = Number(totalPrice) + taxAmount;
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader className="animate-spin" />;
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full h-full dark:bg-[#0c0a09]">
      <div className="relative flex items-center justify-between w-full px-5 py-5 border-b border-gray-base md:px-7">
        <h3>عربة التسوق</h3>
        <button
          className="text-sm font-semibold text-heading text-primary"
          onClick={() => globalModal.closeCartState()}
        >
          <Icons.close className="w-4 h-4" />
        </button>
      </div>

      {orderItems.length > 0 ? (
        <div className="flex-grow w-full cart-scrollbar overflow-y-scroll">
          <div className="w-full px-5 md:px-7 h-[calc(100vh_-_420px)]">
            {orderItems?.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
                handleDelete={handleDelete}
              /> // Use item.id for uniqueness
            ))}
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}

      <div className="px-5 pt-5 pb-5 border-t border-border-base md:px-7 md:pt-6 md:pb-6 bg-gray-100 dark:bg-black">
        {/* <h6 className="text-sm text-gray-500 py-2">
          يتم احتساب الشحن والضرائب عند التحويل للدفع
        </h6> */}
        <div className="flex justify-between my-2">
          <div>
            <h3 className="mb-2.5 text-sm font-normal text-gray-500 dark:text-white">
              ضريبة القيمة المضافة 16%:
            </h3>
          </div>
          <div className="shrink-0 font-semibold text-sm md:text-sm text-primary -mt-0.5 min-w-[80px] text-left">
            {taxAmount.toFixed(2)} ريال
          </div>
        </div>
        <div className="flex justify-between pb-5 md:pb-7">
          <div>
            <h3 className="mb-2.5 text-lg font-semibold text-gray-800 dark:text-white">
              المجموع:
            </h3>
          </div>
          <div className="shrink-0 font-semibold text-base md:text-lg text-primary -mt-0.5 min-w-[80px] text-left">
            {total.toFixed(2)} ريال
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Link
            href={`/cart`}
            className={cn(
              "w-full px-5 py-3 md:py-4 flex items-center justify-center bg-white rounded font-semibold text-sm sm:text-15px text-primary focus:outline-none transition duration-300 hover:bg-opacity-90 border-2 border-primary dark:bg-black",
              {
                "cursor-not-allowed !text-gray-800 !bg-[#EEEEEE] hover:!bg-[#EEEEEE]":
                  orderItems.length === 0,
              }
            )}
            onClick={() => globalModal.closeCartState()}
          >
            <span className="py-0.5">عرض عربة التسوق</span>
          </Link>
          <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={cn(
                  "w-full px-5 py-3 md:py-4 flex items-center justify-center bg-primary rounded font-semibold text-sm sm:text-15px text-white",
                  {
                    "cursor-not-allowed": orderItems.length === 0,
                  }
                )}
                disabled={orderItems.length === 0}
              >
                <span className="py-0.5">انشاء طلب</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md z-[1000]">
              {" "}
              {/* Added z-index here */}
              <DialogHeader>
                <DialogTitle>اختر عنوان التوصيل</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {addresses?.length > 0 ? (
                  <div className="space-y-2">
                    {addresses?.map((address) => (
                      <div
                        key={address?.id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedAddressId === address?.id
                            ? "border-primary bg-primary/10"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedAddressId(address?.id)}
                      >
                        <p>
                          {address?.street}, {address?.city}
                        </p>
                        <p>
                          {address?.country}, {address?.postcode}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4">لا يوجد عناوين مسجلة</p>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    globalModal.closeCartState();
                    setAddressDialogOpen(false);
                    router.push("/account/addresses/new");
                  }}
                >
                  إضافة عنوان جديد
                </Button>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddressDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleRequestWithAddress}
                  disabled={!selectedAddressId}
                >
                  تأكيد الطلب
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Link
            href={`${ROUTES.CHECKOUT}`}
            className={cn(
              "w-full px-5 py-3 md:py-4 flex items-center justify-center bg-primary rounded font-semibold text-sm sm:text-15px text-white focus:outline-none transition duration-300 hover:bg-opacity-90",
              {
                "cursor-not-allowed !text-brand-dark !text-opacity-25 !bg-[#EEEEEE] hover:!bg-[#EEEEEE]":
                  orderItems.length === 0,
              }
            )}
            onClick={(e) => {
              e.preventDefault(); // Prevent default navigation until order is created
              handleRequest();
            }}
          >
            <span className="py-0.5">انشاء طلب</span>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default CartSidebarView;
