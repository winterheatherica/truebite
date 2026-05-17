import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/utils/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/nearby`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );

    const { data, error } = await supabase
      .from("Restaurants")
      .select("slug, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) return staticEntries;

    const restaurantEntries: MetadataRoute.Sitemap = data
      .filter((r) => r.slug)
      .map((r) => ({
        url: `${SITE_URL}/restaurant/${r.slug}`,
        lastModified: r.created_at ? new Date(r.created_at) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    return [...staticEntries, ...restaurantEntries];
  } catch {
    return staticEntries;
  }
}
