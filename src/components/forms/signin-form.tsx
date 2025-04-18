"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
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
import { toast } from "sonner";

// Animation variants
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

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

const loginSchema = z.object({
  email: z.string().email("يرجى إدخال بريد إلكتروني صالح"),
  password: z.string(),
  // .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
  //   "كلمة المرور يجب أن تحتوي على حرف صغير، حرف كبير، ورقم على الأقل"
  // ),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function SignInForm() {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const attemptToLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const adminCheckResponse = await fetch("/api/check-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
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
        body: JSON.stringify({ email: data.email }),
      });

      const approvalCheck = await approvalCheckResponse.json();

      // Handle approval check messages
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
      // if ()
      // Check if user exists and is admin

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        // Update last login date after successful login
        await fetch("/api/user/update-last-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
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

        // Animate before redirect
        setTimeout(() => {
          router.push("/");
          window.location.reload();
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

  // Custom input component with animation
  const AnimatedInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & { isFocused: boolean }
  >(({ isFocused, ...props }, ref) => {
    return (
      <motion.div
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Input ref={ref} {...props} />
        {isFocused && (
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
    );
  });
  AnimatedInput.displayName = "AnimatedInput";

  // Custom password input with animation
  const AnimatedPasswordInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & { isFocused: boolean }
  >(({ isFocused, ...props }, ref) => {
    return (
      <motion.div
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <PasswordInput ref={ref} {...props} />
        {isFocused && (
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
    );
  });
  AnimatedPasswordInput.displayName = "AnimatedPasswordInput";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="w-full"
    >
      <Form {...form}>
        <form
          className="grid gap-4"
          onSubmit={(...args) =>
            void form.handleSubmit(attemptToLogin)(...args)
          }
        >
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      الايميل
                    </motion.span>
                  </FormLabel>
                  <FormControl>
                    <AnimatedInput
                      placeholder="example@gmail.com"
                      isFocused={focusedField === "email"}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    as={motion.div}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: form.formState.errors.email ? "auto" : 0,
                      opacity: form.formState.errors.email ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      الباسوورد
                    </motion.span>
                  </FormLabel>
                  <FormControl>
                    <AnimatedPasswordInput
                      placeholder="**********"
                      isFocused={focusedField === "password"}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    as={motion.div}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: form.formState.errors.password ? "auto" : 0,
                      opacity: form.formState.errors.password ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mt-2">
            <motion.div
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full transition-all duration-300"
              >
                {isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center"
                  >
                    <Icons.spinner
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>جاري التحميل...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    تسجيل الدخول
                  </motion.span>
                )}
                <span className="sr-only">Sign in</span>
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
