'use server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/services/user-service'
import type { RestaurantValues } from '@/lib/schemas/restaurant-schema'
import type { Restaurant } from '@/lib/types/restaurant'
import { generateRestaurantSlug } from '@/lib/utils/slug'

const FULL_SELECT = `
  id, slug, name, description, address, "provinceId", "cityId", "districtId",
  latitude, longitude, "photoUrl", featured, created_at,
  Provinces:Provinces!Restaurants_provinceId_fkey ( id, name ),
  Cities:Cities!Restaurants_cityId_fkey ( id, name ),
  Districts:Districts!Restaurants_districtId_fkey ( id, name ),
  Restaurant_tags:Restaurant_tags!Restaurant_tags_restaurantId_fkey (
    tagId,
    Tags:Tags!Restaurant_tags_tagId_fkey ( id, name, slug )
  ),
  Reviews:Reviews!Reviews_restaurant_id_fkey (
    rating,
    Sentiments:Sentiments!Reviews_sentimentId_fkey ( label )
  )
`

function mapRow(row: any): Restaurant {
  type RawReview = { rating: number | string | null; Sentiments?: { label?: string } }
  const allReviews: RawReview[] = row.Reviews ?? []
  const nonNegative = allReviews.filter((r) => r.Sentiments?.label !== 'negative')
  const positiveOnly = allReviews.filter((r) => r.Sentiments?.label === 'positive')

  const ratingsForAvg = nonNegative
    .map((r) => Number(r.rating))
    .filter((n) => Number.isFinite(n))
  const averageRating = ratingsForAvg.length
    ? Math.round((ratingsForAvg.reduce((a, b) => a + b, 0) / ratingsForAvg.length) * 10) / 10
    : 0

  const tags = (row.Restaurant_tags ?? [])
    .map((rt: any) => rt.Tags ? { slug: rt.Tags.slug, name: rt.Tags.name } : null)
    .filter(Boolean)

  const pickName = (rel: any): string => {
    if (!rel) return ''
    if (Array.isArray(rel)) return rel[0]?.name ?? ''
    return rel.name ?? ''
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? '',
    address: row.address ?? '',
    province: pickName(row.Provinces),
    city: pickName(row.Cities),
    district: pickName(row.Districts),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    tags,
    photoUrl: row.photoUrl ?? '',
    images: [],
    featured: !!row.featured,
    averageRating,
    reviewCount: positiveOnly.length,
  }
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Restaurants')
    .select(FULL_SELECT)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Gagal mengambil restoran: ${error.message}`)
  return (data ?? []).map(mapRow)
}

export async function getFeaturedRestaurants(): Promise<Restaurant[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Restaurants')
    .select(FULL_SELECT)
    .eq('featured', true)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Gagal mengambil restoran featured: ${error.message}`)
  return (data ?? []).map(mapRow)
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Restaurants')
    .select(FULL_SELECT)
    .eq('slug', slug)
    .single()
  if (error || !data) return null

  const restaurant = mapRow(data)

  const { data: imageRows } = await supabase
    .from('Images')
    .select('id, url, alt, title')
    .eq('restaurantId', restaurant.id)
    .order('id', { ascending: true })

  if (imageRows && imageRows.length > 0) {
    restaurant.images = imageRows
      .map((img: any) => ({
        url: img?.url ?? '',
        alt: img?.alt ?? restaurant.name,
        title: img?.title ?? restaurant.name,
      }))
      .filter((img) => !!img.url)
  }

  return restaurant
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Restaurants')
    .select(FULL_SELECT)
    .eq('id', id)
    .single()
  if (error || !data) return null
  return mapRow(data)
}

async function syncRestaurantTags(restaurantId: string, tagIds: number[]) {
  const supabase = await createClient()
  await supabase.from('Restaurant_tags').delete().eq('restaurantId', restaurantId)
  if (tagIds.length === 0) return
  const rows = tagIds.map((tagId) => ({ restaurantId, tagId }))
  const { error } = await supabase.from('Restaurant_tags').insert(rows)
  if (error) throw new Error(`Gagal sync tag: ${error.message}`)
}

async function resolveUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const supabase = await createClient()
  let query = supabase
    .from('Restaurants')
    .select('slug')
    .or(`slug.eq.${baseSlug},slug.like.${baseSlug}-%`)
  if (excludeId) query = query.neq('id', excludeId)
  const { data, error } = await query
  if (error) throw new Error(`Gagal cek slug: ${error.message}`)

  const existing = new Set((data ?? []).map((r: any) => r.slug))
  if (!existing.has(baseSlug)) return baseSlug
  for (let i = 2; i < 1000; i++) {
    const candidate = `${baseSlug}-${i}`
    if (!existing.has(candidate)) return candidate
  }
  throw new Error('Slug suffix terlalu banyak (>1000)')
}

async function buildSlug(values: RestaurantValues, excludeId?: string): Promise<string> {
  const supabase = await createClient()
  const [{ data: p }, { data: c }, { data: d }] = await Promise.all([
    supabase.from('Provinces').select('name').eq('id', values.provinceId).single(),
    supabase.from('Cities').select('name').eq('id', values.cityId).single(),
    supabase.from('Districts').select('name').eq('id', values.districtId).single(),
  ])
  const baseSlug = generateRestaurantSlug({
    name: values.name,
    district: d?.name ?? '',
    city: c?.name ?? '',
    province: p?.name ?? '',
  })
  return resolveUniqueSlug(baseSlug, excludeId)
}

export async function createRestaurant(values: RestaurantValues) {
  await requireAdmin()
  const supabase = await createClient()

  const slug = await buildSlug(values)
  const { tagIds, photoUrl, ...rest } = values

  const { data, error } = await supabase
    .from('Restaurants')
    .insert([{ ...rest, slug, photoUrl: photoUrl || null }])
    .select('id')
    .single()
  if (error || !data) throw new Error(`Gagal membuat restoran: ${error?.message}`)

  await syncRestaurantTags(data.id, tagIds ?? [])
  return data.id as string
}

export async function updateRestaurant(id: string, values: RestaurantValues) {
  await requireAdmin()
  const supabase = await createClient()

  const slug = await buildSlug(values, id)
  const { tagIds, photoUrl, ...rest } = values

  const { error } = await supabase
    .from('Restaurants')
    .update({ ...rest, slug, photoUrl: photoUrl || null })
    .eq('id', id)
  if (error) throw new Error(`Gagal update restoran: ${error.message}`)

  await syncRestaurantTags(id, tagIds ?? [])
}

export async function deleteRestaurant(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from('Restaurant_tags').delete().eq('restaurantId', id)
  const { error } = await supabase.from('Restaurants').delete().eq('id', id)
  if (error) throw new Error(`Gagal hapus restoran: ${error.message}`)
}

export async function getRestaurantStats() {
  const supabase = await createClient()
  const [{ count: restaurantCount }, { count: reviewCount }, { count: userCount }] = await Promise.all([
    supabase.from('Restaurants').select('*', { count: 'exact', head: true }),
    supabase.from('Reviews').select('*', { count: 'exact', head: true }),
    supabase.from('Users').select('*', { count: 'exact', head: true }),
  ])
  return {
    restaurants: restaurantCount ?? 0,
    reviews: reviewCount ?? 0,
    users: userCount ?? 0,
  }
}

export async function getRestaurantByIdRaw(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Restaurants')
    .select(`
      id, slug, name, description, address, "provinceId", "cityId", "districtId",
      latitude, longitude, "photoUrl", featured, created_at,
      Restaurant_tags:Restaurant_tags!Restaurant_tags_restaurantId_fkey ( tagId )
    `)
    .eq('id', id)
    .single()
  if (error) throw new Error(`Restoran tidak ditemukan: ${error.message}`)
  return data
}
