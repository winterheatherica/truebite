"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { restaurants, tags } from "@/data/dummy";
import SearchBar from "@/components/Search/SearchBar";
import TagFilter from "@/components/Search/TagFilter";
import SearchResults from "@/components/Search/SearchResults";

export default function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const selectedTags = searchParams.getAll("tags");

  function updateURL(params: { q?: string; tags?: string[] }) {
    const sp = new URLSearchParams();
    if (params.q ?? query) sp.set("q", params.q ?? query);
    if (params.tags ?? selectedTags) {
      (params.tags ?? selectedTags).forEach((t) => sp.append("tags", t));
    }
    router.push(`/search?${sp.toString()}`);
  }

  function handleSearch(q: string) {
    updateURL({ q });
  }

  function handleTagToggle(slug: string) {
    const next = selectedTags.includes(slug)
      ? selectedTags.filter((t) => t !== slug)
      : [...selectedTags, slug];
    updateURL({ tags: next });
  }

  const filtered = useMemo(() => {
    let result = restaurants;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((r) =>
        selectedTags.some((st) => r.tags.includes(st)),
      );
    }

    return result;
  }, [query, selectedTags]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
      <div className="mb-8">
        <SearchBar initialQuery={query} onSearch={handleSearch} />
      </div>

      <div className="mb-10">
        <TagFilter
          tags={tags}
          selected={selectedTags}
          onToggle={handleTagToggle}
        />
      </div>

      <SearchResults restaurants={filtered} query={query} />
    </div>
  );
}
