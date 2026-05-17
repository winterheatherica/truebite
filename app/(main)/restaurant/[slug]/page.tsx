import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { getRestaurantBySlug } from "@/services/restaurant-service";
import { getReviewsByRestaurantId } from "@/services/review-service";
import { getCurrentUser } from "@/services/user-service";
import RestaurantDetail from "@/components/Restaurant/RestaurantDetail";
import ReviewList from "@/components/Restaurant/ReviewList";
import ReviewForm from "@/components/Restaurant/ReviewForm";
import { absoluteUrl } from "@/lib/utils/site-url";

const fetchRestaurant = cache((slug: string) => getRestaurantBySlug(slug));

type PageParams = { slug: string };

function buildMetaDescription(restaurant: Awaited<ReturnType<typeof getRestaurantBySlug>>) {
  if (!restaurant) return "";
  const location = [restaurant.district, restaurant.city, restaurant.province]
    .filter(Boolean)
    .join(", ");
  const tagList = restaurant.tags.map((t) => t.name).slice(0, 4).join(", ");
  const base = restaurant.description?.trim()
    ? restaurant.description.trim()
    : `${restaurant.name}${location ? ` di ${location}` : ""}.`;
  const rating =
    restaurant.averageRating > 0
      ? ` Rating ${restaurant.averageRating.toFixed(1)}/5 dari ${restaurant.reviewCount} ulasan.`
      : "";
  const tagPart = tagList ? ` Menyajikan ${tagList}.` : "";
  return `${base}${tagPart}${rating}`.replace(/\s+/g, " ").trim().slice(0, 200);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await fetchRestaurant(slug);

  if (!restaurant) {
    return {
      title: "Warung tidak ditemukan",
      description: "Halaman warung yang kamu cari tidak ada di TrueBite.",
      robots: { index: false, follow: false },
    };
  }

  const location = [restaurant.city, restaurant.province].filter(Boolean).join(", ");
  const title = location ? `${restaurant.name} — ${location}` : restaurant.name;
  const description = buildMetaDescription(restaurant);
  const canonical = `/restaurant/${restaurant.slug}`;
  const ogImage = restaurant.photoUrl || restaurant.images[0]?.url;

  return {
    title,
    description,
    keywords: [
      restaurant.name,
      ...restaurant.tags.map((t) => t.name),
      restaurant.district,
      restaurant.city,
      restaurant.province,
      "kuliner",
      "UMKM",
      "warung",
      "review makanan",
    ].filter(Boolean) as string[],
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "id_ID",
      url: canonical,
      siteName: "TrueBite",
      title,
      description,
      images: ogImage
        ? [{ url: ogImage, alt: restaurant.name, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    other: {
      "geo.position": restaurant.latitude && restaurant.longitude
        ? `${restaurant.latitude};${restaurant.longitude}`
        : "",
      "geo.placename": location,
      "geo.region": "ID",
    },
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  if (!slug) {
    return <NotFoundView />;
  }

  const restaurant = await fetchRestaurant(slug);
  if (!restaurant) {
    return <NotFoundView />;
  }

  const [reviews, me] = await Promise.all([
    getReviewsByRestaurantId(restaurant.id),
    getCurrentUser(),
  ]);

  const pageUrl = absoluteUrl(`/restaurant/${restaurant.slug}`);
  const schemaImages = [
    ...(restaurant.photoUrl ? [restaurant.photoUrl] : []),
    ...restaurant.images.map((img) => img.url).filter(Boolean),
  ];

  const restaurantLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": pageUrl,
    name: restaurant.name,
    description: restaurant.description || undefined,
    url: pageUrl,
    image: schemaImages.length ? schemaImages : undefined,
    servesCuisine: restaurant.tags.map((t) => t.name),
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address || undefined,
      addressLocality: restaurant.city || undefined,
      addressRegion: restaurant.province || undefined,
      addressCountry: "ID",
    },
  };

  if (restaurant.district) {
    (restaurantLd.address as Record<string, unknown>)["addressSubLocality"] =
      restaurant.district;
  }

  if (Number.isFinite(restaurant.latitude) && Number.isFinite(restaurant.longitude)) {
    restaurantLd.geo = {
      "@type": "GeoCoordinates",
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    };
    restaurantLd.hasMap = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;
  }

  if (restaurant.reviewCount > 0 && restaurant.averageRating > 0) {
    restaurantLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: restaurant.averageRating,
      reviewCount: restaurant.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (reviews.length > 0) {
    restaurantLd.review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.userName },
      datePublished: r.createdAt,
      reviewBody: r.content,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cari Warung",
        item: absoluteUrl("/search"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: restaurant.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article
        className="mx-auto max-w-4xl px-4 py-8 lg:px-3 lg:py-12"
        itemScope
        itemType="https://schema.org/Restaurant"
      >
        <meta itemProp="name" content={restaurant.name} />
        {restaurant.description && (
          <meta itemProp="description" content={restaurant.description} />
        )}

        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-rp-muted transition-colors hover:text-rp-foreground"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali ke daftar
          </Link>
        </nav>

        <RestaurantDetail restaurant={restaurant} />

        <hr className="my-12 border-rp-border" />

        <section className="space-y-8" aria-labelledby="reviews-heading">
          <h2
            id="reviews-heading"
            className="text-lg font-bold text-rp-foreground lg:text-xl"
          >
            Review & Rating
          </h2>

          {me ? (
            <ReviewForm restaurantId={restaurant.id} restaurantName={restaurant.name} />
          ) : (
            <div className="rounded-2xl border border-rp-border bg-rp-secondary-pale p-5 text-center">
              <p className="text-sm text-rp-foreground">
                <Link href="/login" className="font-semibold text-rp-primary hover:text-rp-primary-deep">
                  Login dulu
                </Link>{" "}
                untuk menulis review.
              </p>
            </div>
          )}

          <ReviewList reviews={reviews} />
        </section>
      </article>
    </>
  );
}

function NotFoundView() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-lg font-medium text-rp-foreground">
        Warung tidak ditemukan
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-xl bg-rp-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rp-primary-dark"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
