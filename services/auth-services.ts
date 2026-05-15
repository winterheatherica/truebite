import { createClient } from "@/lib/supabase/client";
import { LoginFormValues, RegisterFormValues } from "@/lib/schemas/auth-schema";

export const authService = {
  async signUp({ email, password }: RegisterFormValues) {
    const supabase = createClient();
    return await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
  },

  async signIn({ email, password }: LoginFormValues) {
    const supabase = createClient();
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
};