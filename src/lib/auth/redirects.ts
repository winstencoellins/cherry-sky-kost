import { isStaffRole, UserRole } from "@/lib/types/auth";

/** Default landing route after a successful sign-in, by role. */
export function getHomePathForRole(role: UserRole | string): string {
  if (isStaffRole(role)) {
    return "/admin";
  }
  if (role === UserRole.TENANT) {
    return "/tenant/dashboard";
  }
  return "/";
}
