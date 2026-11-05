import type { APIRoute } from "astro";
import { xml } from "../lib/feed.ts";
import { avoided, pages } from "../lib/site.ts";

export const GET: APIRoute = ({ site }) => {
  const paths = ["/", "/replace/", "/new/", "/about/", ...pages.map((p) => p.url), ...avoided.map((a) => a.url)];
  const urls = paths.map((p) => `<url><loc>${xml(new URL(p, site).href)}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml" },
  });
};
