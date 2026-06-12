/** Session cookie name Better Auth sets on the API (HTTPS). */
export const BACKEND_SESSION_COOKIE = "__Secure-better-auth.session_token";

/**
 * Session cookie name stored on the frontend origin during local HTTP dev.
 * Browsers reject the __Secure- prefix without HTTPS, so the proxy strips it
 * on Set-Cookie — see rewriteSetCookie in the /api/backend route.
 */
export const DEV_SESSION_COOKIE = "better-auth.session_token";

/**
 * Map the dev cookie name back to the backend name before forwarding a Cookie
 * header to Railway. No-op when the cookie already uses the backend name
 * (HTTPS production on Vercel).
 */
export function rewriteSessionCookieForBackend(cookieHeader: string): string {
  if (!cookieHeader.includes(`${DEV_SESSION_COOKIE}=`)) {
    return cookieHeader;
  }

  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .map((part) => {
      const eq = part.indexOf("=");
      if (eq === -1) return part;
      const name = part.slice(0, eq);
      const value = part.slice(eq + 1);
      if (name === DEV_SESSION_COOKIE) {
        return `${BACKEND_SESSION_COOKIE}=${value}`;
      }
      return part;
    })
    .join("; ");
}
