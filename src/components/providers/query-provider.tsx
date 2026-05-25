"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { queryDefaultOptions } from "@/lib/query/defaults";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryDefaultOptions,
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
