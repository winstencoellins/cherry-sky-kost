import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    /**
     * Server-only backend URL — read at runtime on Vercel (no client bundle inlining).
     * Prefer this over NEXT_PUBLIC_API_URL for proxy + SSR fetches.
     */
    API_URL: z.string().url().optional(),
  },
  client: {
    /**
     * Optional legacy / build-time hint. Client-side fetch code no longer depends
     * on this — browser traffic always goes through /api/backend.
     */
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
});
