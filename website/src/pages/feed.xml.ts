import type { APIRoute } from "astro";
import { rss } from "../lib/feed.ts";
import { recent } from "../lib/site.ts";

export const GET: APIRoute = ({ site }) =>
  rss(site!, { title: "Awesome Privacy: recently added", path: "/feed.xml", link: "/", description: "New private alternatives added to Awesome Privacy.", items: recent });
