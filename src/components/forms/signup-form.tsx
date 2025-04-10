"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "../ui/icons";
import { useAuth as useAuthRegister } from "@/hooks/api/auth/useAuth";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { createUser } from "@/lib/actions/user.action";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const { registerForm } = useAuthRegister();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const handleSubmit = registerForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const response = await createUser(data);
      console.log("response", response);
      if (!response.success) {
        toast.error(response.error);
      } else {
        toast.success(`تم ارسال طلب تسجيل الحساب بنجاح`);

        registerForm.reset();
      }
      // router.push("/registration-success");
    } catch (error) {
      toast.error("فشل التسجيل");
      console.error("Registration Error:", error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Form {...registerForm}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField
          control={registerForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المستخدم</FormLabel>
              <FormControl>
                <Input placeholder="اسم المستخدم" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الايميل</FormLabel>
              <FormControl>
                <Input placeholder="الايميل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input placeholder="رقم الهاتف" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          ارسال طلب التسجيل
          <span className="sr-only">الذهاب الى صفحة تفعيل الايميل</span>
        </Button>
      </form>
    </Form>
  );
}
