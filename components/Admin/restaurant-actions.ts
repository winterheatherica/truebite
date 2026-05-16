'use server'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { restaurantSchema } from "@/lib/schemas/restaurant-schema"
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "@/services/restaurant-service"

function parseForm(fd: FormData) {
  const raw = Object.fromEntries(fd.entries())
  const tagIds = fd.getAll("tagIds").map((v) => Number(v)).filter((n) => !Number.isNaN(n))
  return restaurantSchema.safeParse({
    ...raw,
    featured: fd.get("featured") === "true",
    tagIds,
  })
}

export async function createRestaurantAction(_prev: any, fd: FormData) {
  const parsed = parseForm(fd)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  try {
    await createRestaurant(parsed.data)
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Gagal membuat restoran" }
  }

  revalidatePath("/admin/restaurants")
  redirect("/admin/restaurants")
}

export async function updateRestaurantAction(id: string, _prev: any, fd: FormData) {
  const parsed = parseForm(fd)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  try {
    await updateRestaurant(id, parsed.data)
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Gagal update restoran" }
  }

  revalidatePath("/admin/restaurants")
  revalidatePath(`/admin/restaurants/${id}/edit`)
  redirect("/admin/restaurants")
}

export async function deleteRestaurantAction(fd: FormData) {
  const id = String(fd.get("id") ?? "")
  if (!id) return
  try {
    await deleteRestaurant(id)
  } catch (e) {
    console.error(e)
  }
  revalidatePath("/admin/restaurants")
}
