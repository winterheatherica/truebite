export type RestaurantTag = {
  slug: string
  name: string
}

export type RestaurantImage = {
  url: string
  alt: string
  title: string
}

export type Restaurant = {
  id: string
  slug: string
  name: string
  description: string
  province: string
  city: string
  district: string
  address: string
  latitude: number
  longitude: number
  tags: RestaurantTag[]
  photoUrl: string
  images: RestaurantImage[]
  featured: boolean
  averageRating: number
  reviewCount: number
}

export type Review = {
  id: number
  restaurantId: string
  userName: string
  rating: number
  content: string
  sentiment: "positive" | "neutral" | "negative" | null
  createdAt: string
}

export type Tag = {
  id: number
  name: string
  slug: string
}
