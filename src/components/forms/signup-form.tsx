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
import { toast } from "sonner";
import { checkPhone, createUser } from "@/lib/actions/user.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

// Country codes data
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
const formSchema = z.object({
  username: z.string().min(2),
  phoneNumber: z
    .string()
    .transform((val) =>
      val.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    ) // Convert Arabic to Western
    .refine(
      (val) => /^[0-9]+$/.test(val),
      "يجب أن يحتوي رقم الهاتف على أرقام فقط"
    )
    .refine(
      (val) => val.length >= 9,
      "يجب أن يكون رقم الهاتف 9 أرقام على الأقل"
    )
    .refine(
      (val) => val.length <= 15,
      "يجب أن يكون رقم الهاتف 15 رقماً كحد أقصى"
    ),
  countryCode: z.string(),
  otp: z.string().optional(),
});
export function SignUpForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      countryCode: "+966",
      username: "",
      otp: "",
    },
  });

  console.log(form.getValues());
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      // Validate form first

      const fullPhoneNumber = `${form.getValues("countryCode")}${form.getValues(
        "phoneNumber"
      )}`;

      await form.trigger(["countryCode", "phoneNumber"]);
      if (
        form.formState.errors.phoneNumber ||
        form.formState.errors.countryCode
      ) {
        toast.error("الرجاء إدخال رقم هاتف صحيح");
        return;
      }
      const response: any = await checkPhone(fullPhoneNumber);
      // console.log("response", response);
      if (!response?.success) {
        toast.error(response?.message);
        setIsLoading(false);
        return;
      }
      const optsent = await fetch("/api/send-otp/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
        }),
      });
      // console.log("otpsent", optsent);
      if (!optsent.ok) {
        const errorData = await optsent.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }
      setStep("otp");
      // console.log("otp", form.getValues());
      form.setValue("otp", "");
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown
      toast.success(`تم إرسال رمز التحقق إلى ${fullPhoneNumber}`);
    } catch (error) {
      toast.error("فشل إرسال رمز التحقق، يرجى المحاولة لاحقاً");
      console.error("OTP sending error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (
    values: z.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    try {
      const fullPhoneNumber = `${values?.countryCode}${values.phoneNumber}`;
      const verify = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          otp: values?.otp,
        }),
      });

      if (!verify.ok) {
        const errorData = await verify.json();
        // console.log("error data", errorData);
        toast.error(errorData?.message);
        return;
      }
      // Verify OTP

      const userData = {
        ...values,
        phoneNumber: fullPhoneNumber,
      };

      const response = await createUser(userData);

      if (!response?.success) {
        toast.error(response?.message);
      } else {
        toast.success(`تم ارسال طلب تسجيل الحساب بنجاح`);
        form.reset();
        setOtpSent(false);
      }
    } catch (error) {
      toast.error("فشل التسجيل");
      console.error("Registration Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(
          otpSent ? handleVerifyAndRegister : handleSendOtp
        )}
      >
        {step === "phone" && (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="اسم المستخدم"
                      {...field}
                      disabled={otpSent}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="5XXXXXXXX"
                          type="tel" // Better for phone numbers
                          inputMode="numeric" //
                          pattern="[0-9]*"
                          autoComplete="off"
                          {...field}
                          disabled={otpSent}
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
                      <FormLabel>رمز الدولة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={otpSent}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر رمز الدولة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({country.code})
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
          </>
        )}
        {step === "otp" && (
          <>
            <div
              className="w-full" // Removed grid classes here
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-right w-full block">
                      رمز التحقق
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center w-full">
                        <InputOTP
                          maxLength={6}
                          {...field}
                          className="w-full justify-center"
                        >
                          <InputOTPGroup
                            className="gap-2 max-sm:gap-0 justify-center"
                            dir="ltr"
                          >
                            {[...Array(6)].map((_, index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className="h-14 w-14 max-sm:w-10 max-sm:h-10 text-xl border-2 border-gray-300 rounded-lg"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleSendOtp}
                disabled={isLoading || countdown > 0}
              >
                {countdown > 0
                  ? `إعادة إرسال (${countdown})`
                  : "إعادة إرسال الرمز"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setOtpSent(false);
                  setStep("phone");
                  form.setValue("otp", ""); // Reset OTP field
                }}
              >
                رجوع
              </Button>
            </div>
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {otpSent ? "تأكيد التسجيل" : "إرسال رمز التحقق"}
        </Button>
      </form>
    </Form>
  );
}
