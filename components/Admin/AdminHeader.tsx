import Link from "next/link"
import { signOutAction } from "./header-actions"

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/restaurants", label: "Restoran" },
]

export default function AdminHeader({ name, username }: { name: string; username: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-rp-border bg-rp-background shadow-[0_1px_12px_rgba(28,20,16,0.08)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="bg-grad-rose-bloom rounded-full px-3 py-1 text-sm font-bold text-white">
              TrueBite
            </span>
            <span className="text-sm font-semibold text-rp-muted uppercase tracking-wider">
              Admin
            </span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-rp-foreground hover:bg-rp-secondary-pale hover:text-rp-primary transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-rp-foreground leading-tight">{name}</p>
            <p className="text-xs text-rp-muted">@{username}</p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg border border-rp-border px-3 py-1.5 text-sm font-medium text-rp-foreground hover:border-rp-destructive hover:text-rp-destructive transition-colors"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
