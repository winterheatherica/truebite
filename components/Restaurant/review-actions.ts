'use server'
import { revalidatePath } from 'next/cache'
import { addReview } from '@/services/review-service'

type ReviewActionState = {
  ok?: boolean
  error?: string
}

export async function submitReviewAction(
  restaurantId: string,
  _prev: ReviewActionState | null,
  fd: FormData,
): Promise<ReviewActionState> {
  const content = String(fd.get('content') ?? '').trim()

  if (!content) {
    return { error: 'Ulasan tidak boleh kosong' }
  }

  try {
    await addReview(content, restaurantId)
    revalidatePath('/restaurant/[slug]', 'page')
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Gagal mengirim review' }
  }
}
