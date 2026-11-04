import type { APIRoute } from "astro";
import { avoidLogoOf, avoided, logoOf, placeLabel, placedEntries, placedSections, plain } from "../lib/site.ts";

// Compact rows: [kind, name, url, context, logo]. kind: s = topic, a = service to avoid, e = recommended app.
type Row = [kind: "s" | "a" | "e", name: string, url: string, context: string, logo: string];

export const GET: APIRoute = () => {
  const rows: Row[] = [
    ...placedSections.map((p): Row => ["s", p.item.title, p.url, p.path.length > 1 ? p.path.slice(0, -1).join(" › ") : (p.page.category?.title ?? ""), ""]),
    ...avoided.map((a): Row => ["a", a.name, a.url, a.places.map(placeLabel).join(" · "), avoidLogoOf(a.places[0].item)?.src ?? ""]),
    ...placedEntries.map((p): Row => ["e", plain(p.item.name), p.url, `${placeLabel(p)} · ${plain(p.item.description ?? "")}`, logoOf(p.item.name) ?? ""]),
  ];
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
};
