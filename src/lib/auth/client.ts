import { createAuthClient } from "better-auth/react";
import { getClientApiBaseUrl } from "@/lib/api/base-url";

export const authClient = createAuthClient({
  baseURL: getClientApiBaseUrl(),
});
