'use server'
import { registerFormSchema } from "@/lib/schemas/auth-schema";
import { authService } from "@/services/auth-services";
import { createClient } from "@/lib/supabase/server";

export async function registerUser(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData.entries());
    const validated = registerFormSchema.safeParse(data);

    if (!validated.success) {
        return { errors: validated.error.flatten().fieldErrors };
    }

    const { data: signUpData, error } = await authService.signUp(supabase, validated.data);

    if (error) {
        console.error("Supabase Error:", error.message);
        return { message: error.message };
    }

    console.log("User terdaftar:", signUpData);
    return { message: "Berhasil mendaftar, silakan cek email konfirmasi" };
}
