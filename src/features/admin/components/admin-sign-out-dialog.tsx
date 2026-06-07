"use client";

import { SignOutDialog } from "@/components/shared/sign-out-dialog";

interface AdminSignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  pending?: boolean;
}

export function AdminSignOutDialog(props: AdminSignOutDialogProps) {
  return <SignOutDialog namespace="admin.signOutDialog" {...props} />;
}
