import { cn } from "@/lib/utils";

interface AdminTableShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AdminTableShell({
  children,
  footer,
  className,
}: AdminTableShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-[#e3e2e0] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
      {footer}
    </div>
  );
}
