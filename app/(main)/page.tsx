import HeroSearch from "@/components/Homepage/HeroSearch";
import FeaturedRestaurants from "@/components/Homepage/FeaturedRestaurants";
import { getFeaturedRestaurants } from "@/services/restaurant-service";

export default async function Home() {
  const featured = await getFeaturedRestaurants();

  return (
    <>
      <HeroSearch />
      <div className="bg-rp-background">
        <FeaturedRestaurants restaurants={featured} />
      </div>
    </>
  );
}
