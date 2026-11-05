import { placeLabel, plain, type Entry, type Page, type Placed } from "./site.ts";

const ITEMS = 50;

export const topicFeed = (page: Page) => ({ title: `Awesome Privacy: new in ${page.section.title}`, href: `${page.url}feed.xml` });
export const xml = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export function rss(site: URL, feed: { title: string; path: string; link: string; description: string; items: Placed<Entry>[] }) {
  const items = feed.items.slice(0, ITEMS).map((p) => {
    const link = new URL(p.url, site).href;
    const text = `${plain(p.item.description ?? "")} In ${placeLabel(p)}.`.trim();
    return `<item><title>${xml(plain(p.item.name))}</title><link>${xml(link)}</link><guid isPermaLink="true">${xml(link)}</guid><pubDate>${new Date(`${p.item.added}T00:00:00Z`).toUTCString()}</pubDate><description>${xml(text)}</description></item>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(feed.title)}</title><link>${xml(new URL(feed.link, site).href)}</link><atom:link href="${xml(new URL(feed.path, site).href)}" rel="self" type="application/rss+xml"/><description>${xml(feed.description)}</description><language>en</language>${items.join("")}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
