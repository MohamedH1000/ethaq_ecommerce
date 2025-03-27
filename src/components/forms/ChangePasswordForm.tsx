"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "يرجى إدخال كلمة المرور الحالية"),
    newPassword: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "كلمة المرور يجب أن تحتوي على حرف صغير، حرف كبير، ورقم على الأقل"
      ),
    newPasswordConfirm: z.string().min(1, "يرجى تأكيد كلمة المرور الجديدة"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "كلمات المرور غير متطابقة",
    path: ["newPasswordConfirm"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const attemptToChangePassword = async (data: ChangePasswordFormData) => {
    setChangePasswordLoading(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل تغيير كلمة المرور");
      }

      const result = await response.json();
      toast.success("تم تغيير كلمة المرور بنجاح");
      changePasswordForm.reset();
      return result;
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور");
      throw error;
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <Form {...changePasswordForm}>
      <form
        className="grid gap-4"
        onSubmit={(...args) =>
          void changePasswordForm.handleSubmit(attemptToChangePassword)(...args)
        }
      >
        <FormField
          control={changePasswordForm.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الباسوورد القديم</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={changePasswordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الباسوورد الجديد</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={changePasswordForm.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد الباسوورد الجديد</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={changePasswordLoading}>
          {changePasswordLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          تغيير كلمة المرور
          <span className="sr-only">Change password</span>
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
