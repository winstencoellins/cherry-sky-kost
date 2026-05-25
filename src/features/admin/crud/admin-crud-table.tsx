"use client";

import { cn } from "@/lib/utils";

export interface AdminTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  className?: string;
}

interface AdminCrudTableProps {
  columns: AdminTableColumn[];
  children: React.ReactNode;
  className?: string;
}

export function AdminCrudTable({
  columns,
  children,
  className,
}: AdminCrudTableProps) {
  return (
    <table className={cn("w-full border-collapse text-left", className)}>
      <thead>
        <tr className="border-b border-[#e3e2e0]/50 bg-[#f4f3f1]">
          {columns.map((col) => (
            <th
              key={col.key}
              className={cn(
                "px-6 py-4 text-sm font-semibold text-[#51443c]",
                col.align === "right" && "text-right",
                col.align === "center" && "text-center",
                col.className,
              )}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#e3e2e0]/50">{children}</tbody>
    </table>
  );
}

export function AdminCrudTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "group transition-colors hover:bg-[#faf9f6]/80",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function AdminCrudTableCell({
  children,
  align,
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-6 py-4 align-middle text-sm text-[#1a1c1a]",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  );
}
