import Link from "next/link";

const sections = [
  {
    heading: "Explore",
    links: [
      { label: "Trending", href: "/search" },
      { label: "Popular", href: "/search?sort=popular" },
    ],
  },
  {
    heading: "Nearby",
    links: [
      { label: "Map View", href: "/nearby" },
      { label: "List View", href: "/nearby?view=list" },
    ],
  },
  {
    heading: "Tags",
    links: [
      { label: "Cuisines", href: "/tag" },
      { label: "Occasions", href: "/tag?type=occasion" },
    ],
  },
];

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {sections.map((section) => (
        <div key={section.heading} className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-rp-background">
            {section.heading}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-rp-muted transition-colors duration-200 hover:text-rp-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
