import { cookies } from "next/headers";
import { getServerApiBaseUrl } from "@/lib/api/base-url";
import { getRequestSiteOrigin } from "@/lib/api/request-origin";
import { normalizeRole } from "@/lib/auth/role";

export async function fetchProfileRoleFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return undefined;

  const siteOrigin = await getRequestSiteOrigin();
  const apiBaseUrl = getServerApiBaseUrl(siteOrigin);

  const response = await fetch(`${apiBaseUrl}/profile`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!response.ok) return undefined;

  const payload = (await response.json()) as {
    data?: { role?: string };
    role?: string;
  };

  return normalizeRole(payload.data?.role ?? payload.role);
}

/** Resolve role from session, falling back to profile when the session omits it. */
export async function resolveSessionRole(
  sessionRole: unknown,
): Promise<string | undefined> {
  const fromSession = normalizeRole(sessionRole);
  if (fromSession) return fromSession;
  return fetchProfileRoleFromCookies();
}

/** @deprecated Use {@link resolveSessionRole}. */
export const resolveTenantRole = resolveSessionRole;
