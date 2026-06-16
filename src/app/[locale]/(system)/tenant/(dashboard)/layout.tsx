import type { Metadata } from "next";
import { TenantShell } from "@/features/tenant/components/tenant-shell";
import { requireTenant } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Tenant Portal | Cherry Sky Living",
};

export default async function TenantDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireTenant(locale);

  return <TenantShell user={session.user}>{children}</TenantShell>;
}
