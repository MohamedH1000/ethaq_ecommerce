import React from "react";
import { OrderTable } from "./components/order-table";
import { columns } from "./components/columns";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getMyOrders } from "@/lib/actions/order.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
const MyOrders = async () => {
  const currentUser: any = await getCurrentUser();
  const myorders = await getMyOrders(currentUser?.id);
  // console.log("myorders", myorders);
  // const { totalPaid, totalRemaining }: any = myorders?.reduce(
  //   (acc: any, order: any) => {
  //     return {
  //       totalPaid: acc.totalPaid + order.paidAmount,
  //       totalRemaining: acc.totalRemaining + order.remainingAmount,
  //     };
  //   },
  //   { totalPaid: 0, totalRemaining: 0 } // Initial values
  // );
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-xl">المبالغ</h1>
      </div>
      <div className="mt-5 flex items-center justify-start gap-3">
        <Card className="w-[250px]">
          <CardHeader>
            <CardTitle>المبلغ المتبقي</CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser.remainingAmount.toFixed(2)} ريال
          </CardContent>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary text-white hover:text-white">
              عرض سجل الدفع
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <>
              <h2 className="text-xl font-semibold my-4 text-right">
                الدفعات ({currentUser?.payments.length})
              </h2>

              {currentUser?.payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table dir="rtl">
                    <TableHeader>
                      <TableRow>
                        {/* <TableHead className="text-right">رقم الدفعة</TableHead> */}
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">
                          طريقة الدفع
                        </TableHead>
                        <TableHead className="text-right">ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUser?.payments.map((payment: any) => (
                        <TableRow key={payment.id} className="hover:bg-gray-50">
                          {/* <TableCell className="font-medium">
                            #{payment.id.slice(-6)}
                          </TableCell> */}
                          <TableCell>
                            {format(
                              new Date(payment.paymentDate),
                              "d MMM yyyy",
                              {
                                locale: arSA,
                              }
                            )}
                          </TableCell>
                          <TableCell>{payment.amount.toFixed(2)} ر.س</TableCell>
                          <TableCell>
                            {payment.paymentMethod === "cash" && "نقدي"}
                            {payment.paymentMethod === "card" && "بطاقة ائتمان"}
                            {payment.paymentMethod === "transfer" &&
                              "تحويل بنكي"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {payment.notes || "لا توجد ملاحظات"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">لا توجد دفعات</p>
              )}
            </>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-5 w-full">
        <OrderTable columns={columns} data={myorders} />
      </div>
    </>
  );
};

export default MyOrders;
