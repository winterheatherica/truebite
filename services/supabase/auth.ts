import axios from "axios";
import { createSupabaseAuthUrl, createSupabaseHeaders, supabaseAnonKey } from "./config";

export type SupabaseAuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: Record<string, unknown>;
};

export type EmailPasswordAuthInput = {
  email: string;
  password: string;
};

async function parseSupabaseResponse<T>(response: any): Promise<T> {
  if (response.data) {
    return response.data as T;
  }
  throw new Error("Invalid Supabase response");
}

export async function signUp(input: EmailPasswordAuthInput) {
  const response = await axios.post(
    createSupabaseAuthUrl("signup"),
    {
      email: input.email,
      password: input.password,
    },
    {
      headers: createSupabaseHeaders(),
    },
  );

  return parseSupabaseResponse<{ user?: Record<string, unknown>; session?: SupabaseAuthSession }>(response);
}

export async function signIn(input: EmailPasswordAuthInput) {
  const response = await axios.post(
    createSupabaseAuthUrl("token?grant_type=password"),
    {
      email: input.email,
      password: input.password,
    },
    {
      headers: createSupabaseHeaders(),
    },
  );

  return parseSupabaseResponse<{ access_token: string; refresh_token?: string; user?: Record<string, unknown> }>(response);
}

export async function getUser(accessToken: string) {
  const response = await axios.get(createSupabaseAuthUrl("user"), {
    headers: createSupabaseHeaders(accessToken),
  });

  return parseSupabaseResponse<Record<string, unknown>>(response);
}

export async function signOut(accessToken: string) {
  const response = await axios.post(
    createSupabaseAuthUrl("logout"),
    {},
    {
      headers: createSupabaseHeaders(accessToken),
    },
  );

  return parseSupabaseResponse<{ message?: string }>(response);
}
