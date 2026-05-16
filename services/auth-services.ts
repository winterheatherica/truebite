import { RegisterFormValues, LoginFormValues } from "@/lib/schemas/auth-schema";
import { SupabaseClient } from "@supabase/supabase-js";

export const authService = {
  async signUp(
    supabase: SupabaseClient,
    { email, password, name, username }: RegisterFormValues
  ) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: { name, username },
      },
    });
  },

  async signIn(supabase: SupabaseClient, { email, password }: LoginFormValues) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signOut(supabase: SupabaseClient) {
    await supabase.auth.signOut();
  },
};
