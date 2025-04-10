import { Shell } from "@/components/shells/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/actions/user.action";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ResetForm from "./components/ResetForm";

const page = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/");
  }
  return (
    <Shell className="max-w-lg ">
      <Card className="">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">استعادة الباسوورد</CardTitle>
          <CardDescription>
            الرجاء قم بادخال ايميلك لاستعادة الباسوورد الخاص بك
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* <OAuthSignIn />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
          <ResetForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          {/* <p className="text-sm">هل تذكرت الباسوورد الخاص بك؟</p> */}
          <Link
            aria-label="Sign In"
            href="/signin"
            className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
          >
            رجوع
          </Link>
        </CardFooter>
      </Card>
    </Shell>
  );
};

export default page;
