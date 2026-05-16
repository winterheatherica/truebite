export type SentimentLabel = 'positive' | 'neutral' | 'negative'

export function deriveRating(
  label: SentimentLabel,
  positiveScore: number,
  neutralScore: number,
): number {
  let raw: number
  if (label === 'positive') {
    raw = 4 + positiveScore
  } else if (label === 'neutral') {
    raw = 3 + positiveScore + neutralScore
  } else {
    raw = 1 + 4 * positiveScore
  }
  return Math.max(1, Math.min(5, Math.round(raw * 10) / 10))
}
