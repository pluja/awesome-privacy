import type { APIRoute } from "astro";
import { rss, topicFeed } from "../../lib/feed.ts";
import { pages, recent, type Page } from "../../lib/site.ts";

export function getStaticPaths() {
  return pages.map((page) => ({ params: { slug: page.slug }, props: { page } }));
}

export const GET: APIRoute = ({ site, props }) => {
  const { page } = props as { page: Page };
  return rss(site!, {
    title: topicFeed(page).title,
    path: topicFeed(page).href,
    link: page.url,
    description: `New private alternatives in ${page.section.title}.`,
    items: recent.filter((p) => p.page === page),
  });
};
