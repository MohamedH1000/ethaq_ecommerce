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
import { Checkbox } from "../ui/checkbox";

import { zodResolver } from "@hookform/resolvers/zod";
import { infer, z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addAddress } from "@/lib/actions/user.action";
import { addressSchema } from "@/lib/schemas/address";

type AddressFormData = z.infer<typeof addressSchema>;
const AddressFrom = () => {
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      country: "المملكة العربية السعودية", // Default for KSA
      street: "",
      city: "",
      state: "",
      postcode: "",
      email: "",
      phone: "",
      default: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
    }
  };
  return (
    <Form {...form}>
      <form className="grid gap-6 " onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="الاسم الكامل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country Field */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدولة</FormLabel>
              <FormControl>
                <Input placeholder="المملكة العربية السعودية" {...field} />
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

        {/* Postcode Field */}
        <FormField
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
        />

        {/* Email and Phone */}
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>الايميل</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>رقم المحمول</FormLabel>
                <FormControl>
                  <Input placeholder="+966501234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Default Address Checkbox */}
        <FormField
          control={form.control}
          name="default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>تعيين كعنوان افتراضي</FormLabel>
              </div>
            </FormItem>
          )}
        />

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
