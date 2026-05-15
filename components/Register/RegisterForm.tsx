'use client'

import { useActionState } from "react";
import { registerUser } from "./actions";
import Link from "next/link";

export default function RegisterForm() {
  const [state, action, isPending] = useActionState(registerUser, null);

  return (
    <div className="bg-white/98 backdrop-blur rounded-3xl p-8 sm:p-12 shadow-2xl border border-rp-primary/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-rp-primary to-rp-primary-deep bg-clip-text text-transparent mb-2">
          Buat Akun
        </h1>
        <p className="text-rp-muted text-base">Bergabunglah dengan kami untuk memulai</p>
      </div>

      <form action={action} className="space-y-4">
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
            placeholder="Minimal 6 karakter"
            className="w-full px-4 py-2.5 border-2 border-rp-border rounded-lg text-rp-foreground bg-rp-secondary-pale hover:border-rp-primary focus:outline-none focus:border-rp-primary focus:shadow-lg focus:shadow-rp-primary/20 disabled:bg-gray-100 disabled:text-rp-muted disabled:cursor-not-allowed transition-all"
          />
          {state?.errors?.password && <p className="text-sm text-rp-destructive font-medium animate-pulse">{state.errors.password}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-rp-dark-2 tracking-wide">
            Konfirmasi Password
          </label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            required 
            disabled={isPending}
            placeholder="Masukkan ulang password"
            className="w-full px-4 py-2.5 border-2 border-rp-border rounded-lg text-rp-foreground bg-rp-secondary-pale hover:border-rp-primary focus:outline-none focus:border-rp-primary focus:shadow-lg focus:shadow-rp-primary/20 disabled:bg-gray-100 disabled:text-rp-muted disabled:cursor-not-allowed transition-all"
          />
          {state?.errors?.confirmPassword && <p className="text-sm text-rp-destructive font-medium animate-pulse">{state.errors.confirmPassword}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-2.5 mt-6 bg-linear-to-r from-rp-primary to-rp-primary-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 capitalize"
        >
          {isPending ? "Sedang Mendaftar..." : "Daftar"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-rp-border text-center">
        <p className="text-rp-muted text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-rp-primary hover:text-rp-primary-deep transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}