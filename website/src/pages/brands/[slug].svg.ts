import type { APIRoute } from "astro";
import { brandOf, type Brand } from "../../lib/brand.ts";
import { placedAvoid } from "../../lib/site.ts";

// The fill follows the reader's colour scheme, so the file works as a plain <img>.
export function getStaticPaths() {
  const brands = new Map(placedAvoid.map((p) => brandOf(p.item)).filter((b) => !!b).map((b) => [b.slug, b]));
  return [...brands.values()].map((brand) => ({ params: { slug: brand.slug }, props: { brand } }));
}

export const GET: APIRoute = ({ props }) => {
  const { brand } = props as { brand: Brand };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><style>path{fill:#6b6b74}@media (prefers-color-scheme:dark){path{fill:#a5a5ae}}</style><path d="${brand.path}"/></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
