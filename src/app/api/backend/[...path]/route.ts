import { getServerApiUrl } from "@/lib/api/base-url";
import {
  cookieHeaderForBackend,
  setCookieForBrowser,
} from "@/lib/auth/session-cookie";

/**
 * Same-origin API proxy — routes /api/backend/** to the Railway backend.
 *
 * WHY: In production the Next.js frontend (Vercel) and the API (Railway) live on
 * different origins. Browsers won't share cookies across origins, so a session
 * cookie set by Railway would never be sent back to the Vercel SSR process.
 *
 * FIX: Client-side auth and API calls go through this proxy instead. The proxy
 * rewrites Set-Cookie so the session cookie is stored on the Vercel domain, where
 * the Next.js server can read it and forward it to Railway for SSR session checks.
 */

async function proxyRequest(request: Request, pathSegments: string[]) {
  const incomingUrl = new URL(request.url);
  const targetPath = pathSegments.join("/");
  const target = new URL(`${getServerApiUrl()}/${targetPath}`);
  target.search = incomingUrl.search;

  // Copy headers, dropping hop-by-hop headers that must not be forwarded.
  const forwardHeaders = new Headers(request.headers);
  for (const h of ["host", "connection", "transfer-encoding", "te"]) {
    forwardHeaders.delete(h);
  }

  const cookie = forwardHeaders.get("cookie");
  if (cookie) {
    forwardHeaders.set("cookie", cookieHeaderForBackend(cookie));
  }

  const hasBody =
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.method !== "OPTIONS";

  // Buffer the body rather than streaming — Vercel's Node.js serverless runtime
  // does not reliably support streaming request bodies (duplex:"half").
  let body: string | undefined;
  if (hasBody) {
    body = await request.text();
  }

  const upstream = await fetch(target, {
    method: request.method,
    headers: forwardHeaders,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstream.headers);
  const isHttps = incomingUrl.protocol === "https:";

  // Rewrite every Set-Cookie header so the cookie lands on the Vercel domain.
  const setCookies =
    typeof responseHeaders.getSetCookie === "function"
      ? responseHeaders.getSetCookie()
      : [];

  if (setCookies.length > 0) {
    responseHeaders.delete("set-cookie");
    for (const c of setCookies) {
      responseHeaders.append("set-cookie", setCookieForBrowser(c, isHttps));
    }
  }

  // Remove the upstream CORS headers — the browser sees this response as
  // same-origin, so Vercel's own CORS policy applies instead.
  responseHeaders.delete("access-control-allow-origin");
  responseHeaders.delete("access-control-allow-credentials");

  // Buffer the response body — streaming upstream.body through the Next.js
  // proxy can leave clients with an unreadable or empty body (fetch().json()
  // then fails even when the upstream returned 200 + JSON).
  const responseBody = await upstream.arrayBuffer();
  // upstream fetch decodes compressed bodies; drop encoding headers so clients
  // do not attempt to decompress an already-decoded buffer (causes Z_DATA_ERROR).
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.set("content-length", String(responseBody.byteLength));

  return new Response(responseBody, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
