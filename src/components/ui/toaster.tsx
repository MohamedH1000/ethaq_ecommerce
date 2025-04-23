"use client";

import { Toaster as RadToaster } from "sonner";
import { useEffect, useState } from "react";

export function Toaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <RadToaster
      duration={20000}
      position={isMobile ? "bottom-center" : "bottom-right"}
      offset={isMobile ? "50px" : undefined} // Changed from 20px to 50px
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          bottom: isMobile ? "50px" : undefined, // Explicit bottom positioning
          marginBottom: isMobile ? "0" : undefined, // Remove default margin
        },
        className: "toaster",
      }}
      visibleToasts={isMobile ? 1 : 3}
      onVisible={(toast) => {
        if (isMobile) {
          const toastElement = document.getElementById(String(toast));
          toastElement?.focus();
          toastElement?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }}
    />
  );
}
