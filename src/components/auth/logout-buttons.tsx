"use client";

import * as React from "react";
import { redirect, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "../ui/icons";
import { useAuth } from "@/hooks/api/auth/useAuth";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export function LogOutButtons() {
  const router = useRouter();
  const mounted = useMounted();
  const [isLoading, setIsLoading] = React.useState(false);
  const { IsLogoutError } = useAuth();
  const [isPending, startTransition] = React.useTransition();
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" }); // Redirect to the home page after sign-out
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error) {
      console.error("Error during sign-out:", error);
      toast.error("فشل تسجيل الخروج");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex w-full items-center space-x-2">
      {mounted ? (
        <Button
          aria-label="Log out"
          size="sm"
          className="w-full"
          disabled={isLoading}
          onClick={logout}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          تسجيل الخروج
        </Button>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full bg-muted text-muted-foreground"
          )}
        >
          تسجيل الخروج
        </Skeleton>
      )}
      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={isPending}
      >
        الرجوع
      </Button>
    </div>
  );
}
