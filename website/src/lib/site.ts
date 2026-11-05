import { resolve } from "node:path";
import { Marked } from "marked";
import { introOf, loadData } from "../../../scripts/data.ts";
import { byName, headingId } from "../../../scripts/labels.ts";
import type { AvoidItem, Entry, Section } from "../../../schema/schema.ts";
import logos from "../data/logos.json";
import tosdr from "../data/tosdr.json";
import { brandOf } from "./brand.ts";
import { avoidLogoId, logoId } from "./logo-id.ts";
import { PLATFORM_GROUP } from "./platforms.ts";

export type { AvoidItem, Entry, Section };

export const REPO = "https://github.com/pluja/awesome-privacy";
const NEW_DAYS = 60;

// Astro runs from website/, the data lives next to it.
const { meta, sections } = loadData(resolve(process.cwd(), "../data"));

export const sectionIntro = (s: Section) => introOf(s, meta);
export const terms = Object.entries(meta.terms ?? {});

export type Category = { emoji: string; title: string; slug: string; pages: Page[] };
export type Page = { slug: string; url: string; section: Section; category?: Category; count: number };
// path: headings from the page down to the section, e.g. ["Social Networks and Platforms", "YouTube", "Frontends"].
export type Placed<T> = { item: T; page: Page; section: Section; path: string[]; url: string };

const countEntries = (s: Section): number =>
  (s.recommend?.entries ?? []).reduce((n, e) => n + 1 + (e.children?.length ?? 0), 0) +
  (s.subsections ?? []).reduce((n, sub) => n + countEntries(sub), 0);

const makePage = (slug: string, category?: Category): Page => ({
  slug, url: `/${slug}/`, section: sections[slug], category, count: countEntries(sections[slug]),
});

export const categories: Category[] = meta.categories.map((c) => {
  const [emoji, ...words] = c.name.split(" ");
  const title = words.join(" ");
  const category: Category = { emoji, title, slug: headingId(title).replace(/-+/g, "-"), pages: [] };
  category.pages = c.sections.map((slug) => makePage(slug, category));
  return category;
});

export const appendix: Page[] = meta.appendix.map((slug) => makePage(slug));
export const pages: Page[] = [...categories.flatMap((c) => c.pages), ...appendix];
export const totalEntries = pages.reduce((n, p) => n + p.count, 0);

// One walk gives every heading, entry and avoided service an id unique within its page, and its place.
const ids = new Map<object, string>();
const hrefByHeading = new Map<string, string>();
export const placedSections: Placed<Section>[] = [];
export const placedEntries: Placed<Entry>[] = [];
export const placedAvoid: Placed<AvoidItem>[] = [];

for (const page of pages) {
  const used = new Set<string>();
  const unique = (base: string) => {
    let id = base || "item";
    for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  };
  const walk = (section: Section, top: boolean, parent: string[]) => {
    const path = [...parent, section.title];
    ids.set(section, unique(headingId(section.title)));
    const url = top ? page.url : `${page.url}#${ids.get(section)}`;
    hrefByHeading.set(headingId(section.title), url);
    placedSections.push({ item: section, page, section, path, url });
    const entries = (list: Entry[] = []) => list.forEach((e) => {
      ids.set(e, unique(headingId(plain(e.name))));
      placedEntries.push({ item: e, page, section, path, url: `${page.url}#${ids.get(e)}` });
      entries(e.children);
    });
    for (const a of section.avoid?.items ?? []) {
      ids.set(a, unique(`avoid-${headingId(a.name)}`));
      placedAvoid.push({ item: a, page, section, path, url });
      entries(a.tools);
    }
    entries(section.recommend?.entries);
    section.subsections?.forEach((sub) => walk(sub, false, path));
  };
  walk(page.section, true, []);
}

export const idOf = (item: object) => ids.get(item)!;
export const placeLabel = (p: Placed<unknown>) => p.path.join(" › ");
export const sorted = (list: Entry[] = []) => [...list].sort(byName);

export type Avoided = { name: string; slug: string; url: string; places: Placed<AvoidItem>[] };

// Each mainstream service once, with every section that offers a way out of it. The slug drops a
// trailing note in brackets: "Twitter (X)" lives at /alternatives/twitter/.
export const avoided: Avoided[] = [
  ...Map.groupBy(placedAvoid, (p) => p.item.name.toLowerCase()).values(),
].map((places) => {
  const name = places[0].item.name;
  const slug = logoId(name.replace(/\s*\(.*\)$/, ""));
  return { name, slug, url: `/alternatives/${slug}/`, places };
}).sort(byName);

for (const [slug, same] of Map.groupBy(avoided, (a) => a.slug)) {
  if (same.length > 1) throw new Error(`avoided services share the page /alternatives/${slug}/: ${same.map((a) => a.name).join(", ")}`);
}
export const avoidedByItem = new Map(avoided.flatMap((a) => a.places.map((p) => [p.item, a] as const)));

export type PickGroup = { section: Section; path: string[]; entries: Entry[] };

// What replaces a service: the picks under the section that names it, one group per subsection.
export function picksFor(place: Placed<AvoidItem>): PickGroup[] {
  const groups: PickGroup[] = [];
  const walk = (s: Section, path: string[]) => {
    if (s.recommend?.entries.length) groups.push({ section: s, path, entries: sorted(s.recommend.entries) });
    s.subsections?.forEach((sub) => walk(sub, [...path, sub.title]));
  };
  walk(place.section, []);
  return groups;
}

const buildDay = Date.parse(new Date().toISOString().slice(0, 10));
export const isNew = (e: Entry) => !!e.added && buildDay - Date.parse(e.added) < NEW_DAYS * 86_400_000;

export const recent: Placed<Entry>[] = placedEntries
  .filter((p) => p.item.added)
  .sort((a, b) => b.item.added!.localeCompare(a.item.added!) || byName(a.item, b.item));

const logoManifest: { [id: string]: { source: string | null } } = logos;
export const logoOf = (name: string) => (logoManifest[logoId(name)]?.source ? `/logos/${logoId(name)}.webp` : undefined);

export type Review = { service: string; grade: string | null; points: string[] };
const reviews: { [id: string]: Review } = tosdr;
export const reviewOf = (a: AvoidItem) => (a.tosdr ? reviews[a.tosdr] : undefined);

// A monochrome brand glyph when Simple Icons has one, else the fetched logo, shown in grey.
export function avoidLogoOf(a: AvoidItem): { src: string; glyph: boolean } | undefined {
  const brand = brandOf(a);
  if (brand) return { src: `/brands/${brand.slug}.svg`, glyph: true };
  const id = avoidLogoId(a.name);
  return logoManifest[id]?.source ? { src: `/logos/${id}.webp`, glyph: false } : undefined;
}


// Space-separated filter groups an entry (or one of its children) runs on; "all" when it lists none.
export function platformGroups(e: Entry): string {
  if (!e.platforms?.length) return "all";
  const groups = new Set(e.platforms.map((p) => PLATFORM_GROUP[p]));
  for (const c of e.children ?? []) platformGroups(c).split(" ").forEach((g) => groups.add(g as never));
  return [...groups].join(" ");
}

export const editUrl = (page: Page) => `${REPO}/edit/main/data/sections/${page.slug}.yaml`;
export const reportUrl = (e: Entry, s: Section) =>
  `${REPO}/issues/new?template=report-a-problem.yml&entry=${encodeURIComponent(`${plain(e.name)}, in ${s.title}`)}`;

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// The data is written for the README: anchors point at README headings and raw HTML would be trusted as-is.
const marked = new Marked({
  renderer: {
    html: ({ text }) => escapeHtml(text),
    image: ({ href }) => {
      throw new Error(`images aren't allowed in the data, they would load from another server: ${href}`);
    },
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens);
      const anchor = href.match(/^(?:https:\/\/github\.com\/pluja\/awesome-privacy)?#(.+)$/)?.[1];
      const local = anchor && hrefByHeading.get(anchor);
      if (local) return `<a href="${escapeHtml(local)}">${text}</a>`;
      if (!/^(https?:|mailto:|\/)/.test(href)) throw new Error(`unsupported link in the data: ${href}`);
      return `<a href="${escapeHtml(href)}" rel="noopener">${text}</a>`;
    },
  },
});

export const md = (text = "") => marked.parse(text, { async: false });
export const mdInline = (text = "") => marked.parseInline(text, { async: false });
export function plain(text = "") { return text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, ""); }
export const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// Search results show about 155 characters: cut at the last sentence that fits, else at a word.
export function summary(text = "", max = 155) {
  const flat = plain(text).replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  return sentence > max / 2 ? cut.slice(0, sentence + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const avoidedIn = (s: Section): string[] => [...(s.avoid?.items.map((a) => a.name) ?? []), ...(s.subsections ?? []).flatMap(avoidedIn)];
export const avoidedNames = (page: Page) => [...new Set(avoidedIn(page.section))];

// "Mail Services: private alternatives to Gmail and Outlook", matching how people search.
export function pageTitle(page: Page) {
  const names = avoidedNames(page).slice(0, 2).map((n) => n.replace(/\s*\(.*\)$/, ""));
  return names.length ? `${page.section.title}: private alternatives to ${names.join(" and ")}` : page.section.title;
}
