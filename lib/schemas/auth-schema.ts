import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(2, "Nama minimal 2 karakter").max(60, "Nama maksimal 60 karakter"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(24, "Username maksimal 24 karakter")
    .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi Password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
