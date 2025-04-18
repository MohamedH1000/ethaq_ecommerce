"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmDelivery } from "@/lib/actions/order.action";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface OrderDetailsProps {
  order: any;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const [open, setOpen] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirmDelivery = async () => {
    setIsLoading(true);
    try {
      const response = await confirmDelivery(order?.id, confirmationCode);

      if (!response?.success) {
        toast.error(response?.message);
      } else {
        toast.success(response.message);
      }

      router.refresh(); // Refresh the page to update the order status
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };
  if (!order) return <div className="text-center py-8">لا يوجد طلب</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Order Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 text-right">
          تفاصيل الطلب
        </h1>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {format(new Date(order.orderDate), "EEEE, d MMMM yyyy", {
              locale: arSA,
            })}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              order.status === "completed"
                ? "bg-green-100 text-green-800"
                : order.status === "canceled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.status === "pending" && "قيد الانتظار"}
            {order.status === "processing" && "قيد المعالجة"}
            {order.status === "shipped" && "تم الشحن"}
            {order.status === "delivered" && "تم التسليم"}
            {order.status === "cancelled" && "ملغى"}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-right">المنتجات</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-start border-b pb-4 gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                {item.product.images[0] && (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-medium text-gray-800">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.product.description}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-gray-600">
                    {item.quantity} × {item.priceAtPurchase} ر.س
                  </span>
                  <span className="font-medium">
                    {(item.quantity * item.priceAtPurchase).toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-right">ملخص الطلب</h2>
        <div className="space-y-2 text-right">
          <div className="flex justify-between">
            <span>المجموع:</span>
            <span>{order.totalAmount.toFixed(2)} ر.س</span>
          </div>
          {/* <div className="flex justify-between">
            <span>المبلغ المدفوع:</span>
            <span>{order.paidAmount.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>المتبقي:</span>
            <span>{order.remainingAmount.toFixed(2)} ر.س</span>
          </div> */}
        </div>
      </div>
      {order?.isDelivered === false && (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="min-w-[180px] bg-primary text-white rounded-xl hover:!bg-primary text-sm hover:!text-white"
          disabled={order?.isDelivered} // Disable if already delivered
        >
          {order?.isDelivered === "DELIVERED"
            ? "تم الاستلام"
            : "تأكيد الاستلام"}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد استلام الطلب</DialogTitle>
            <DialogDescription className="text-right">
              الرجاء إدخال كود التأكيد المرسل إليك
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmationCode" className="text-right">
                كود التأكيد
              </Label>
              <Input
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="col-span-3"
                placeholder="أدخل الكود المكون من 6 أرقام"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelivery}
              disabled={isLoading || !confirmationCode}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Shipping Address */}
      {order.address && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-right">عنوان الشحن</h2>
          <p className="text-right bg-gray-50 p-3 rounded-lg">
            {order.address}
          </p>
        </div>
      )}

      {/* Payments */}
      {order.payments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-right">
            الدفعات ({order.payments.length})
          </h2>
          <div className="space-y-3">
            {order.payments.map((payment) => (
              <div
                key={payment.id}
                className="border-b pb-3 last:border-0 text-right"
              >
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {format(new Date(payment.paymentDate), "d MMMM yyyy", {
                      locale: arSA,
                    })}
                  </span>
                  <span className="font-medium">
                    {payment.amount.toFixed(2)} ر.س
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {payment.paymentMethod === "cash" && "نقدي"}
                  {payment.paymentMethod === "card" && "بطاقة ائتمان"}
                  {payment.paymentMethod === "transfer" && "تحويل بنكي"}
                </div>
                {payment.notes && (
                  <p className="text-sm text-gray-500 mt-1">
                    ملاحظات: {payment.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
