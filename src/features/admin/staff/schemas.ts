import { z } from "zod";

export const staffRoleSchema = z.enum(["admin", "superadmin"]);

export const createStaffUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: staffRoleSchema,
});

export const updateStaffUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  role: staffRoleSchema,
});

export type CreateStaffUserValues = z.infer<typeof createStaffUserSchema>;
export type UpdateStaffUserValues = z.infer<typeof updateStaffUserSchema>;
