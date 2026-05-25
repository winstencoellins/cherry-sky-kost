import { Icon } from "@/components/shared/Icon";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  icon: string;
  iconClassName: string;
  label: string;
  value: React.ReactNode;
  hint?: string;
  href?: string;
  trend?: { value: string; positive?: boolean };
  className?: string;
  /** @deprecated Use trend */
  badge?: string;
  /** @deprecated Use trend */
  badgeClassName?: string;
  valuePrefix?: string;
}

export function AdminStatCard({
  icon,
  iconClassName,
  label,
  value,
  hint,
  href,
  trend,
  className,
  badge,
  badgeClassName,
  valuePrefix,
}: AdminStatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className={cn("rounded-xl p-2.5", iconClassName)}>
          <Icon name={icon} size={22} />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.positive
                ? "bg-[#E6F4EA] text-[#137333]"
                : "bg-[#ffdad6] text-[#ba1a1a]",
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
        {!trend && badge && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              badgeClassName,
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight text-[#1a1c1a] sm:text-4xl">
          {valuePrefix && (
            <span className="mr-1 text-base font-medium text-[#5f5e5e]">
              {valuePrefix}{" "}
            </span>
          )}
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-[#51443c]">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-[#83746b]">{hint}</p>}
      </div>
    </>
  );

  const cardClass = cn(
    "group relative overflow-hidden rounded-2xl border border-[#e3e2e0]/80 bg-white/90 p-5 shadow-[0_1px_3px_rgba(47,49,47,0.06)] backdrop-blur-sm transition-all duration-300",
    href && "hover:border-[#8b5e3c]/30 hover:shadow-[0_8px_30px_-12px_rgba(111,70,39,0.15)]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[#6f4627]/5 transition-transform duration-300 group-hover:scale-110" />
        {content}
      </Link>
    );
  }

  return (
    <article className={cardClass}>
      <div
        className="absolute -right-6 -top-6 size-24 rounded-full bg-[#6f4627]/5"
        aria-hidden
      />
      {content}
    </article>
  );
}
