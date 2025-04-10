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
  const resetSchema = z.object({
    email: z.string().email("يرجى إدخال بريد إلكتروني الخاص بك"),
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
    console.log(data);
    try {
      setIsSubmitting(true);
      const response = await sendResetPassword(data);
      // console.log(response, "response");
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success("تم ارسال الباسوورد الجديد على الايميل بنجاح");
      }

      //   console.log("is submmitting", isSubmitting);
    } catch (error) {
      toast.error("حدث مشكلة اثناء استعادة الباسوورد الخاص بك");
      console.error("مشكلة اثناء تسجيل الدخول", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(attemptToReset)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الايميل</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
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
          استعادة الباسوورد
          <span className="sr-only">reset password</span>
        </Button>
      </form>
    </Form>
  );
};

export default ResetForm;
