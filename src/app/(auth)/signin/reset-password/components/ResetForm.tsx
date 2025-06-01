"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { sendResetPassword } from "@/lib/actions/user.action";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ResetForm = () => {
  // Updated schema for email validation
  const resetSchema = z.object({
    email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),
  });

  type ResetFormSchema = z.infer<typeof resetSchema>;

  const form = useForm<ResetFormSchema>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const attemptToReset = async (data: ResetFormSchema) => {
    setIsSubmitting(true);
    try {
      const response = await sendResetPassword({
        email: data.email, // Changed to send email instead of phone data
      });

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
        );
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة إعادة تعيين كلمة المرور");
      console.error("Error during password reset:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(attemptToReset)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span>البريد الإلكتروني</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="example@domain.com"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          استعادة كلمة المرور
          <span className="sr-only">Reset password</span>
        </Button>
      </form>
    </Form>
  );
};

export default ResetForm;
