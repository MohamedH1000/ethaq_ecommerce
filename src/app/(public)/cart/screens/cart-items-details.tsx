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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
  useFormField,
} from "@/components/ui/form";
import { addressSchema } from "@/lib/schemas/address";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/ui/icons";
import { useForm } from "react-hook-form";

const CartItemsDetails = ({ user, items }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddressDialogOpen, setNewAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const globalModal = useGlobalModalStateStore((state) => state);
  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postcode: "",
    },
  });
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
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewAddress = async (
    data: z.infer<typeof addressSchema>
  ) => {
    console.log("Form submitted with data:", data); // This should log first
    setIsCreatingAddress(true);
    try {
      const newAddress = await addAddress(data);
      console.log("API response:", newAddress); // Check API response
      console.log("Creating address with data:", data);
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

  const handleIncrement = useCallback(async (id: string) => {
    try {
      await increaseOrderItem(id);
      // Refresh the items after successful increment
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleDecrement = useCallback(async (id: string) => {
    try {
      await decreaseOrderItem(id);
      // Refresh the items after successful decrement
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteOrderItem(id);
      useCartStore.getState().clearItemFromCart(id);

      // 3. Also update the orderItems array in Zustand
    } catch (error) {
      console.log(error);
    }
  }, []);

  const totalPrice = useMemo(() => {
    return items
      .map((item: any) => item.priceAtPurchase * item.quantity)
      .reduce((sum, priceAtPurchase) => sum + priceAtPurchase, 0)
      .toFixed(2);
  }, [items]); // Only depends on items now

  const taxAmount = useMemo(() => {
    return Number(totalPrice) * (15 / 100);
  }, [items, totalPrice]);

  const total = Number(totalPrice) + taxAmount;
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
            <div className="w-full flex items-center justify-center font-bold text-2xl my-3 min-h-screen flex-col gap-4">
              <p>لم يتم اضافة منتجات لعربة التسوق</p>
              <button className="px-4 w-[50%] max-sm:!w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg grid place-items-center">
                <Link href="/products">العودة الى المتجر</Link>
              </button>
            </div>
          )}

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {items.length > 0 && items && (
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
            <Dialog
              open={addressDialogOpen}
              onOpenChange={setAddressDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className={cn(
                    "w-full px-5 py-3 md:py-4 flex items-center justify-center bg-primary rounded font-semibold text-sm sm:text-15px text-white",
                    {
                      "cursor-not-allowed": items?.length === 0,
                    }
                  )}
                  disabled={items.length === 0}
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
                    disabled={!selectedAddressId || isLoading}
                  >
                    {isLoading && (
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
                      // console.log("Form submit triggered"); // Check if form submits
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
                          <UncontrolledFormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
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
                    />

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
      )}
    </div>
  );
};

export default CartItemsDetails;
