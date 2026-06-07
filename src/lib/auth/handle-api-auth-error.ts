import { ApiError } from "@/lib/api/errors";
import { routing } from "@/i18n/routing";
import { authClient } from "@/lib/auth/client";

let redirecting = false;

export function isDeactivatedApiError(error: ApiError): boolean {
  if (error.status !== 403) return false;
  return error.message.toLowerCase().includes("deactivated");
}

function localeFromPathname(pathname: string): string {
  const segment = pathname.split("/")[1];
  if (segment && routing.locales.includes(segment as (typeof routing.locales)[number])) {
    return segment;
  }
  return routing.defaultLocale;
}

export async function handleDeactivatedApiError(error: unknown): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!(error instanceof ApiError) || !isDeactivatedApiError(error)) return false;
  if (redirecting) return true;

  redirecting = true;

  const isAdmin = window.location.pathname.includes("/admin");
  const locale = localeFromPathname(window.location.pathname);
  const loginPath = isAdmin ? "/admin/login" : "/tenant/login";

  await authClient.signOut();
  window.location.assign(`/${locale}${loginPath}?error=deactivated`);

  return true;
}
