import { cookies } from "next/headers";
import { env } from "@/env";
import { normalizeRole } from "@/lib/auth/role";

export async function fetchProfileRoleFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return undefined;

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/profile`, {
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

export async function resolveTenantRole(
  sessionRole: unknown,
): Promise<string | undefined> {
  const fromSession = normalizeRole(sessionRole);
  if (fromSession) return fromSession;
  return fetchProfileRoleFromCookies();
}
