import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sky Kost Tenant Portal — Sign in",
};

export default function TenantLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
