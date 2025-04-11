"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { CartItemDetails } from "./cart-item";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createOrder,
  decreaseOrderItem,
  deleteOrderItem,
  getOrdersItemsByUserId,
  increaseOrderItem,
} from "@/lib/actions/order.action";
import {
  addAddress,
  getCurrentUser,
  myAddresses,
} from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/configs/routes";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart/cart.store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGlobalModalStateStore } from "@/store/modal";

const CartItemsDetails = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  const router = useRouter();
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const globalModal = useGlobalModalStateStore((state) => state);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  // console.log("user", user);
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

    const response = await createOrder(user?.id, items, selectedAddressId);
    if (response.success) {
      toast.success("تم إنشاء الطلب بنجاح");
      setAddressDialogOpen(false);
      globalModal.closeCartState();
      useCartStore.getState().setOrderItems([]);
      router.push("/");
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
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser: any = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const response: any = await getOrdersItemsByUserId(user?.id);
      setItems(response || []);
    } catch (error) {
      console.log(error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchItems();
    }
  }, [user?.id, fetchItems]);

  const handleIncrement = useCallback(
    async (id: string) => {
      try {
        await increaseOrderItem(id);
        // Refresh the items after successful increment
        await fetchItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchItems]
  );

  const handleDecrement = useCallback(
    async (id: string) => {
      try {
        await decreaseOrderItem(id);
        // Refresh the items after successful decrement
        await fetchItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchItems]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteOrderItem(id);
        // Refresh the items after successful delete
        await fetchItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchItems]
  );

  const totalPrice = useMemo(() => {
    return items
      .map((item) => item.priceAtPurchase * item.quantity)
      .reduce((sum, priceAtPurchase) => sum + priceAtPurchase, 0)
      .toFixed(2);
  }, [items]); // Only depends on items now

  const taxAmount = useMemo(() => {
    return Number(totalPrice) * (16 / 100);
  }, [items, totalPrice]);

  const total = Number(totalPrice) + taxAmount;
  const handleRequest = async () => {
    if (!user?.id || items.length === 0) return;
    // console.log("we reached here");
    setIsLoading(true);
    try {
      const response = await createOrder(user?.id, items, selectedAddressId);
      if (response.success) {
        // Close the cart modal and redirect to checkout or order confirmation
        router.push(`${ROUTES.CHECKOUT}?orderId=${response.orderId}`);

        setItems([]); // Optionally clear the cart
        useCartStore.getState().setOrderItems([]);
      } else {
        toast.error(response.message);
        console.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container flex flex-col xl:flex-row  gap-8 py-12  ">
      <div className="w-full  xl:w-[70%] whitespace-nowrap rounded-md h-auto">
        <ScrollArea className=" whitespace-nowrap rounded-md border ">
          {items.length > 0 && items ? (
            items.map((item) => (
              <CartItemDetails
                item={item}
                key={item._id}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <div className="w-full flex items-center justify-center font-bold text-2xl my-3">
              لم يتم اضافة منتجات لعربة التسوق
            </div>
          )}

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className=" w-full xl:w-[30%] bg-gray-100 dark:bg-background p-5 flex flex-col space-y-6">
        <h1 className="text-xl text-gray-900 dark:text-white font-semibold">
          اجمالي عربة التسوق
        </h1>

        <div className="border border-t" />
        <div className="flex flex-col justify-center">
          <div className="flex gap-2">
            <h1 className=" text-gray-600 dark:text-white font-semibold">
              المجموع الفرعي
            </h1>
            <span className="ml-auto  text-gray-600 dark:text-white font-semibold">
              {totalPrice} ريال
            </span>
          </div>
          {/* <div className="flex ">
            <h1 className=" text-gray-600 dark:text-white font-semibold">
              شحن
            </h1>
            <span className="ml-auto  text-gray-600 dark:text-white font-semibold">
              التكلفة عند الدفع
            </span>
          </div>  */}
          <div className="flex gap-2">
            <h1 className=" text-gray-600 dark:text-white font-semibold">
              الضريبة التكلفة عند الدفع
            </h1>
            <span className="ml-auto  text-gray-600 dark:text-white font-semibold">
              {taxAmount.toFixed(2)} ريال
            </span>
          </div>
        </div>
        <div className="border border-t" />

        <div className="flex flex-col justify-center space-y-3">
          <div className="flex gap-2">
            <h1 className="text-lg text-gray-900 dark:text-white font-semibold">
              المجموع الكلي
            </h1>
            <span className="ml-auto text-lg text-primary font-semibold">
              {total.toFixed(2)} ريال
            </span>
          </div>

          <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={cn(
                  "w-full px-5 py-3 md:py-4 flex items-center justify-center bg-primary rounded font-semibold text-sm sm:text-15px text-white",
                  {
                    "cursor-not-allowed": items.length === 0,
                  }
                )}
                disabled={items.length === 0}
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
          {/* <button
            className="px-4 w-full py-2 bg-[#000957] text-white rounded-lg"
            onClick={handleRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" /> جاري ارسال الطلب
              </>
            ) : (
              "ارسال طلب"
            )}
          </button> */}

          <button className="px-4 w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg grid place-items-center">
            <Link href="/products">العودة الى المتجر</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemsDetails;
