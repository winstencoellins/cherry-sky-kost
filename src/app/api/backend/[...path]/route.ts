import { env } from "@/env";

function rewriteSetCookie(cookie: string, isSecure: boolean): string {
  let rewritten = cookie.replace(/;\s*Domain=[^;]*/gi, "");

  // First-party cookies through the proxy can use Lax instead of None.
  rewritten = rewritten.replace(/;\s*SameSite=None/gi, "; SameSite=Lax");

  if (!isSecure) {
    rewritten = rewritten
      .replace(/;\s*Secure/gi, "")
      .replace(/^__Secure-/i, "")
      .replace(/^__Host-/i, "");
  }

  return rewritten;
}

async function proxyRequest(request: Request, pathSegments: string[]) {
  const incomingUrl = new URL(request.url);
  const targetPath = pathSegments.join("/");
  const target = new URL(
    `${env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/${targetPath}`,
  );
  target.search = incomingUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");

  const hasBody =
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.method !== "OPTIONS";

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    // @ts-expect-error duplex is required for streaming request bodies in Node fetch
    duplex: hasBody ? "half" : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);
  const isSecure = incomingUrl.protocol === "https:";
  const setCookies =
    typeof responseHeaders.getSetCookie === "function"
      ? responseHeaders.getSetCookie()
      : [];

  if (setCookies.length > 0) {
    responseHeaders.delete("set-cookie");
    for (const cookie of setCookies) {
      responseHeaders.append("set-cookie", rewriteSetCookie(cookie, isSecure));
    }
  }

  // Avoid sending a mismatched CORS origin from the upstream API.
  responseHeaders.delete("access-control-allow-origin");
  responseHeaders.delete("access-control-allow-credentials");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
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
