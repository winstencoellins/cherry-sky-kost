import { env } from "@/env";

const LOCAL_API_URL = "http://localhost:8000";

/**
 * Backend URL for server-side code (proxy route, SSR session checks).
 *
 * Resolution order:
 * 1. API_URL — server-only, available at runtime on Vercel (no rebuild needed)
 * 2. NEXT_PUBLIC_API_URL — build-time fallback for local dev / existing deploys
 * 3. localhost:8000 — local default
 */
export function getServerApiUrl(): string {
  return (env.API_URL ?? env.NEXT_PUBLIC_API_URL ?? LOCAL_API_URL).replace(
    /\/$/,
    "",
  );
}

/**
 * Base URL for browser-side API and auth traffic.
 *
 * Always routes through the same-origin /api/backend proxy so session cookies
 * stay on the frontend domain. Does not read NEXT_PUBLIC_API_URL — that avoids
 * production builds silently falling back to localhost when the public env var
 * was not set at build time.
 */
export function getClientApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return getServerApiUrl();
  }

  return `${window.location.origin}/api/backend`;
}

/** Better Auth is mounted at /auth on the API — client calls must include that prefix. */
export function getClientAuthBaseUrl(): string {
  if (typeof window === "undefined") {
    return `${getServerApiUrl()}/auth`;
  }

  return `${window.location.origin}/api/backend/auth`;
}
