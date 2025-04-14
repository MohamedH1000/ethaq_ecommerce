"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { confirmDelivery } from "@/lib/actions/order.action";

// Define the shape of Category data based on your Prisma schema
export type Category = {
  id: string;
  name: string;
  images?: string;
  products: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
};

// Server action imports

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "orderDate",
    header: "تاريخ الطلب",
    cell: ({ row }) => {
      const date = new Date(row.original.orderDate);
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
  },
  // {
  //   accessorKey: "images",
  //   header: "الصورة",
  //   cell: ({ row }) => (
  //     <div className="flex gap-1">
  //       {row.original.images ? (
  //         <img
  //           src={row.original.images}
  //           alt={row.original.name}
  //           className="w-10 h-10 object-cover rounded"
  //         />
  //       ) : (
  //         "لا توجد صورة"
  //       )}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "status",
    header: "حالة الطلب",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusMap = {
        pending: "قيد الانتظار",
        processing: "قيد المعالجة",
        shipped: "تم الشحن",
        delivered: "تم التسليم",
        cancelled: "ملغى",
      };

      return statusMap[status] || status; // Fallback to raw status if not found
    },
  },
  {
    accessorKey: "totalAmount",
    header: "اجمالي المبلغ",
    cell: ({ row }) => <span>{row.original.totalAmount.toFixed(2)} ريال</span>,
  },
  {
    accessorKey: "orderItems",
    header: "تفاصيل الطلب",
    size: 250,
    minSize: 200,
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          onClick={() => router.push(`/account/orders/${row.original.id}`)}
          variant="outline"
          className="min-w-[180px] bg-primary text-white rounded-xl hover:!bg-primary text-sm
        hover:!text-white"
        >
          عرض الطلب
          {/* ({row.original.orderItems?.length || 0}) */}
        </Button>
      );
    },
  },
  {
    accessorKey: "confirmDelivery",
    header: "تأكيد الاستلام",
    size: 250,
    minSize: 200,
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const [confirmationCode, setConfirmationCode] = useState("");
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();

      const handleConfirmDelivery = async () => {
        setIsLoading(true);
        try {
          const response = await confirmDelivery(
            row.original.id,
            confirmationCode
          );

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

      return (
        <>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="min-w-[180px] bg-primary text-white rounded-xl hover:!bg-primary text-sm hover:!text-white"
            disabled={row.original?.isDelivered} // Disable if already delivered
          >
            {row.original?.isDelivered === "DELIVERED"
              ? "تم الاستلام"
              : "تأكيد الاستلام"}
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-right">
                  تأكيد استلام الطلب
                </DialogTitle>
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
        </>
      );
    },
  },

  // {
  //   accessorKey: "paidAmount",
  //   header: "المبلغ المدفوع",
  //   cell: ({ row }) => <span>{row.original.paidAmount} SAR</span>,
  // },
  // {
  //   accessorKey: "remainingAmount",
  //   header: "المبلغ المتبقي",
  //   cell: ({ row }) => <span>{row.original.remainingAmount} SAR</span>,
  // },
  // {
  //   accessorKey: "isPaidFully",
  //   header: "حالة انتهاء الدفع",
  // },
  // {
  //   accessorKey: "address",
  //   header: "العنوان",
  // },
  // {
  //   accessorKey: "userId",
  //   header: "رقم المستخدم",
  // },
  // {
  //   accessorKey: "details",
  //   header: "عرض التفاصيل",
  //   cell: ({ row }) => {
  //     const router = useRouter();
  //     const handleRowClick = (id: string) => {
  //       router.push(`/account/orders/${id}`);
  //     };
  //     return (
  //       <Button
  //         onClick={() => handleRowClick(row.original.id)}
  //         className="bg-primay text-white"
  //       >
  //         عرض التفاصيل
  //       </Button>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "actions",
  //   header: "الإجراءات",
  //   cell: ({ row }) => {
  //     const category = row.original;
  //     const router = useRouter();

  //     const handleEdit = () => {
  //       router.push(`/admin/categories/edit/${category.id}`);
  //     };

  //     const handleDelete = async () => {
  //       if (
  //         confirm(
  //           "هل أنت متأكد من حذف هذه الفئة, اذا تم التاكيد فانه سيتم ازالة الفئة من المنتجات المرتبطه بها؟"
  //         )
  //       ) {
  //         try {
  //           // await deleteCategory(category.id);
  //           toast.success("تم حذف الفئة بنجاح");
  //           router.refresh();
  //         } catch (error) {
  //           console.error("Deletion error:", error);
  //           toast.error("فشل في حذف الفئة");
  //         }
  //       }
  //     };

  //     return (
  //       <div className="flex gap-2 justify-center">
  //         <button
  //           onClick={handleEdit}
  //           className="p-1 rounded-full hover:bg-blue-100 transition-colors"
  //           title="تعديل الفئة"
  //         >
  //           <Edit className="w-5 h-5 text-blue-600" />
  //         </button>
  //         <button
  //           onClick={handleDelete}
  //           className="p-1 rounded-full hover:bg-red-100 transition-colors"
  //           title="حذف الفئة"
  //         >
  //           <Trash2 className="w-5 h-5 text-red-600" />
  //         </button>
  //       </div>
  //     );
  //   },
  // },
];
// {/* <Dialog>
// <DialogTrigger asChild>
//   <Button
//     onClick={() =>
//       router.push(`/account/orders/${row.original.id}`)
//     }
//     variant="outline"
//     className="min-w-[180px] bg-primary text-white rounded-md hover:!bg-primary text-sm
//     hover:!text-white"
//   >
//     عرض الطلب
//     {/* ({row.original.orderItems?.length || 0}) */}
//   </Button>
// </DialogTrigger>
// <DialogContent className="sm:max-w-[500px]">

//   <div className="space-y-4 max-h-[60vh] overflow-y-auto">

//     {row.original.orderItems?.map((item: any) => (
//       <div
//         key={item.id}
//         className="flex items-start border-b pb-4 gap-4"
//       >
//         <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
//           {item.product.images[0] && (
//             <Image
//               src={item.product.images[0]}
//               alt={item.product.name}
//               width={96}
//               height={96}
//               className="object-cover w-full h-full"
//             />
//           )}
//         </div>
//         <div className="flex-1 text-right">
//           <h3 className="font-medium text-gray-800">
//             {item.product.name}
//           </h3>
//           <p className="text-sm text-gray-500 line-clamp-2">
//             {item.product.description}
//           </p>
//           <div className="mt-2 flex justify-between items-center">
//             <span className="text-gray-600">
//               {item.quantity} × {item.priceAtPurchase} ر.س
//             </span>
//             <span className="font-medium">
//               {(item.quantity * item.priceAtPurchase).toFixed(2)}{" "}
//               ر.س
//             </span>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// </DialogContent>
// </Dialog> */}
