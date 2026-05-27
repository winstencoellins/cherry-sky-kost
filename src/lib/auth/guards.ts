import { redirect } from "@/i18n/routing";
import { getHomePathForRole } from "@/lib/auth/redirects";
import {
  assertCanAccessAdminPortal,
  assertCanAccessTenantPortal,
} from "@/lib/auth/role";
import { resolveSessionRole } from "@/lib/auth/role.server";
import { type AuthSession, getSession, signOutSession } from "@/lib/auth/server";
import type { UserRole } from "@/lib/types/auth";

const FORBIDDEN_QUERY = "?error=forbidden";

async function rejectWrongPortal(
  locale: string,
  loginPath: "/admin/login" | "/tenant/login",
): Promise<never> {
  await signOutSession();
  redirect({ href: `${loginPath}${FORBIDDEN_QUERY}`, locale });
  throw new Error("Forbidden");
}

export async function requireAdmin(locale: string): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    redirect({ href: "/admin/login", locale });
    throw new Error("Unauthorized");
  }

  const role = await resolveSessionRole(session.user.role);
  const access = assertCanAccessAdminPortal(role);

  if (!access.ok) {
    await rejectWrongPortal(locale, "/admin/login");
  }

  return {
    ...session,
    user: { ...session.user, role: role as UserRole },
  };
}

export async function requireTenant(locale: string): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    redirect({ href: "/tenant/login", locale });
    throw new Error("Unauthorized");
  }

  const role = await resolveSessionRole(session.user.role);
  const access = assertCanAccessTenantPortal(role);

  if (!access.ok) {
    await rejectWrongPortal(locale, "/tenant/login");
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
    const role = await resolveSessionRole(session.user.role);
    redirect({
      href: getHomePathForRole(role ?? session.user.role),
      locale,
    });
  }
}
