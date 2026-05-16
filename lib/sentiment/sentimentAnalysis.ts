import 'server-only'

type SentimentLabel = 'positive' | 'neutral' | 'negative'

export type SentimentAnalysisOutput = {
  topLabel: SentimentLabel
  topScore: number
  positiveScore: number
  neutralScore: number
}

const MODEL_ID = 'cardiffnlp/twitter-xlm-roberta-base-sentiment'
const ENDPOINT = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`

const cache = new Map<string, SentimentAnalysisOutput>()

const LABEL_MAP: Record<string, SentimentLabel> = {
  label_0: 'negative',
  label_1: 'neutral',
  label_2: 'positive',
  positive: 'positive',
  neutral: 'neutral',
  negative: 'negative',
}

function normalizeLabel(raw: string): SentimentLabel | null {
  const key = raw.toLowerCase()
  return LABEL_MAP[key] ?? null
}

async function callInferenceApi(text: string, retries = 2): Promise<SentimentAnalysisOutput> {
  const token = process.env.HUGGINGFACE_TOKEN
  if (!token) {
    throw new Error('HUGGINGFACE_TOKEN is not set in environment variables.')
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  })

  if (res.status === 503 && retries > 0) {
    const body = await res.json().catch(() => ({}))
    const waitMs = Math.min(Math.ceil((body?.estimated_time ?? 5) * 1000), 30_000)
    await new Promise((r) => setTimeout(r, waitMs))
    return callInferenceApi(text, retries - 1)
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText)
    throw new Error(`HuggingFace API error ${res.status}: ${errText}`)
  }

  const raw = (await res.json()) as Array<Array<{ label: string; score: number }>> | Array<{ label: string; score: number }>
  const flat = Array.isArray(raw[0]) ? (raw[0] as Array<{ label: string; score: number }>) : (raw as Array<{ label: string; score: number }>)

  const scored = flat
    .map((r) => {
      const label = normalizeLabel(r.label)
      return label ? { label, score: r.score } : null
    })
    .filter((x): x is { label: SentimentLabel; score: number } => x !== null)

  if (scored.length === 0) {
    throw new Error('Sentiment model returned no recognized labels.')
  }

  const top = [...scored].sort((a, b) => b.score - a.score)[0]
  const positiveScore = scored.find((s) => s.label === 'positive')?.score ?? 0
  const neutralScore  = scored.find((s) => s.label === 'neutral')?.score ?? 0

  return {
    topLabel: top.label,
    topScore: top.score,
    positiveScore,
    neutralScore,
  }
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysisOutput> {
  const key = text.trim()
  const cached = cache.get(key)
  if (cached) return cached
  const result = await callInferenceApi(key)
  cache.set(key, result)
  return result
}
