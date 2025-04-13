"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import React, { useState } from "react";
import AddressCard from "./AddressCard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteAddress } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import router from "next/router";

const AddressesInformation = ({ data }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleDeleteAddress = async (id: string) => {
    if (!addressToDelete) return;

    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response: any = await deleteAddress(id);

      if (!response?.ok) {
        toast.error(response.message);
      }

      toast.success("تم حذف العنوان بنجاح");
    } catch (error) {
      // toast.error("فشل في حذف العنوان");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };
  return (
    <section className="grid  md:grid-cols-2 lg:grid-cols-3  gap-3">
      <Card className=" min-h-[350px]">
        <CardContent>
          <div className=" flex flex-col   ">
            <Link href={"/account/addresses/new"}>
              <div className="flex flex-col h-[330px] justify-center items-center gap-3">
                <Icons.plus className="w-12 h-12 text-primary" />
                <Button variant={"secondary"}>اضافة عنوان</Button>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
      {data?.map((address: any, index: any) => (
        <React.Fragment key={index}>
          <AddressCard
            className="addresses-list__item"
            address={address}
            label={address?.default ? <span>الافتراضي</span> : <span></span>}
            loading={isLoading}
            footer={
              <React.Fragment>
                {/* <Button variant={"link"} className="p-0">
                  <Link href={`/dashboard/addresses/${address._id}`}>
                    تعديل العنوان
                  </Link>
                </Button> */}
                &nbsp;&nbsp;
                {/* eslint-disable-next-line */}
                <Button
                  variant={"link"}
                  className="p-0 text-red-500 hover:text-red-700"
                  disabled={isLoading}
                  onClick={(event) => {
                    event.preventDefault();
                    setAddressToDelete(address.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  حذف
                </Button>
                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogContent className="max-w-md z-[1000]">
                    <DialogHeader>
                      <DialogTitle>تأكيد الحذف</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-gray-700">
                        هل أنت متأكد أنك تريد حذف هذا العنوان؟
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        لا يمكنك التراجع عن هذا الإجراء
                      </p>
                    </div>
                    <DialogFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteAddress(address?.id)}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        تأكيد الحذف
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </React.Fragment>
            }
          />
        </React.Fragment>
        // <Card key={address._id} className=' min-h-[350px]'>
        //   <CardContent>
        //     <div>{address.name}</div>
        //   </CardContent>
        // </Card>
      ))}
    </section>
  );
};

export default AddressesInformation;
