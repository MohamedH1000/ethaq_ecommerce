"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useMe } from "@/hooks/api/user/useMe";
import { IAddress } from "@/types";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AccountInformation = ({ currentUser }: { currentUser: User }) => {
  const [address, setAddress] = useState<IAddress | null | undefined>(null);
  const { me } = useMe();
  // console.log("currentUser", currentUser);
  useEffect(() => {
    if (me) {
      if (me?.addresses) {
        setAddress(me?.addresses?.find((x) => x.default));
      }
    } else {
      setAddress(null);
    }
  }, [me]);

  return (
    <div className="flex md:flex-row flex-col items-center gap-6 ">
      <Card className=" w-full min-h-[360px]">
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col justify-center items-center gap-3">
            {/* <Avatar className="w-[100px] h-[100px] ">
              <AvatarImage src={me?.avatar} alt={me?.lastName} />
              <AvatarFallback>{me?.lastName}</AvatarFallback>
            </Avatar> */}
            <Image
              src={currentUser?.image || "/assets/avatar.png"}
              alt={currentUser?.name as string}
              width={100}
              height={100}
              className="rounded-full w-[100px] h-[100px] mt-5"
            />
            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold leading-none tracking-tight">
                {currentUser?.name}
              </p>
              <h6 className="text-sm text-muted-foreground">
                {currentUser?.email}
              </h6>
            </div>

            <Button variant={"secondary"}>
              <Link href={"/account/edit"}>تعديل الملف الشخصي</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className=" min-h-[355px] w-full ">
        <CardContent className="flex flex-col gap-2 h-full">
          {!address && (
            <div className=" flex flex-col   ">
              <Link href={"/account/addresses/new"}>
                <div className="flex flex-col h-[330px] justify-center items-center gap-3">
                  <Icons.plus className="w-12 h-12 text-primary" />
                  <Button variant={"secondary"}>
                    <Link href={"/account/addresses/new"}>اضافة عنوان</Link>
                  </Button>
                </div>
              </Link>
            </div>
          )}

          {address && (
            <div className="flex flex-col">
              <span className="text-foreground text-md text-right mt-3 uppercase  ">
                الافتراضي
              </span>

              <div className="flex flex-col gap-4 ">
                <h2 className="text-gray-800 dark:text-white font-bold">
                  {address.name}
                </h2>
                <div>
                  {address.country}
                  <br />
                  {`${address.postcode}, ${address.city}, ${address.state}`}
                  <br />
                  {address.street}
                </div>

                <div>
                  <span>رقم الهاتف</span>
                  <p className="text-gray-800 dark:text-gray-200 font-bold">
                    {address.phone}
                  </p>
                </div>
                <div>
                  <span>البريد الالكتروني</span>
                  <p className="text-gray-800 dark:text-gray-300 font-bold">
                    {address.email}
                  </p>
                </div>
                {/* <Button variant={"link"} className="self-start p-0 text-xl">
                  <Link href={`/dashboard/addresses/${address._id}`}>
                    <span>تعديل العنوان</span>
                  </Link>
                </Button> */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountInformation;
