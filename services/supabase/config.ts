const SUPABASE_URL_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"] as const;
const SUPABASE_KEY_KEYS = ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY"] as const;

function readEnv(keys: readonly string[], label: string) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  throw new Error(`Missing Supabase ${label}. Set one of: ${keys.join(", ")}.`);
}

export const supabaseUrl = readEnv(SUPABASE_URL_KEYS, "URL");
export const supabaseAnonKey = readEnv(SUPABASE_KEY_KEYS, "anon key");

export function createSupabaseHeaders(accessToken?: string) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken ?? supabaseAnonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export function createSupabaseRestUrl(table: string, query = "") {
  return `${supabaseUrl}/rest/v1/${table}${query}`;
}

export function createSupabaseAuthUrl(path: string) {
  return `${supabaseUrl}/auth/v1/${path}`;
}
