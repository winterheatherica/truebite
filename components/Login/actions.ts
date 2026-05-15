'use server'
import { z } from "zod";
import { loginFormSchema } from "@/lib/schemas/auth-schema";

export async function loginUser(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validated = loginFormSchema.safeParse(data);

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  return { message: "Success!" };
}