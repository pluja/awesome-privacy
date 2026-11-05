import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"><ShortName>Awesome Privacy</ShortName><Description>Private, open source alternatives to the apps you use</Description><InputEncoding>UTF-8</InputEncoding><Image width="16" height="16" type="image/svg+xml">${new URL("/favicon.svg", site)}</Image><Url type="text/html" method="get" template="${new URL("/replace/", site)}?q={searchTerms}"/></OpenSearchDescription>`,
    { headers: { "Content-Type": "application/opensearchdescription+xml" } },
  );
