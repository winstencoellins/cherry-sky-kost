"use client";

import { Icon } from "@/components/shared/Icon";
import { Link } from "@/i18n/routing";
import { AdminAlert } from "@/features/admin/components/admin-alert";
import { cn } from "@/lib/utils";

interface AdminFormPageProps {
  title: string;
  description?: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
  error?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  pending?: boolean;
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
  cancelLabel: string;
}

export function AdminFormPage({
  title,
  description,
  backHref,
  backLabel,
  children,
  error,
  onSubmit,
  pending,
  submitLabel,
  pendingLabel,
  cancelHref,
  cancelLabel,
}: AdminFormPageProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6f4627] transition-colors hover:text-[#805533]"
      >
        <Icon name="arrow_back" size={18} />
        {backLabel}
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1a1c1a]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-base text-[#51443c]">{description}</p>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-[#e3e2e0]/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
      >
        {error && (
          <div className="mb-6">
            <AdminAlert message={error} />
          </div>
        )}
        <div className="space-y-5">{children}</div>
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e3e2e0] pt-6 sm:flex-row sm:justify-end">
          <Link
            href={cancelHref}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-xl border border-[#e3e2e0] px-5 text-sm font-semibold text-[#51443c] transition-colors hover:bg-[#f4f3f1]",
              pending && "pointer-events-none opacity-50",
            )}
          >
            {cancelLabel}
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#6f4627] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#805533] disabled:opacity-60"
          >
            {pending ? pendingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
