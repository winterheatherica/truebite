import { z } from "zod"

const idNum = z.coerce.number().int().positive()

export const restaurantSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  description: z.string().min(1, "Deskripsi tidak boleh kosong").max(2000),
  address: z.string().min(1, "Alamat tidak boleh kosong").max(300),
  provinceId: idNum,
  cityId: idNum,
  districtId: idNum,
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  photoUrl: z.string().url("Harus URL valid").or(z.literal("")).optional(),
  featured: z.coerce.boolean().optional().default(false),
  tagIds: z.array(z.coerce.number().int().positive()).optional().default([]),
})

export type RestaurantValues = z.infer<typeof restaurantSchema>
