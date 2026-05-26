import { redirect } from "@/i18n/routing";

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/tenant/leases", locale });
}
