/**
 * Canonical Better Auth session cookie name on the API.
 * All upstream requests must use this name — the backend never accepts aliases.
 */
export const SESSION_COOKIE_NAME = "__Secure-better-auth.session_token";

/** Derived name used by the browser on local HTTP dev only (see setCookieForBrowser). */
const HTTP_DEV_COOKIE_NAME = SESSION_COOKIE_NAME.replace(/^__Secure-/, "");

/**
 * Rewrite a browser Cookie header so Railway receives the backend cookie name.
 * On HTTPS (production) the browser already sends SESSION_COOKIE_NAME — no-op.
 */
export function cookieHeaderForBackend(cookieHeader: string): string {
  if (!cookieHeader.includes(`${HTTP_DEV_COOKIE_NAME}=`)) {
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
      if (name === HTTP_DEV_COOKIE_NAME) {
        return `${SESSION_COOKIE_NAME}=${value}`;
      }
      return part;
    })
    .join("; ");
}

/**
 * Adapt an upstream Set-Cookie for the frontend origin.
 * Preserves SESSION_COOKIE_NAME on HTTPS; strips __Secure-/Secure on HTTP dev
 * because browsers reject secure-prefixed cookies without HTTPS.
 */
export function setCookieForBrowser(setCookie: string, isHttps: boolean): string {
  let out = setCookie.replace(/;\s*Domain=[^;]*/gi, "");
  out = out.replace(/;\s*SameSite=None/gi, "; SameSite=Lax");

  if (!isHttps) {
    out = out
      .replace(/;\s*Secure/gi, "")
      .replace(/^__Secure-/i, "")
      .replace(/^__Host-/i, "");
  }

  return out;
}
