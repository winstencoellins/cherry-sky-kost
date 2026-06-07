import { cn } from "@/lib/utils";

/** Consistent toolbar row for property filter + search (+ optional trailing controls). */
export function AdminFilterRow({
  children,
  trailing,
  className,
}: {
  children: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        {children}
      </div>
      {trailing ? (
        <div className="shrink-0 self-start sm:self-auto">{trailing}</div>
      ) : null}
    </div>
  );
}
