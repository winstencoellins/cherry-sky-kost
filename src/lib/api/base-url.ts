import { env } from "@/env";

function originsDiffer(apiUrl: string, siteOrigin: string): boolean {
  try {
    return new URL(apiUrl).origin !== new URL(siteOrigin).origin;
  } catch {
    return false;
  }
}

/** Whether API requests should be routed through the Next.js same-origin proxy. */
export function shouldUseApiProxy(siteOrigin: string | undefined): boolean {
  if (!siteOrigin) return false;
  return originsDiffer(env.NEXT_PUBLIC_API_URL, siteOrigin);
}

/** Client-side API/auth base URL (same-origin proxy when API is on another host). */
export function getClientApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return env.NEXT_PUBLIC_API_URL;
  }

  if (shouldUseApiProxy(window.location.origin)) {
    return `${window.location.origin}/api/backend`;
  }

  return env.NEXT_PUBLIC_API_URL;
}

/** Server-side API/auth base URL for the current request. */
export function getServerApiBaseUrl(siteOrigin: string | undefined): string {
  if (siteOrigin && shouldUseApiProxy(siteOrigin)) {
    return `${siteOrigin}/api/backend`;
  }

  return env.NEXT_PUBLIC_API_URL;
}
