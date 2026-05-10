import { restaurants } from "@/data/dummy";
import HeroSearch from "@/components/Homepage/HeroSearch";
import FeaturedRestaurants from "@/components/Homepage/FeaturedRestaurants";

export default function Home() {
  const featured = restaurants.filter((r) => r.featured);

  return (
    <>
      <HeroSearch />
      <div className="bg-rp-background">
        <FeaturedRestaurants restaurants={featured} />
      </div>
    </>
  );
}
