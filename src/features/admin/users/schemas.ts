import { z } from "zod";

export const createTenantUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateTenantUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
});

export type CreateTenantUserValues = z.infer<typeof createTenantUserSchema>;
export type UpdateTenantUserValues = z.infer<typeof updateTenantUserSchema>;
