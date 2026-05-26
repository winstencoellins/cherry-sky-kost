import { redirect } from "@/i18n/routing";
import { getHomePathForRole } from "@/lib/auth/redirects";
import { assertCanAccessTenantPortal } from "@/lib/auth/role";
import { resolveTenantRole } from "@/lib/auth/role.server";
import { type AuthSession, getSession } from "@/lib/auth/server";
import type { UserRole } from "@/lib/types/auth";

export async function requireAdmin(locale: string): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    redirect({ href: "/admin/login", locale });
    throw new Error("Unauthorized");
  }

  // if (!isStaffRole(session.user.role)) {
  //   redirect({ href: "/admin/login?error=forbidden", locale });
  //   throw new Error("Forbidden");
  // }

  return session;
}

export async function requireTenant(locale: string): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    redirect({ href: "/tenant/login", locale });
    throw new Error("Unauthorized");
  }

  const role = await resolveTenantRole(session.user.role);
  const access = assertCanAccessTenantPortal(role);

  if (access.isStaff) {
    redirect({ href: "/admin", locale });
    throw new Error("Forbidden");
  }

  if (!access.ok) {
    redirect({ href: "/tenant/login", locale });
    throw new Error("Forbidden");
  }

  return {
    ...session,
    user: { ...session.user, role: role as UserRole },
  };
}

/** Redirect authenticated users away from the login page to their home route. */
export async function requireGuest(locale: string) {
  const session = await getSession();

  if (session) {
    const role = await resolveTenantRole(session.user.role);
    redirect({
      href: getHomePathForRole(role ?? session.user.role),
      locale,
    });
  }
}
