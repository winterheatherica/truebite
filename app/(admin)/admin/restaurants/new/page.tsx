import Link from "next/link"
import { getProvinces } from "@/services/location-service"
import { getAllTags } from "@/services/tag-service"
import RestaurantForm from "@/components/Admin/RestaurantForm"
import { createRestaurantAction } from "@/components/Admin/restaurant-actions"

export default async function NewRestaurantPage() {
  const [provinces, tags] = await Promise.all([
    getProvinces(),
    getAllTags(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-rp-muted">
        <Link href="/admin/restaurants" className="hover:text-rp-primary">Restoran</Link>
        <span>/</span>
        <span className="text-rp-foreground">Tambah baru</span>
      </div>

      <h1 className="text-3xl font-bold text-rp-foreground">Tambah restoran</h1>

      <div className="rounded-2xl border border-rp-border bg-white p-6 shadow-sm">
        <RestaurantForm
          action={createRestaurantAction}
          submitLabel="Simpan restoran"
          provinces={provinces}
          tags={tags}
        />
      </div>
    </div>
  )
}
