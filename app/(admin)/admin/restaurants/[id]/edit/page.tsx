import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
} from "@/services/location-service"
import { getAllTags } from "@/services/tag-service"
import { getRestaurantByIdRaw } from "@/services/restaurant-service"
import RestaurantForm from "@/components/Admin/RestaurantForm"
import { updateRestaurantAction } from "@/components/Admin/restaurant-actions"

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!id) notFound()

  const [restaurant, provinces, tags] = await Promise.all([
    getRestaurantByIdRaw(id).catch(() => null),
    getProvinces(),
    getAllTags(),
  ])

  if (!restaurant) notFound()
  const r = restaurant as any

  const [initialCities, initialDistricts] = await Promise.all([
    getCitiesByProvince(r.provinceId),
    getDistrictsByCity(r.cityId),
  ])

  const defaults = {
    name: r.name,
    description: r.description,
    address: r.address,
    provinceId: r.provinceId,
    cityId: r.cityId,
    districtId: r.districtId,
    latitude: r.latitude,
    longitude: r.longitude,
    photoUrl: r.photoUrl ?? "",
    featured: r.featured,
    tagIds: (r.Restaurant_tags ?? []).map((rt: any) => rt.tagId),
  }

  const action = updateRestaurantAction.bind(null, id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-rp-muted">
        <Link href="/admin/restaurants" className="hover:text-rp-primary">Restoran</Link>
        <span>/</span>
        <span className="text-rp-foreground">Edit · {r.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-rp-foreground">Edit restoran</h1>

      <div className="rounded-2xl border border-rp-border bg-white p-6 shadow-sm">
        <RestaurantForm
          action={action}
          defaults={defaults}
          submitLabel="Simpan perubahan"
          provinces={provinces}
          initialCities={initialCities}
          initialDistricts={initialDistricts}
          tags={tags}
        />
      </div>
    </div>
  )
}
