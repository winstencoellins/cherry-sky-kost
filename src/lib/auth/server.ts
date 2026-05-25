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

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/get-session`, {
    headers: {
      cookie: cookieHeader,
      "user-agent": headerStore.get("user-agent") ?? "",
    },
    cache: "no-store",
  });

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
