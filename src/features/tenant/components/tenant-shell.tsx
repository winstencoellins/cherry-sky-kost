import { TenantHeader } from "@/features/tenant/components/tenant-header";
import { TenantShellProvider } from "@/features/tenant/components/tenant-shell-context";
import { TenantSidebar } from "@/features/tenant/components/tenant-sidebar";
import type { User } from "@/lib/types/auth";

interface TenantShellProps {
  children: React.ReactNode;
  user: User;
}

export function TenantShell({ children, user }: TenantShellProps) {
  return (
    <TenantShellProvider user={user}>
      <div className="relative min-h-screen bg-[#f5f4f1] text-[#1a1c1a] antialiased">
        <div
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,94,60,0.08),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#e3e2e0_1px,transparent_1px),linear-gradient(to_bottom,#e3e2e0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.35]"
          aria-hidden
        />

        <TenantSidebar />

        <div className="relative flex min-h-screen flex-col lg:pl-[280px]">
          <TenantHeader />
          <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </TenantShellProvider>
  );
}
