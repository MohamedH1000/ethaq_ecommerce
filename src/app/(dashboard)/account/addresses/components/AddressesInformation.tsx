"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import React, { useState } from "react";
import AddressCard from "./AddressCard";

const AddressesInformation = ({ data }: any) => {
  const [isLoading, setIsLoading] = useState(false);
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
                  disabled={isLoading}
                  onClick={(event) => {
                    event.preventDefault();
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
