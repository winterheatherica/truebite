'use server'
import { createClient } from '@/lib/supabase/server'
import { analyzeSentiment } from '@/lib/sentiment/sentimentAnalysis'
import { deriveRating } from '@/lib/utils/derive-rating'
import type { Review } from '@/lib/types/restaurant'

export async function addReview(content: string, restaurantId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Harus login untuk menulis review.")
  }

  const analysis = await analyzeSentiment(content)
  const label = analysis.topLabel
  const positiveScore = analysis.positiveScore
  const neutralScore = analysis.neutralScore
  const rating = deriveRating(label, positiveScore, neutralScore)

  const { data: sentimentData, error: sentimentError } = await supabase
    .from("Sentiments")
    .select("id")
    .eq("label", label)
    .single()

  if (sentimentError || !sentimentData) {
    throw new Error(`Sentiment label '${label}' tidak ditemukan di database.`)
  }

  const { error } = await supabase
    .from("Reviews")
    .insert([{
      user_id: user.id,
      restaurant_id: restaurantId,
      content,
      rating,
      sentimentId: sentimentData.id,
      sentimentScore: analysis.topScore,
      positiveScore,
      neutralScore,
    }])

  if (error) throw new Error(`Gagal menyimpan review: ${error.message}`)
}

// Public view: HANYA review positive yang ditampilkan.
export async function getReviewsByRestaurantId(restaurantId: string): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Reviews")
    .select(`
      id, content, rating, created_at, restaurant_id,
      Users:Users!Reviews_user_id_fkey ( name, username ),
      Sentiments:Sentiments!Reviews_sentimentId_fkey ( label )
    `)
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Gagal mengambil review: ${error.message}`)

  return (data ?? [])
    .filter((r: any) => r.Sentiments?.label === 'positive')
    .map((r: any) => ({
      id: r.id,
      restaurantId: r.restaurant_id,
      userName: r.Users?.name ?? r.Users?.username ?? "Anonim",
      rating: Number(r.rating),
      content: r.content,
      sentiment: (r.Sentiments?.label ?? null) as Review["sentiment"],
      createdAt: r.created_at,
    }))
}

export async function deleteReview(reviewId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Harus login untuk menghapus review.")
  const { error } = await supabase.from("Reviews").delete().eq("id", reviewId)
  if (error) throw new Error(`Gagal menghapus review: ${error.message}`)
}
