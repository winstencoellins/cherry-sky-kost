import { cn } from "@/lib/utils";

export function AdminField({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-label-sm text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export const adminInputClassName =
  "w-full rounded-xl border border-[#d5c3b8] bg-[#faf9f6] px-3.5 py-2.5 text-sm text-[#1a1c1a] transition-colors placeholder:text-[#83746b]/60 focus:border-[#8b5e3c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/15";
