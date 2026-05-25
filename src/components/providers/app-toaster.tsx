"use client";

import { Toaster } from "sonner";

/**
 * Global Sonner toaster — center-top, minimal Sky Kost styling.
 * Variant accents via globals.css ([data-sonner-toast][data-type]).
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      offset={20}
      gap={10}
      visibleToasts={4}
      closeButton
      richColors={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast-sky relative flex w-[min(calc(100vw-2rem),400px)] items-start gap-3 rounded-xl border bg-white/95 px-4 py-3.5 pr-10 shadow-[0_10px_40px_-12px_rgba(47,49,47,0.12)] backdrop-blur-md pointer-events-auto transition-all",
          title: "text-[13px] font-semibold leading-snug text-[#1a1c1a]",
          description: "text-xs font-normal leading-relaxed text-[#51443c]",
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          icon: "toast-icon size-[18px] shrink-0",
          closeButton: "toast-close",
          success: "toast-variant-success",
          error: "toast-variant-error",
          warning: "toast-variant-warning",
          info: "toast-variant-info",
        },
      }}
    />
  );
}
