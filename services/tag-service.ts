'use server'
import { createClient } from '@/lib/supabase/server'

export type TagRow = { id: number; name: string; slug: string }

export async function getAllTags(): Promise<TagRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Tags')
    .select('id, name, slug')
    .order('name')
  if (error) throw new Error(`Gagal mengambil tag: ${error.message}`)
  return (data ?? []) as TagRow[]
}
