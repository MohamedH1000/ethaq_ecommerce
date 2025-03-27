"use client";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import { Shell } from "@/components/shells/shell";
import React from "react";
import { useMe } from "@/hooks/api/user/useMe";
import loading from "./loading";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";

const ChangePassword = () => {
  return (
    <Shell variant={"sidebar"}>
      <PageHeader
        id="change-password-header"
        aria-labelledby="change-password-header-heading"
      >
        <PageHeaderHeading size="sm">تغيير الباسوورد</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          قم بتغيير الباسوورد الخاص بك
        </PageHeaderDescription>
      </PageHeader>
      <section className="px-1">
        <ChangePasswordForm />
      </section>
    </Shell>
  );
};

export default ChangePassword;
