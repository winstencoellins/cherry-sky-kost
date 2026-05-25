import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sky Kost Admin Suite — Sign in",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
