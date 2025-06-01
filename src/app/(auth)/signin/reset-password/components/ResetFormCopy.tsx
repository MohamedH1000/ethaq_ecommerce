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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendResetPassword } from "@/lib/actions/user.action";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ResetForm = () => {
  const resetSchema = z.object({
    countryCode: z.string().min(1, "يجب اختيار رمز الدولة"),
    phoneNumber: z
      .string()
      .min(9, "يجب أن يكون رقم الهاتف 9 أرقام على الأقل")
      .max(15, "يجب أن يكون رقم الهاتف 15 رقماً كحد أقصى")
      .regex(/^[0-9]+$/, "يجب أن يحتوي رقم الهاتف على أرقام فقط"),
  });
  const countryCodes = [
    { code: "+966", name: "السعودية", flag: "🇸🇦" },
    { code: "+20", name: "مصر", flag: "🇪🇬" },
    { code: "+971", name: "الإمارات", flag: "🇦🇪" },
    { code: "+973", name: "البحرين", flag: "🇧🇭" },
    { code: "+974", name: "قطر", flag: "🇶🇦" },
    { code: "+968", name: "عمان", flag: "🇴🇲" },
    { code: "+965", name: "الكويت", flag: "🇰🇼" },
    { code: "+962", name: "الأردن", flag: "🇯🇴" },
    { code: "+963", name: "سوريا", flag: "🇸🇾" },
    { code: "+964", name: "العراق", flag: "🇮🇶" },
  ];
  type ResetFormSchema = z.infer<typeof resetSchema>;

  const form = useForm<ResetFormSchema>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      countryCode: "+966",
      phoneNumber: "",
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
        toast.success(
          "تم ارسال الباسوورد الجديد على رقم الهاتف عبر الواتساب بنجاح"
        );
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
      <form className="grid gap-4" onSubmit={form.handleSubmit(attemptToReset)}>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>رقم الهاتف</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="5XXXXXXXX"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>رمز الدولة</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر رمز الدولة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
