import { headers } from "next/headers";

/** Resolve the public site origin for the current request (used for same-origin API proxying). */
export async function getRequestSiteOrigin(): Promise<string | undefined> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? undefined;

  if (!host) return undefined;

  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
