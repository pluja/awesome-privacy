import * as simpleIcons from "simple-icons";

export type Brand = { slug: string; title: string; path: string };

const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const byTitle = new Map<string, Brand>(
  Object.values(simpleIcons as unknown as { [k: string]: Brand }).filter((i) => i.slug && i.path).map((i) => [key(i.title), i]),
);

// A Simple Icons glyph for an avoided service: by its name, then by its site, e.g. "Twitter (X)" by x.com
// and "Google Fonts (loaded from Google)" by fonts.google.com, falling back to the parent company.
export function brandOf(a: { name: string; site?: string }): Brand | undefined {
  const host = a.site ? new URL(a.site).hostname.replace(/^www\./, "").split(".") : [];
  const names = [a.name, a.name.replace(/\s*\(.*\)$/, ""), host[0], host.at(-2)];
  for (const name of names) {
    const brand = name && byTitle.get(key(name));
    if (brand) return brand;
  }
}
