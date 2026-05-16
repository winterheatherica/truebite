export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function stripCityPrefix(name: string): string {
  return name.replace(/^(Kota Administrasi |Kota |Kabupaten )/i, "")
}

export function generateRestaurantSlug(parts: {
  name: string
  district: string
  city: string
  province: string
}): string {
  return slugify(
    `${parts.name}-${parts.district}-${stripCityPrefix(parts.city)}-${parts.province}`
  )
}
