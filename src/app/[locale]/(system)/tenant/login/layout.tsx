import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cherry Sky Living Tenant Portal — Sign in",
};

export default function TenantLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
