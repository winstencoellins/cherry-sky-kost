import { env } from "@/env";

function originsDiffer(a: string, b: string): boolean {
  try {
    return new URL(a).origin !== new URL(b).origin;
  } catch {
    return false;
  }
}

/**
 * Client-side base URL for all API and auth traffic.
 *
 * When the frontend and backend are on different origins (production: Vercel +
 * Railway) every client-side request goes through the same-origin proxy at
 * /api/backend so that Set-Cookie responses land on the Vercel domain.
 * The Next.js server can then read the session cookie from its own cookieStore
 * and forward it directly to Railway for SSR guard checks.
 *
 * In local development both servers are on localhost so the proxy is still used
 * (ports differ → origins differ), keeping dev/prod parity.
 */
export function getClientApiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side evaluation at module load — actual requests never happen here;
    // return the real API URL so any accidental server-side use goes direct.
    return env.NEXT_PUBLIC_API_URL;
  }

  if (originsDiffer(env.NEXT_PUBLIC_API_URL, window.location.origin)) {
    return `${window.location.origin}/api/backend`;
  }

  return env.NEXT_PUBLIC_API_URL;
}
