import Breadcrumb from "@/components/ui/breadcrumb";
import { getOrderById } from "@/lib/actions/order.action";
import CheckoutLeftSite from "@/modules/checkout/CheckoutLeftSite";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

const CheckoutPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const orderId: any = searchParams?.orderId;
  const orderDetails = await getOrderById(orderId);

  return (
    <div>
      {/* Breadcrumb Section */}
      <section className="h-12 py-10 bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <Breadcrumb />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-3 mt-6 gap-8 container">
        {/* Left Side (Checkout Form) */}
        <div className="col-span-3 md:col-span-2">
          <CheckoutLeftSite />
        </div>

        {/* Right Side (Order Summary) */}
        <div className="col-span-3 md:col-span-1">
          <div className="bg-gray-100 px-4 py-3 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>
            {/* Display Order Details */}
            {orderDetails && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">تفاصيل الطلب</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">رقم الطلب:</span>{" "}
                    {orderDetails.id}
                  </p>
                  <p>
                    <span className="font-semibold">تاريخ الطلب:</span>{" "}
                    {new Date(orderDetails.orderDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">الحالة:</span>{" "}
                    {orderDetails.status}
                  </p>
                  <p>
                    <span className="font-semibold">اجمالي السعر:</span> $
                    {orderDetails.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">القيمة المدفوعة:</span> $
                    {orderDetails.paidAmount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">القيمة المتبقية:</span> $
                    {orderDetails.remainingAmount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">تم الدفع:</span>{" "}
                    {orderDetails.isPaidFully ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">رقم المستخدم:</span>{" "}
                    {orderDetails.userId}
                  </p>
                </div>
              </div>
            )}
            <button className="w-full mt-4 bg-primary text-white p-4 rounded-lg font-bold text-md">
              التحويل لصفحة الدفع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
