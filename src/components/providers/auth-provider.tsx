"use client";

import { createContext, useContext, useMemo } from "react";
import type { User } from "@/lib/types/auth";

interface AuthContextValue {
  user: User | null;
}

const AuthContext = createContext<AuthContextValue>({ user: null });

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const value = useMemo(() => ({ user }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
