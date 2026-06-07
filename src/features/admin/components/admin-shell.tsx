import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminShellProvider } from "@/features/admin/components/admin-shell-context";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { SessionGuard } from "@/lib/auth/session-guard";
import type { User } from "@/lib/types/auth";

interface AdminShellProps {
  children: React.ReactNode;
  user: User;
}

export function AdminShell({ children, user }: AdminShellProps) {
  return (
    <SessionGuard portal="admin">
    <AdminShellProvider user={user}>
      <div className="relative min-h-screen bg-[#f5f4f1] text-[#1a1c1a] antialiased">
        <div
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,94,60,0.08),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#e3e2e0_1px,transparent_1px),linear-gradient(to_bottom,#e3e2e0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.35]"
          aria-hidden
        />

        <AdminSidebar />

        <div className="relative flex min-h-screen flex-col lg:pl-[280px]">
          <AdminHeader />
          <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </AdminShellProvider>
    </SessionGuard>
  );
}
