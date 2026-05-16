import Link from "next/link";
import { getRestaurantBySlug } from "@/services/restaurant-service";
import { getReviewsByRestaurantId } from "@/services/review-service";
import { getCurrentUser } from "@/services/user-service";
import RestaurantDetail from "@/components/Restaurant/RestaurantDetail";
import ReviewList from "@/components/Restaurant/ReviewList";
import ReviewForm from "@/components/Restaurant/ReviewForm";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) {
    return <NotFoundView />;
  }

  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) {
    return <NotFoundView />;
  }

  const [reviews, me] = await Promise.all([
    getReviewsByRestaurantId(restaurant.id),
    getCurrentUser(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-3 lg:py-12">
      <Link
        href="/search"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-rp-muted transition-colors hover:text-rp-foreground"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali ke daftar
      </Link>

      <RestaurantDetail restaurant={restaurant} />

      <hr className="my-12 border-rp-border" />

      <section className="space-y-8">
        <h2 className="text-lg font-bold text-rp-foreground lg:text-xl">
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
    </div>
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
