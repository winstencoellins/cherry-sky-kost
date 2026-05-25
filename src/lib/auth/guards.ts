import { redirect } from "@/i18n/routing";
import { getHomePathForRole } from "@/lib/auth/redirects";
import { type AuthSession, getSession } from "@/lib/auth/server";
import { isStaffRole } from "@/lib/types/auth";

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

/** Redirect authenticated users away from the login page to their home route. */
export async function requireGuest(locale: string) {
  const session = await getSession();

  if (session) {
    redirect({
      href: "/admin",
      locale,
    });
  }
}
