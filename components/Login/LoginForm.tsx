"use client";

import { useActionState } from "react";
import { loginUser } from "./actions";
import Link from "next/link";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginUser, null);

  return (
    <div className="bg-white/98 backdrop-blur rounded-3xl p-8 sm:p-12 shadow-2xl border border-rp-primary/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-rp-primary to-rp-primary-deep bg-clip-text text-transparent mb-2">
          Selamat Datang
        </h1>
        <p className="text-rp-muted text-base">Masuk ke akun Anda untuk melanjutkan</p>
      </div>

      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="p-3 text-sm text-white bg-rp-destructive rounded-lg text-center">
            {state.message}
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-rp-dark-2 tracking-wide">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isPending}
            placeholder="contoh@email.com"
            className="w-full px-4 py-2.5 border-2 border-rp-border rounded-lg text-rp-foreground bg-rp-secondary-pale hover:border-rp-primary focus:outline-none focus:border-rp-primary focus:shadow-lg focus:shadow-rp-primary/20 disabled:bg-gray-100 disabled:text-rp-muted disabled:cursor-not-allowed transition-all"
          />
          {state?.errors?.email && <p className="text-sm text-rp-destructive font-medium animate-pulse">{state.errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-rp-dark-2 tracking-wide">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            disabled={isPending}
            placeholder="Masukkan password Anda"
            className="w-full px-4 py-2.5 border-2 border-rp-border rounded-lg text-rp-foreground bg-rp-secondary-pale hover:border-rp-primary focus:outline-none focus:border-rp-primary focus:shadow-lg focus:shadow-rp-primary/20 disabled:bg-gray-100 disabled:text-rp-muted disabled:cursor-not-allowed transition-all"
          />
          {state?.errors?.password && <p className="text-sm text-rp-destructive font-medium animate-pulse">{state.errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 mt-6 bg-linear-to-r from-rp-primary to-rp-primary-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 capitalize"
        >
          {isPending ? "Sedang Masuk..." : "Masuk"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-rp-border text-center">
        <p className="text-rp-muted text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-rp-primary hover:text-rp-primary-deep transition-colors">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}