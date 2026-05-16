import { z } from "zod"

export const reviewSchema = z.object({
    content : z.string().min(1, "Content tidak boleh kosong").max(500, "Content maksimal 500 karakter"),
    rating : z.number().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
    user_email : z.string().email("Email tidak valid")
})

export type ReviewValues = z.infer<typeof reviewSchema>