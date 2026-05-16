'use server'
import { createClient } from '@/lib/supabase/server'
import { analyzeSentiment } from '@/lib/sentiment/sentimentAnalysis'

export async function addReview(content: string, rating: number, email: string) {
  const supabase = await createClient()

  const [sentimentResult] = await analyzeSentiment(content)
  const label = sentimentResult?.label

  if (!label) {
    throw new Error("Failed to analyze sentiment.")
  }

  const { data: sentimentData, error: sentimentError } = await supabase
    .from("Sentiments")
    .select("id")
    .eq("label", label)
    .single()

  if (sentimentError || !sentimentData) {
    throw new Error(`Sentiment label '${label}' not found in database.`)
  }

  const { data, error } = await supabase
    .from("Reviews")
    .insert([
      {
        email,
        content,
        rating,
        sentimentId: sentimentData.id
      }
    ])

}

export async function getReviews(restaurantId: number){
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Reviews")
    .select("*")
    .eq("restaurant_id", restaurantId)
}

export async function deleteReview(reviewId: number){
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Reviews")
    .delete()
    .eq("id", reviewId)
}