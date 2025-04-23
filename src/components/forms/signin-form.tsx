"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Icons } from "../ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { CardFooter } from "../ui/card";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { cn } from "@/lib/utils";

// ... (keep your existing variants and countryCodes definitions)
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

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

// Updated schema to use phoneNumber with country code
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .transform((val) =>
      val.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    ) // Convert Arabic to Western
    .refine((val) => /^[0-9]+$/.test(val), "لا يمكن ان يكون الرقم فارغ")
    .refine(
      (val) => val.length >= 9,
      "يجب أن يكون رقم الهاتف 9 أرقام على الأقل"
    )
    .refine(
      (val) => val.length <= 15,
      "يجب أن يكون رقم الهاتف 15 رقماً كحد أقصى"
    ),
  countryCode: z.string().min(1, "يجب اختيار رمز الدولة"),
  otp: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
export function SignInForm() {
  const router = useRouter();
  const [otpSent, setOtpSent] = React.useState(false);
  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [countdown, setCountdown] = React.useState(0);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      countryCode: "+966",
      otp: "",
    },
  });
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const sendOtp = async (countryCode: string, phoneNumber: string) => {
    setIsSubmitting(true);
    try {
      // Send OTP via WhatsApp
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
        }),
      });
      // console.log(response, "response");
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        // Handle error in UI
        return;
      }

      setOtpSent(true);
      setCountdown(300); // 60 seconds countdown
      setStep("otp");
      toast.success("تم إرسال رمز التحقق إلى واتساب الخاص بك", {
        icon: "✅",
      });
    } catch (error) {
      toast.error("فشل إرسال رمز التحقق", {
        icon: "❌",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const verifyOtp = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const fullPhoneNumber = `${data?.countryCode}${data.phoneNumber}`;
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${data?.countryCode}${data?.phoneNumber}`,
          otp: data?.otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      const adminCheckResponse = await fetch("/api/check-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });

      if (!adminCheckResponse.ok) {
        throw new Error("Failed to check admin status");
      }

      const user = await adminCheckResponse.json();
      if (user && user.isAdmin) {
        toast.error("غير مسموح لك بالدخول. الصفحة خاصة بالمستخدم", {
          icon: (
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ❌
            </motion.div>
          ),
        });
        return;
      }

      const approvalCheckResponse = await fetch("/api/check-approvel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });

      const approvalCheck = await approvalCheckResponse.json();

      if (!approvalCheck.success) {
        toast.error(
          approvalCheck.message || "Failed to check approval status",
          {
            icon: (
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ❌
              </motion.div>
            ),
          }
        );
        return;
      }

      const signInResult = await signIn("credentials", {
        phoneNumber: fullPhoneNumber,
        redirect: false,
      });

      if (signInResult?.ok) {
        await fetch("/api/user/update-last-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
        });

        toast.success("تم تسجيل الدخول بنجاح", {
          icon: (
            <motion.div
              initial={{ rotate: 10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ✅
            </motion.div>
          ),
        });
        window.location.reload();
        setTimeout(() => {
          router.push("/");
          router.refresh();
          // window.location.reload();
        }, 500);
      } else if (signInResult?.error) {
        toast.error("بيانات تسجيل الدخول غير صحيحة", {
          icon: (
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ❌
            </motion.div>
          ),
        });
      }
    } catch (error) {
      toast.error("فشل تسجيل الدخول", {
        icon: (
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            ❌
          </motion.div>
        ),
      });
      console.error("Login Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const attemptToLogin = async (data: LoginFormData) => {
    if (step === "phone") {
      await sendOtp(data.countryCode, data.phoneNumber);
    } else {
      await verifyOtp(data);
    }
  };
  // Create refs for each input
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  // Modified attemptToLogin function (keep your existing implementation)

  // Stable input components that won't re-render unnecessarily
  const PhoneNumberInput = React.useMemo(() => {
    return React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement>
    >((props, ref) => (
      <motion.div
        animate={
          focusedField === "phoneNumber" ? { scale: 1.01 } : { scale: 1 }
        }
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Input ref={ref} type="tel" placeholder="5XXXXXXXX" {...props} />
        {focusedField === "phoneNumber" && (
          <motion.div
            layoutId="focus-highlight"
            className="absolute inset-0 rounded-md border-2 border-primary pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    ));
  }, [focusedField]);

  const PasswordInputField = React.useMemo(() => {
    return React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement>
    >((props, ref) => (
      <motion.div
        animate={focusedField === "password" ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <PasswordInput ref={ref} placeholder="**********" {...props} />
        {focusedField === "password" && (
          <motion.div
            layoutId="focus-highlight"
            className="absolute inset-0 rounded-md border-2 border-primary pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    ));
  }, [focusedField]);
  const resendOtp = async () => {
    if (countdown > 0) return; // Prevent resending during countdown

    setIsResending(true);
    try {
      const countryCode = form.getValues("countryCode");
      const phoneNumber = form.getValues("phoneNumber");

      // Validate phone number again
      await form.trigger(["countryCode", "phoneNumber"]);
      if (
        form.formState.errors.phoneNumber ||
        form.formState.errors.countryCode
      ) {
        toast.error("الرجاء إدخال رقم هاتف صحيح");
        return;
      }

      // Call the same sendOtp function but with resend flag
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
          isResend: true, // Add this flag if your API needs it
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      setCountdown(300); // Reset countdown
      toast.success("تم إعادة إرسال رمز التحقق", {
        icon: "✅",
      });
    } catch (error) {
      toast.error("فشل إعادة إرسال رمز التحقق", {
        icon: "❌",
      });
      console.error("Resend OTP Error:", error);
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="w-full"
      >
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(attemptToLogin)}
          >
            {step === "phone" ? (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-2 w-full items-start" // Added items-start
              >
                {/* Phone Number Field - Adjusted */}
                <div className="col-span-2 flex flex-col">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex flex-col h-full">
                        <FormLabel>رقم الهاتف</FormLabel>
                        <div className="flex flex-col flex-grow">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="5XXXXXXXX"
                              dir="rtl"
                              className="h-[50px]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-right" />{" "}
                          {/* Moved message here */}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country Code Selector - Adjusted */}
                <div className="col-span-1 flex flex-col">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col h-full">
                        <FormLabel className="invisible">رمز الدولة</FormLabel>{" "}
                        {/* Hidden but maintains alignment */}
                        <div className="flex-grow">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            dir="rtl"
                          >
                            <FormControl>
                              <SelectTrigger dir="rtl" className="h-[50px]">
                                <SelectValue placeholder="اختر رمز الدولة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent dir="rtl">
                              {countryCodes.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                  dir="rtl"
                                >
                                  {country.name} ({country.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="mt-1" />{" "}
                          {/* Added message container */}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
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
                                  className={cn(
                                    "h-14 w-14 max-sm:w-10 max-sm:h-10",
                                    "text-xl border-2 border-gray-300",
                                    "rounded-lg [&_input]:text-center" /* Center digits */
                                  )}
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
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className="flex w-full justify-center items-center gap-2"
            >
              {step === "phone" && (
                <>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-auto mt-5"
                  >
                    {isSubmitting ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال رمز التحقق"
                    )}
                  </Button>
                </>
              )}
              {step === "otp" && (
                <div className="mt-5 w-full flex flex-col items-start justify-center gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-[200px] text-lg "
                  >
                    {isSubmitting ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        جاري التحقق...
                      </>
                    ) : (
                      "تحقق"
                    )}
                  </Button>

                  <div className="flex items-center justify-between  w-full mt-3">
                    <Button
                      onClick={resendOtp}
                      variant="outline"
                      disabled={isResending || countdown > 0}
                      className="border-none text-sm"
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
                </div>
              )}
            </motion.div>
            {/* 
            {step === "otp" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm"
              >
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-primary underline"
                >
                  تغيير رقم الهاتف
                </button>
              </motion.div>
            )} */}
          </form>
        </Form>
      </motion.div>

      {step === "phone" && (
        <CardFooter className="flex flex-col items-start w-full mt-3 px-0">
          <div className="text-sm text-muted-foreground flex items-center gap-2 ml-0">
            <span className="hidden sm:inline-block">ليس لديك حساب مسجل؟</span>
            <Link
              aria-label="Sign up"
              href="/signup"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              ارسال طلب تسجيل
            </Link>
          </div>
        </CardFooter>
      )}
    </div>
  );
}
