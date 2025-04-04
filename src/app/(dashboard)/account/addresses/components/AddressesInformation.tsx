"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useAddress } from "@/hooks/api/addresses/useAddress";
import { useGetAddresses } from "@/hooks/api/addresses/useGetAddresses";
import Link from "next/link";
import React from "react";
import AddressCard from "./AddressCard";

const AddressesInformation = () => {
  const { data, isLoading } = useGetAddresses();
  const { addressDeleteLoading, attemptToDeleteAddress } = useAddress();
  // if(isLoading){
  //   return AddressesLoading()
  // }
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
      {data?.docs?.map((address, index) => (
        <React.Fragment key={index}>
          <AddressCard
            className="addresses-list__item"
            address={address}
            label={address.default ? <span>الافتراضي</span> : <span></span>}
            loading={isLoading}
            footer={
              <React.Fragment>
                <Button variant={"link"} className="p-0">
                  <Link href={`/dashboard/addresses/${address._id}`}>
                    تعديل العنوان
                  </Link>
                </Button>
                &nbsp;&nbsp;
                {/* eslint-disable-next-line */}
                <Button
                  variant={"link"}
                  className="p-0"
                  disabled={addressDeleteLoading}
                  onClick={(event) => {
                    event.preventDefault();
                    attemptToDeleteAddress(address._id);
                  }}
                >
                  حذف
                </Button>
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
