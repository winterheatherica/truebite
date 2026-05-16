import Link from "next/link"
import { getRestaurantStats } from "@/services/restaurant-service"

export default async function AdminDashboardPage() {
  const stats = await getRestaurantStats()

  const cards = [
    { label: "Restoran", value: stats.restaurants, href: "/admin/restaurants" },
    { label: "Review", value: stats.reviews, href: "/admin/restaurants" },
    { label: "User", value: stats.users, href: "/admin/restaurants" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-rp-foreground">Dashboard Admin</h1>
        <p className="mt-1 text-rp-muted">Ringkasan data platform TrueBite</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-rp-border bg-white p-6 shadow-sm transition hover:shadow-md hover:border-rp-primary"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-rp-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-rp-foreground">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-rp-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rp-foreground">Aksi cepat</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/restaurants/new"
            className="bg-grad-rose-bloom rounded-lg px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
          >
            + Tambah restoran
          </Link>
          <Link
            href="/admin/restaurants"
            className="rounded-lg border border-rp-border px-4 py-2 text-sm font-medium text-rp-foreground hover:bg-rp-secondary-pale"
          >
            Kelola restoran
          </Link>
        </div>
      </div>
    </div>
  )
}
