import { cookies } from "next/headers";
import { getServerApiUrl } from "@/lib/api/base-url";
import { normalizeRole } from "@/lib/auth/role";
import { sessionCookieHeaderForBackend } from "@/lib/auth/session-cookie";

export async function fetchProfileRoleFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = sessionCookieHeaderForBackend(cookieStore);
  if (!cookieHeader) return undefined;

  // Call Railway directly — the cookie is already on the Vercel domain after the
  // client-side proxy login, so cookieStore holds the session token and we can
  // forward it straight without a loopback through /api/backend.
  const response = await fetch(`${getServerApiUrl()}/profile`, {
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
