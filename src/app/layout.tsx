import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cherry Sky Living",
  description: "Kost nyaman dengan fasilitas lengkap di Medan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

