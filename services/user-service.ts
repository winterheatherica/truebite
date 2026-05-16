'use server'
import { createClient } from '@/lib/supabase/server'

export type UserRow = {
  id: string
  email: string
  name: string
  username: string
  role: 'admin' | 'user'
  created_at: string
}

export async function getCurrentUser(): Promise<UserRow | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("Users")
    .select("id, email, name, username, role, created_at")
    .eq("id", user.id)
    .single()

  if (error) return null
  return data as UserRow
}

export async function requireAdmin(): Promise<UserRow> {
  const me = await getCurrentUser()
  if (!me) throw new Error("Harus login.")
  if (me.role !== 'admin') throw new Error("Akses ditolak: butuh role admin.")
  return me
}

export async function getAllUsers(): Promise<UserRow[]> {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Users")
    .select("id, email, name, username, role, created_at")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Gagal mengambil daftar user: ${error.message}`)
  return (data ?? []) as UserRow[]
}

export async function setUserRole(targetUserId: string, role: 'admin' | 'user') {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase
    .from("Users")
    .update({ role })
    .eq("id", targetUserId)

  if (error) throw new Error(`Gagal mengubah role: ${error.message}`)
}
