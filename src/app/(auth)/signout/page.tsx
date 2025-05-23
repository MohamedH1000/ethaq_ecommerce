import type { Metadata } from "next";

import { Shell } from "@/components/shells/shell";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import { LogOutButtons } from "@/components/auth/logout-buttons";

export const metadata: Metadata = {
  title: "Sign out",
  description: "Sign out of your account",
};

export default function SignOutPage() {
  return (
    <Shell className="max-w-xs">
      <PageHeader
        id="sign-out-page-header"
        aria-labelledby="sign-out-page-header-heading"
        className="text-center"
      >
        <PageHeaderHeading size="sm">تسجيل الخروج</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          هل انت متاكد من تسجيل الخروج
        </PageHeaderDescription>
      </PageHeader>
      <LogOutButtons />
    </Shell>
  );
}
