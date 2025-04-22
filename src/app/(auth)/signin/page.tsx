import { type Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Shell } from "@/components/shells/shell";
import { SignInForm } from "@/components/forms/signin-form";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/user.action";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "تسجيل الدخول لحسابك",
};

export default async function SignInPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/");
  }
  return (
    <Shell className="max-w-lg ">
      <Card className="">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            الرجاء قم بادخال بيانات تسجيل الدخول
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
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
          <SignInForm />
        </CardContent>
      </Card>
    </Shell>
  );
}
