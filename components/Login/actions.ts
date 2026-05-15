'use server'
import { z } from "zod";
import { loginFormSchema } from "@/lib/schemas/auth-schema";
import { redirect } from "next/navigation";
import { authService } from "@/services/auth-services";
import { createClient } from "@/lib/supabase/server"; 


export async function loginUser(prevState: any, formData: FormData) {
  const supabase = await createClient(); // Ambil client server
  const data = Object.fromEntries(formData.entries());
  
  const validated = loginFormSchema.safeParse(data);
  
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  
  const { error } = await authService.signIn(supabase, { email: validated.data.email, password: validated.data.password });

  if (error) {
    return { message: "Email atau password salah" };
  }

  redirect("/");
}