import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cherry Sky Living Admin Suite — Sign in",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
