"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { authClient } from "@/lib/auth/client";

type Portal = "admin" | "tenant";

function loginPath(portal: Portal) {
  return portal === "admin" ? "/admin/login" : "/tenant/login";
}

export function SessionGuard({
  portal,
  children,
}: {
  portal: Portal;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const handling = useRef(false);

  useEffect(() => {
    async function enforce() {
      if (handling.current) return;

      const { data } = await authClient.getSession();
      const user = data?.user as Record<string, unknown> | undefined;

      if (user && user.isActive === false) {
        handling.current = true;
        await authClient.signOut();
        router.push(`${loginPath(portal)}?error=deactivated`);
        router.refresh();
      }
    }

    void enforce();

    const onFocus = () => void enforce();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [portal, router]);

  return children;
}
