import Link from "next/link"
import { getAllRestaurants } from "@/services/restaurant-service"
import { deleteRestaurantAction } from "@/components/Admin/restaurant-actions"

export default async function AdminRestaurantsPage() {
  const restaurants = await getAllRestaurants()

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-rp-foreground">Kelola Restoran</h1>
          <p className="mt-1 text-rp-muted">{restaurants.length} restoran terdaftar</p>
        </div>
        <Link
          href="/admin/restaurants/new"
          className="bg-grad-rose-bloom rounded-lg px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
        >
          + Tambah restoran
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-rp-border bg-white shadow-sm">
        {restaurants.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-rp-muted">Belum ada restoran.</p>
            <Link
              href="/admin/restaurants/new"
              className="mt-3 inline-block text-sm font-semibold text-rp-primary hover:text-rp-primary-deep"
            >
              Tambah yang pertama →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-rp-secondary-pale">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-rp-muted">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rp-border">
              {restaurants.map((r) => (
                <tr key={r.id} className="hover:bg-rp-secondary-pale/40">
                  <td className="px-4 py-3 font-semibold text-rp-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-rp-muted">
                    {[r.district, r.city, r.province].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((tag) => (
                        <span
                          key={tag.slug}
                          className="bg-grad-blush-mist rounded-full px-2 py-0.5 text-xs text-rp-primary"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {r.featured ? (
                      <span className="bg-grad-pepper-gold rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                        ★
                      </span>
                    ) : (
                      <span className="text-rp-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/restaurants/${r.id}/edit`}
                        className="rounded-lg border border-rp-border px-3 py-1.5 text-xs font-medium hover:border-rp-primary hover:text-rp-primary"
                      >
                        Edit
                      </Link>
                      <form action={deleteRestaurantAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-rp-border px-3 py-1.5 text-xs font-medium hover:border-rp-destructive hover:text-rp-destructive"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
