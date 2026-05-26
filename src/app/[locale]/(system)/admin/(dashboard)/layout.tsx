import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Admin | Cherry Sky Kost",
};

export default async function AdminDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireAdmin(locale);

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
