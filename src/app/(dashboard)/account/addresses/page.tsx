import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import { Shell } from "@/components/shells/shell";

import React from "react";
import AddressesInformation from "./components/AddressesInformation";
import { Metadata } from "next";
import { getCurrentUser, myAddresses } from "@/lib/actions/user.action";
import { User } from "@prisma/client";

export const metadata: Metadata = {
  title: "معلومات العناوين",
  description: "قم بادارة اعدادات العناوين",
};
const AddressPage = async () => {
  const currentUser: any = await getCurrentUser();
  const myAddresess = await myAddresses(currentUser?.id);
  // console.log("my addresses", myAddresess);
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
        <AddressesInformation data={myAddresess || []} />
      </section>
    </Shell>
  );
};

export default AddressPage;
