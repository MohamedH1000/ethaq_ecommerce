import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import { Shell } from "@/components/shells/shell";

import React from "react";
import AddressesInformation from "./components/AddressesInformation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "معلومات العناوين",
  description: "قم بادارة اعدادات العناوين",
};
const AddressPage = async () => {
  return (
    <Shell variant={"sidebar"}>
      <PageHeader
        id="addresses-header"
        aria-labelledby="Addresses-header-heading"
      >
        <PageHeaderHeading size="sm">العناوين</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          قم بادارة اعدادات العناوين
        </PageHeaderDescription>
      </PageHeader>

      <section className="">
        <AddressesInformation />
      </section>
    </Shell>
  );
};

export default AddressPage;
