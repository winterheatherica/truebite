import { redirect } from "next/navigation"
import { getCurrentUser } from "@/services/user-service"
import AdminHeader from "@/components/Admin/AdminHeader"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser()

  if (!me) redirect("/login?next=/admin")
  if (me.role !== "admin") redirect("/")

  return (
    <div className="min-h-screen bg-rp-secondary-pale">
      <AdminHeader name={me.name} username={me.username} />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</main>
    </div>
  )
}
