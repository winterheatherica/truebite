import { z } from "zod";

// Schemas for login forms 
export const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

// Schemas for register forms
export const registerFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi Password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;