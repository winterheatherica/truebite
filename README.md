# TrueBite

**TrueBite** adalah platform web penemuan kuliner UMKM lokal Indonesia, dilengkapi sistem ulasan jujur yang dianalisis menggunakan AI sentiment analysis. Dibangun sebagai MVP untuk hackathon — fokus ke pencarian cepat, browsing per wilayah, dan ringkasan rasa "warung ini bagus apa enggak" tanpa harus baca semua review satu per satu.

Spec lengkap ada di [`prd.md`](./prd.md).

---

## Tech Stack

| Layer | Pilihan |
|-------|---------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | TailwindCSS v4 — color system di [`app/globals.css`](./app/globals.css) (palette Rose & Pepper) |
| Database & Auth | Supabase (Postgres + Auth + SSR via `@supabase/ssr`) |
| AI Sentiment | HuggingFace Inference API — model `cardiffnlp/twitter-xlm-roberta-base-sentiment` |
| Maps | Deep link ke Google Maps via koordinat (tanpa API key) |
| Deployment | Vercel |

> Project ini pakai **Next.js 16** yang punya breaking changes dari versi sebelumnya. Lihat [`AGENTS.md`](./AGENTS.md) untuk konteks dan rujukan dokumentasi yang terpasang di `node_modules/next/dist/docs/`.

---

## Fitur

- **Pencarian kuliner** — search bar full-text + filter multi-tag (cuisine, occasion, vibe, dll), tidak butuh login.
- **Browsing per wilayah** — drill-down **Provinsi → Kota/Kabupaten → Kecamatan** dengan breadcrumb clickable. Region hierarchy dibangun on-the-fly dari restoran yang ada, jadi cuma menampilkan wilayah yang punya data.
- **Halaman detail restoran** — carousel foto, alamat sampai level kecamatan, tag, rating agregat, link "Lihat di Google Maps" via deep link koordinat.
- **Review + AI sentiment** — user login menulis review, teks dianalisis HuggingFace inference, hasil `positive | neutral | negative` disimpan bersama `positiveScore`, `neutralScore`, dan rating yang diturunkan otomatis dari sentiment + skor. Hanya review **positif** yang tampil di halaman publik; rating agregat mengeluarkan review negatif untuk menjaga sinyal tetap jujur.
- **Admin dashboard** (`/admin`) — CRUD restoran lengkap dengan multi-tag, image gallery, geocoding manual lat/long, dan slug auto-generate dari nama + wilayah. Dikunci `role = 'admin'` di tabel `Users`.
- **SEO** — `generateMetadata` dinamis per-restoran, JSON-LD `Restaurant` + `BreadcrumbList`, `sitemap.ts` & `robots.ts`, geo meta tags. Lihat [SEO section](#seo).
- **Footer dinamis** — 10 random pick masing-masing dari Districts/Cities/Provinces/Tags (40 link total), di-cache 3600 detik via `unstable_cache`.
- **Iklan inline & floating** — slot iklan disisipkan secara berkala di antara kartu restoran (`lib/utils/withAds.ts`) + komponen floating + side-ad untuk halaman detail.

---

## Struktur Project

```
truebite/
├── app/
│   ├── (main)/                Public routes — share Navbar + Footer
│   │   ├── page.tsx           Homepage (hero search + featured)
│   │   ├── search/            Pencarian + filter tag
│   │   ├── nearby/            Drill-down Provinsi → Kota → Kecamatan
│   │   └── restaurant/[slug]/ Detail + review + JSON-LD
│   ├── (auth)/                Login & register (layout terpisah)
│   ├── (admin)/admin/         Admin dashboard (role-gated)
│   ├── auth/callback/         Supabase email confirmation callback
│   ├── layout.tsx             Root layout + metadata
│   ├── sitemap.ts             Sitemap dinamis dari Supabase (revalidate 1h)
│   ├── robots.ts              Allow/disallow rules
│   └── globals.css            Color system (Rose & Pepper palette)
│
├── components/
│   ├── Navbar/                Desktop + mobile nav, user menu, sign-out action
│   ├── Footer/                About / QuickLinks (4 col random) / Social / BottomBar
│   ├── Homepage/              Hero search + featured restaurants
│   ├── Search/                SearchBar, TagFilter, SearchResults
│   ├── Nearby/                LocationDrilldown (3 level), NearbyList
│   ├── Restaurant/            Card, Detail, ImageCarousel, ReviewForm, ReviewList,
│   │                          ReviewCard, AdCard, GoogleAdCard, SideAd
│   ├── Admin/                 RestaurantForm + header actions + server actions
│   ├── Login/ Register/       Auth forms + server actions
│   ├── ui/                    StarRating, SentimentBadge, TagChip
│   └── FloatingAds.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          Browser client (createBrowserClient)
│   │   └── server.ts          SSR client (createServerClient + cookies)
│   ├── schemas/               Zod-style validation untuk auth, restaurant, review
│   ├── sentiment/             HuggingFace inference + retry + in-memory cache
│   ├── types/                 Restaurant, Review, Tag (shared shapes)
│   └── utils/                 deriveRating, slug, withAds, site-url
│
├── services/                  Server-only data access (mostly 'use server')
│   ├── restaurant-service.ts  Query + CRUD restoran, mapping relasi join
│   ├── review-service.ts      addReview (jalankan sentiment), getReviews,
│   │                          deleteReview
│   ├── user-service.ts        getCurrentUser, requireAdmin, role mgmt
│   ├── location-service.ts    Province/City/District queries
│   ├── tag-service.ts         getAllTags
│   ├── footer-service.ts      Random picks 4×10 dengan unstable_cache 3600s
│   └── auth-services.ts       Sign-in / sign-up / sign-out
│
├── middleware.ts              Refresh session Supabase setiap request
├── next.config.ts             Default config
├── prd.md                     Product Requirements Document
├── AGENTS.md                  Catatan untuk AI agent (Next.js 16 caveat)
└── CLAUDE.md                  Pointer ke AGENTS.md
```

---

## Data Model (Supabase / Postgres)

```
Provinces  (id, name, kode)
Cities     (id, name, kode, provinceId → Provinces)
Districts  (id, name, kode, cityId → Cities)

Tags             (id, name, slug)
Restaurants      (id, slug, name, description, address, latitude, longitude,
                  provinceId, cityId, districtId, photoUrl, featured, created_at)
Restaurant_tags  (id, restaurantId → Restaurants, tagId → Tags)
Images           (id, url, alt, title, restaurantId → Restaurants)

Users      (id, email, name, username, role, created_at)
Sentiments (id, label)        — seed: 'positive', 'neutral', 'negative'
Reviews    (id, content, rating, user_id → Users, restaurant_id → Restaurants,
            sentimentId → Sentiments, sentimentScore, positiveScore,
            neutralScore, created_at)
```

Rating per review **diturunkan** dari hasil sentiment (`lib/utils/derive-rating.ts`) — bukan input langsung dari user — supaya skor agregat tidak bisa dimanipulasi cuma dengan klik bintang.

---

## Setup

### Prasyarat

- Node.js 20+
- Akun Supabase (project dengan tabel sesuai data model di atas)
- HuggingFace API token

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Buat file `.env` di root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<legacy-anon-key>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres

# HuggingFace Inference API
HUGGINGFACE_TOKEN=hf_xxx

# Public site URL — dipakai untuk metadataBase, canonical, sitemap, JSON-LD
NEXT_PUBLIC_SITE_URL=https://truebite.vercel.app
```

### 3. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 4. Build & start production

```bash
npm run build
npm start
```

---

## Catatan Implementasi

### Sentiment Pipeline

`services/review-service.ts → addReview()`:
1. User submit konten review.
2. `analyzeSentiment(text)` dipanggil — request ke HuggingFace Inference API dengan retry pada status 503 (cold start model).
3. Output: `topLabel`, `topScore`, `positiveScore`, `neutralScore`.
4. `deriveRating(label, positive, neutral)` ngeluarin rating 1–5 dari skor.
5. Insert ke `Reviews` dengan referensi ke baris `Sentiments` yang cocok.

Cache in-memory di `lib/sentiment/sentimentAnalysis.ts` menyimpan hasil per teks (deduplikasi review identik) selama lifetime instance.

### Filtering Review

`getReviewsByRestaurantId` hanya mengembalikan review dengan `sentiment = positive` — review negatif/netral tetap ada di DB (untuk analytics) tapi tidak ditampilkan di halaman publik. Rating agregat di `restaurant-service.ts → mapRow()` menghitung rata-rata dari review non-negatif.

### Auth & Middleware

`middleware.ts` me-refresh session Supabase di setiap request supaya cookie auth tidak expire. Server actions di `services/*` baca user current via `getCurrentUser()` yang join ke tabel `Users` (untuk dapat role).

Admin di-gate dua lapis:
- `app/(admin)/admin/layout.tsx` — redirect kalau bukan admin.
- `requireAdmin()` di server action — throw kalau bukan admin (defense-in-depth).

### SEO

Halaman `/restaurant/[slug]` punya:
- **`generateMetadata`** dinamis: title `{name} — {city}, {province}`, description gabungan deskripsi + tag + rating + jumlah ulasan, OG image dari `photoUrl`, geo meta tags.
- **JSON-LD `Restaurant`** lengkap dengan `aggregateRating`, `review[]` (10 review positif teratas), `geo` koordinat, `hasMap` deep link, `servesCuisine` dari tags.
- **JSON-LD `BreadcrumbList`** — Beranda → Cari → Nama restoran.
- **React Server Component**: `getRestaurantBySlug` di-wrap `React.cache` supaya `generateMetadata` + page render share 1 query per request.

`app/sitemap.ts` ngeluarin semua slug restoran dari Supabase (revalidate 1 jam). `app/robots.ts` disallow `/admin`, `/api`, `/login`, `/register`.

### Caching

- **Footer picks** (`services/footer-service.ts`) — `unstable_cache` 3600s. Random 10 dari masing-masing tabel lokasi + Tags, dihitung sekali per jam untuk semua visitor.
- **Sitemap** — `export const revalidate = 3600`.
- **Sentiment** — in-memory Map per instance.

> `unstable_cache` di Next.js 16 sudah ditandai deprecated; pengganti modern-nya `'use cache'` butuh flag `cacheComponents: true` di `next.config.ts`. Belum di-enable karena efeknya project-wide.

### Iklan Inline

`lib/utils/withAds.ts` menyisipkan placeholder iklan (`GoogleAdCard`) tiap N item di grid hasil pencarian / nearby — pola untuk monetisasi tanpa mengganggu UX scroll.

---

## Deployment (Vercel)

1. Push repo ke GitHub.
2. Import di Vercel.
3. Set semua env var dari `.env` di **Settings → Environment Variables** — termasuk `NEXT_PUBLIC_SITE_URL` dengan domain Vercel/custom.
4. Deploy.

`.env` lokal **tidak** ke-push ke Vercel, jadi jangan lupa konfigurasi env-nya manual di dashboard.

---

## Scope

Mengikuti `prd.md`:

**In scope (MVP):** search + filter, nearby drill-down, detail page, review + sentiment, auth dasar, admin CRUD.

**Out of scope:** delivery/pemesanan, payment gateway, map embed interaktif, push notification, dashboard UMKM owner, rekomendasi personal, mobile app.
