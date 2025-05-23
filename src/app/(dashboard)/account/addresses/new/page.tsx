import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import AddressFrom from "@/components/forms/AddressForm";
import { Shell } from "@/components/shells/shell";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "عنوان جديد",
  description: "اضافة عنوان جديد لحسابك",
};

const NewAddress = () => {
  return (
    <Shell variant={"sidebar"}>
      <PageHeader id="account-header" aria-labelledby="account-header-heading">
        <PageHeaderHeading size="sm">عنوان جديد</PageHeaderHeading>
        <PageHeaderDescription className="text-sm text-muted-foreground">
          اضف عنوان جديد لحسابك
        </PageHeaderDescription>
        <div className="mt-5 p-3">
          <AddressFrom />
        </div>
      </PageHeader>
    </Shell>
  );
};

export default NewAddress;
