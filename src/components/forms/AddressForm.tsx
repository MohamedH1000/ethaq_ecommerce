"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addAddress } from "@/lib/actions/user.action";
import { addressSchema } from "@/lib/schemas/address";
import { useRouter } from "next/navigation";

type AddressFormData = z.infer<typeof addressSchema>;
const AddressFrom = () => {
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await addAddress(data);
      if (result.success) {
        toast.success("تم إضافة العنوان بنجاح");
        form.reset();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء إضافة العنوان"
      );
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };
  return (
    <Form {...form}>
      <form className="grid gap-6 " onSubmit={form.handleSubmit(onSubmit)}>
        {/* City Field */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المدينة</FormLabel>
              <FormControl>
                <Input placeholder="المدينة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State Field */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المنطقة</FormLabel>
              <FormControl>
                <Input placeholder="المنطقة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Street Field */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الشارع</FormLabel>
              <FormControl>
                <Textarea placeholder="رقم المنزل واسم الشارع" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Postcode Field */}
        {/* <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرمز البريدي</FormLabel>
              <FormControl>
                <Input placeholder="الرمز البريدي" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          حفظ العنوان
        </Button>
      </form>
    </Form>
  );
};

export default AddressFrom;
