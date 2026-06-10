import { cookies, headers } from "next/headers";
import { getServerApiBaseUrl } from "@/lib/api/base-url";
import { getRequestSiteOrigin } from "@/lib/api/request-origin";
import type { User } from "@/lib/types/auth";

export interface AuthSession {
  user: User;
  session: {
    id: string;
    expiresAt: string;
  };
}

interface GetSessionResponse {
  user: User | null;
  session: AuthSession["session"] | null;
}

async function resolveAuthBaseUrl(): Promise<string> {
  const siteOrigin = await getRequestSiteOrigin();
  return getServerApiBaseUrl(siteOrigin);
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieHeader = cookieStore.toString();
  const authBaseUrl = await resolveAuthBaseUrl();

  let response: Response;

  try {
    response = await fetch(`${authBaseUrl}/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
        "user-agent": headerStore.get("user-agent") ?? "",
      },
      cache: "no-store",
    });
  } catch {
    // API unreachable (e.g. ECONNREFUSED when backend is not running)
    return null;
  }

  if (!response.ok) return null;

  const data = (await response.json()) as GetSessionResponse | null;
  if (!data?.user || !data.session) return null;

  const raw = data.user as User & { image?: string | null; isActive?: boolean };

  return {
    user: {
      ...raw,
      isActive: raw.isActive !== false,
      avatar: raw.avatar ?? raw.image ?? undefined,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    },
    session: data.session,
  };
}

/**
 * Invalidate the current session on the API.
 *
 * Note: we intentionally do not mutate Next.js cookies here, because this
 * helper is used from layouts/other server components where cookie mutation
 * is not allowed. The Better Auth backend is responsible for clearing its
 * own session cookie on the API origin.
 */
export async function signOutSession(): Promise<void> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const authBaseUrl = await resolveAuthBaseUrl();

  try {
    await fetch(`${authBaseUrl}/auth/sign-out`, {
      method: "POST",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });
  } catch {
    // API unreachable — nothing else to do here.
  }
}
