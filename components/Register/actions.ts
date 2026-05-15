'use server'
import { registerFormSchema } from "@/lib/schemas/auth-schema";

export async function registerUser(prevState: any, formData: FormData) {

    
    const data = Object.fromEntries(formData.entries());
    const validated = registerFormSchema.safeParse(data);
    if (!validated.success) {
        return { errors: validated.error.flatten().fieldErrors };
    }
    return { message: "Success!" };
}

