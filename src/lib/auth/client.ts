import { createAuthClient } from "better-auth/react";
import { getClientApiBaseUrl } from "@/lib/api/base-url";

export const authClient = createAuthClient({
  // Resolved when the client bundle loads in the browser (window is defined).
  baseURL: getClientApiBaseUrl(),
});
