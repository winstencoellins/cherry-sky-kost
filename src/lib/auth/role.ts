import { getRoleFromAuthUser } from "@/lib/auth/post-login";
import { isStaffRole, UserRole } from "@/lib/types/auth";

export function normalizeRole(role: unknown): string | undefined {
  if (typeof role !== "string" || !role.trim()) return undefined;
  return role.trim().toLowerCase();
}

export function isTenantRole(role: string | undefined): boolean {
  return normalizeRole(role) === UserRole.TENANT;
}

/** Role from session user object (Better Auth may omit `role` on the client payload). */
export function roleFromSessionUser(
  user: Record<string, unknown> | null | undefined,
): string | undefined {
  return normalizeRole(getRoleFromAuthUser(user) ?? user?.role);
}

export function assertCanAccessTenantPortal(role: string | undefined): {
  ok: boolean;
  isStaff: boolean;
} {
  const normalized = normalizeRole(role);
  if (!normalized) {
    return { ok: false, isStaff: false };
  }
  if (isStaffRole(normalized)) {
    return { ok: false, isStaff: true };
  }
  return { ok: isTenantRole(normalized), isStaff: false };
}
