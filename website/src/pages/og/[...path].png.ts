import type { APIRoute } from "astro";
import { renderCard, type Card } from "../../lib/og.ts";
import { avoided, avoidedNames, pages, sentence, totalEntries } from "../../lib/site.ts";

const picks = (n: number) => `${n} ${n === 1 ? "pick" : "picks"}`;

export function getStaticPaths() {
  const cards: { path: string; card: Card }[] = [
    { path: "home", card: { title: "Private alternatives to the apps you use", subtitle: `${totalEntries} open source picks across ${pages.length} topics, kept up by a community since 2020.` } },
    ...pages.map((p) => {
      const names = avoidedNames(p).map((n) => n.replace(/\s*\(.*\)$/, ""));
      const instead = names.length ? `Instead of ${names.slice(0, 3).join(", ")} · ` : "";
      return { path: p.slug, card: { eyebrow: p.category?.title, title: p.section.title, subtitle: `${instead}${picks(p.count)}` } };
    }),
    ...avoided.map((a) => ({ path: `alternatives/${a.slug}`, card: { eyebrow: "Private alternatives to", title: a.name, subtitle: sentence(a.places[0].item.reason) } })),
  ];
  return cards.map(({ path, card }) => ({ params: { path }, props: { card } }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard((props as { card: Card }).card)), { headers: { "Content-Type": "image/png" } });
