import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export type FooterLocation = { id: number; name: string }
export type FooterTag = { id: number; name: string; slug: string }

export type FooterPicks = {
  districts: FooterLocation[]
  cities: FooterLocation[]
  provinces: FooterLocation[]
  tags: FooterTag[]
}

function pickRandom<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return [...arr]
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export const getFooterPicks = unstable_cache(
  async (): Promise<FooterPicks> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    )

    const [districtsRes, citiesRes, provincesRes, tagsRes] = await Promise.all([
      supabase.from('Districts').select('id, name'),
      supabase.from('Cities').select('id, name'),
      supabase.from('Provinces').select('id, name'),
      supabase.from('Tags').select('id, name, slug'),
    ])

    return {
      districts: pickRandom((districtsRes.data ?? []) as FooterLocation[], 10),
      cities: pickRandom((citiesRes.data ?? []) as FooterLocation[], 10),
      provinces: pickRandom((provincesRes.data ?? []) as FooterLocation[], 10),
      tags: pickRandom((tagsRes.data ?? []) as FooterTag[], 10),
    }
  },
  ['footer-picks-v1'],
  { revalidate: 3600 },
)
