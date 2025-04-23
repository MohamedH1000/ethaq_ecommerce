"use client";
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
import { addAddress, myAddresses } from "@/lib/actions/user.action";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { addressSchema } from "@/lib/schemas/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CartSidebarView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const { user } = useUser();
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddressDialogOpen, setNewAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const globalModal = useGlobalModalStateStore((state) => state);
  const router = useRouter();

  // Address Form
  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      // postcode: "",
    },
  });

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    const userAddresses = await myAddresses(user.id);
    setAddresses(userAddresses);
  }, [user?.id]);

  useEffect(() => {
    if (addressDialogOpen) {
      fetchAddresses();
    }
  }, [addressDialogOpen, fetchAddresses]);

  const handleRequestWithAddress = async () => {
    if (!selectedAddressId) {
      toast.error("الرجاء اختيار عنوان التوصيل");
      return;
    }
    setIsOrderLoading(true);
    try {
      const response = await createOrder(
        user.id,
        orderItems,
        selectedAddressId
      );
      if (response.success) {
        toast.success("تم إنشاء الطلب بنجاح");
        setAddressDialogOpen(false);
        globalModal.closeCartState();
        setOrderItems([]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOrderLoading(false);
    }
  };
  // useEffect(() => {
  //   console.log("Form errors:", addressForm.formState.errors);
  // }, [addressForm.formState.errors]);
  const handleCreateNewAddress = async (
    data: z.infer<typeof addressSchema>
  ) => {
    // console.log("Form submitted with data:", data); // This should log first
    setIsCreatingAddress(true);
    try {
      const newAddress = await addAddress(data);
      // console.log("API response:", newAddress); // Check API response
      // console.log("Creating address with data:", data);
      setAddresses((prev: any) => [...prev, newAddress]);
      setSelectedAddressId(newAddress?.id);
      toast.success("تم إضافة العنوان بنجاح");
      setNewAddressDialogOpen(false);
      setAddressDialogOpen(true); // Reopen the address selection dialog
      addressForm.reset(); // Reset form after successful submission
    } catch (error) {
      toast.error("فشل في إضافة العنوان");
      console.error("Error creating address:", error);
    } finally {
      setIsCreatingAddress(false);
    }
  };

  const handleOpenNewAddressDialog = () => {
    setAddressDialogOpen(false);
    setNewAddressDialogOpen(true);
  };

  const handleBackToAddressSelection = () => {
    setNewAddressDialogOpen(false);
    setAddressDialogOpen(true);
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

  useEffect(() => {
    if (user?.id) {
      fetchOrderItems();
    }
  }, [user?.id, fetchOrderItems]);

  const handleIncrement = useCallback(
    async (id: string) => {
      try {
        await increaseOrderItem(id);
        await fetchOrderItems();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchOrderItems]
  );

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
    return Number(totalPrice) * (15 / 100);
  }, [orderItems, totalPrice]);

  const total = Number(totalPrice) + taxAmount;

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen w-full flex items-center justify-center">
  //       <Loader className="animate-spin" />;
  //     </div>
  //   );
  // }
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
        <div className="flex flex-col justify-center h-full">
          <EmptyCart />
        </div>
      )}
      {orderItems && orderItems.length > 0 && (
        <div className="px-5 pt-5 pb-5 border-t border-border-base md:px-7 md:pt-6 md:pb-6 bg-gray-100 dark:bg-black">
          {/* <h6 className="text-sm text-gray-500 py-2">
   يتم احتساب الشحن والضرائب عند التحويل للدفع
 </h6> */}
          <div className="flex justify-between my-2">
            <div>
              <h3 className="mb-2.5 text-sm font-normal text-gray-500 dark:text-white">
                ضريبة القيمة المضافة 15%:
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
            <Dialog
              open={addressDialogOpen}
              onOpenChange={setAddressDialogOpen}
            >
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
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={handleOpenNewAddressDialog}
                  >
                    إضافة عنوان جديد
                  </Button>
                  <Button
                    onClick={handleRequestWithAddress}
                    disabled={!selectedAddressId || isOrderLoading}
                  >
                    {isOrderLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    تأكيد الطلب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* New Address Dialog */}
            <Dialog
              open={newAddressDialogOpen}
              onOpenChange={setNewAddressDialogOpen}
            >
              <DialogContent className="max-w-md z-[1000]">
                <DialogHeader>
                  <DialogTitle>إضافة عنوان جديد</DialogTitle>
                </DialogHeader>

                <Form {...addressForm}>
                  <form
                    onSubmit={(e) => {
                      console.log("Form submit triggered"); // Check if form submits
                      addressForm.handleSubmit(handleCreateNewAddress)(e);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدينة</FormLabel>
                            <FormControl>
                              <Input placeholder="المدينة" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addressForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المنطقة</FormLabel>
                            <FormControl>
                              <Input placeholder="المنطقة" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={addressForm.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عنوان الشارع</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="رقم المنزل واسم الشارع"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={addressForm.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الرمز البريدي</FormLabel>
                          <FormControl>
                            <Input placeholder="الرمز البريدي" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleBackToAddressSelection}
                      >
                        رجوع
                      </Button>
                      <Button type="submit" disabled={isCreatingAddress}>
                        {isCreatingAddress && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        حفظ العنوان
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
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
      )}
    </div>
  );
};

export default CartSidebarView;
