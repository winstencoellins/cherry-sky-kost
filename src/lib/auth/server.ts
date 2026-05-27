import { cookies, headers } from "next/headers";
import { env } from "@/env";
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

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieHeader = cookieStore.toString();

  let response: Response;

  try {
    response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/get-session`, {
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

  return {
    user: {
      ...data.user,
      createdAt: new Date(data.user.createdAt),
      updatedAt: new Date(data.user.updatedAt),
    },
    session: data.session,
  };
}

const SESSION_COOKIE = "better-auth.session_token";

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

  try {
    await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/sign-out`, {
      method: "POST",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });
  } catch {
    // API unreachable — nothing else to do here.
  }
}
