import Link from "next/link";
import type { FooterPicks } from "@/services/footer-service";

type Section = {
  heading: string;
  links: { label: string; href: string }[];
};

export default function QuickLinks({ picks }: { picks: FooterPicks }) {
  const sections: Section[] = [
    {
      heading: "Districts",
      links: picks.districts.map((d) => ({
        label: d.name,
        href: `/nearby?district=${encodeURIComponent(d.name)}`,
      })),
    },
    {
      heading: "Cities",
      links: picks.cities.map((c) => ({
        label: c.name,
        href: `/search?q=${encodeURIComponent(c.name)}`,
      })),
    },
    {
      heading: "Provinces",
      links: picks.provinces.map((p) => ({
        label: p.name,
        href: `/search?q=${encodeURIComponent(p.name)}`,
      })),
    },
    {
      heading: "Tags",
      links: picks.tags.map((t) => ({
        label: t.name,
        href: `/search?tags=${encodeURIComponent(t.slug)}`,
      })),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {sections.map((section) => (
        <div key={section.heading} className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-rp-background">
            {section.heading}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={`${section.heading}-${link.label}`}>
                <Link
                  href={link.href}
                  className="block text-sm text-rp-muted transition-colors duration-200 hover:text-rp-primary"
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
