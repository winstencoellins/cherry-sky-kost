import * as React from "react";
import { Icon } from "@/components/shared/Icon";
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

const adminControlBase =
  "w-full rounded-xl border border-[#d5c3b8] bg-[#faf9f6] text-sm text-[#1a1c1a] transition-colors focus:border-[#8b5e3c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/15";

export const adminInputClassName = cn(
  adminControlBase,
  "h-10 px-3.5 placeholder:text-[#83746b]/60",
);

export const adminSelectClassName = cn(
  adminControlBase,
  "h-10 cursor-pointer appearance-none pl-3.5 pr-10",
);

export const adminSearchInputClassName = cn(
  adminControlBase,
  "h-10 pl-10 pr-4 placeholder:text-[#83746b]/60",
);

export function AdminSelect({
  className,
  selectClassName,
  children,
  ...props
}: React.ComponentProps<"select"> & {
  className?: string;
  selectClassName?: string;
}) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <select
        className={cn(adminSelectClassName, selectClassName)}
        {...props}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-center text-[#83746b]"
        aria-hidden
      >
        <Icon name="expand_more" size={20} />
      </span>
    </div>
  );
}

export { DatePicker as AdminDatePicker } from "@/components/date-picker";
export { DateRangePicker as AdminDateRangePicker } from "@/components/date-range-picker";

export const AdminSearchInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    id?: string;
  } & Omit<React.ComponentProps<"input">, "value" | "onChange" | "type">
>(function AdminSearchInput(
  { value, onChange, placeholder, className, id, ...props },
  ref,
) {
  return (
    <div className={cn("relative min-w-[12rem] w-full", className)}>
      <Icon
        name="search"
        size={20}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#83746b]"
      />
      <input
        ref={ref}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={adminSearchInputClassName}
        {...props}
      />
    </div>
  );
});
