import { z } from "zod";

export const tenantProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export type TenantProfileValues = z.infer<typeof tenantProfileSchema>;

export const tenantPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TenantPasswordValues = z.infer<typeof tenantPasswordSchema>;
