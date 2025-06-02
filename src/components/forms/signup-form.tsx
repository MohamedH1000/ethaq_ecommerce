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
import { cn } from "@/lib/utils";

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
  email: z.string().email(),
  // password: z
  //   .string()
  //   .min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل")
  //   .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
  //   .regex(/[a-z]/, "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل")
  //   .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
  //   .regex(
  //     /[^A-Za-z0-9]/,
  //     "يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل"
  //   ),
  // confirmPassword: z.string(),
  otp: z.string().optional(),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "كلمات المرور غير متطابقة",
//   path: ["confirmPassword"], // This shows the error on confirmPassword field
// });
export function SignUpForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [emailForOtp, setEmailForOtp] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      countryCode: "+966",
      username: "",
      email: "",
      // password: "",
      // confirmPassword: "",
      otp: "",
    },
  });

  console.log(form.getValues());

  const sendOtpToEmail = async (email: string) => {
    try {
      // First check if user exists
      const userCheckResponse = await fetch("/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const userCheckData = await userCheckResponse.json();

      if (userCheckData.exists) {
        toast.error("هذا البريد الإلكتروني مسجل بالفعل, يرجى تسجيل الدخول");
        return false;
      }

      // If user doesn't exist, proceed with OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("signupOtp", otp);
      localStorage.setItem("signupEmail", email);

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "رمز التحقق لتسجيل الحساب",
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4CAF50;">مرحباً بك في ايثاق مارت</h2>
              <p>شكراً لتسجيلك معنا. يرجى استخدام رمز التحقق التالي لإكمال عملية التسجيل:</p>
              <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold;">
                ${otp}
              </div>
              <p>هذا الرمز صالح لمدة 10 دقائق فقط.</p>
              <p>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.</p>
            </div>`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("حدث خطأ أثناء إرسال رمز التحقق");
      return false;
    }
  };
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (!otpSent) {
        // First step: Send OTP
        const otpSent = await sendOtpToEmail(values.email);
        if (otpSent) {
          setOtpSent(true);
          setEmailForOtp(values.email);
          // toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
        } else {
          // toast.error("فشل في إرسال رمز التحقق");
        }
      } else {
        // Second step: Verify OTP and register
        const storedOtp = localStorage.getItem("signupOtp");
        if (values.otp !== storedOtp) {
          toast.error("رمز التحقق غير صحيح");
          return;
        }

        const fullPhoneNumber = `${values.countryCode}${values.phoneNumber}`;
        const userData = {
          ...values,
          phoneNumber: fullPhoneNumber,
        };

        const response = await createUser(userData);

        if (response?.success) {
          toast.success("تم إنشاء الحساب بنجاح");
          form.reset();
          setOtpSent(false);
          localStorage.removeItem("signupOtp");
          localStorage.removeItem("signupEmail");
          // Redirect or do something else
        } else {
          toast.error(response?.message || "فشل في إنشاء الحساب");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء عملية التسجيل");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        {!otpSent ? (
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
                      disabled={isLoading}
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
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="off"
                          {...field}
                          disabled={isLoading}
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
                        disabled={isLoading}
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الايميل</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="الايميل"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="كلمة المرور"
                      type="password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="تأكيد كلمة المرور"
                      type="password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              إرسال رمز التحقق
            </Button>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                تم إرسال رمز التحقق إلى البريد الإلكتروني: {emailForOtp}
              </p>
            </div>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-right w-full block">
                    رمز التحقق
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center w-full" dir="ltr">
                      <InputOTP
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        {...field}
                        dir="ltr" // Force LTR direction
                        className="w-full justify-center gap-2"
                        onChange={(value) => {
                          // Force numeric input
                          field.onChange(value.replace(/\D/g, ""));
                        }}
                      >
                        <InputOTPGroup className="gap-2 w-full justify-between">
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={cn(
                                "max-md:h-12 max-md:w-12 h-14 w-14", // Large square slots
                                "text-xl font-medium", // Larger text
                                "border-2 border-gray-300 dark:border-gray-600", // Subtle border
                                "rounded-md", // Slightly rounded corners
                                "focus:border-primary focus:ring-2 focus:ring-primary/20", // Focus styles
                                "transition-all duration-200", // Smooth transitions
                                "hover:border-gray-400 dark:hover:border-gray-500", // Hover effect
                                "[&_input]:text-center" // Center the digits
                              )}
                              onKeyDown={(e) => {
                                // Only allow numbers and control keys
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                  ].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
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

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOtpSent(false)}
                disabled={isLoading}
                className="flex-1"
              >
                رجوع
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                تأكيد وإنشاء الحساب
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
