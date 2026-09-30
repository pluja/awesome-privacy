#!/usr/bin/env python3
"""Find candidate projects that are not in the list yet.

  python3 scripts/maint/discover.py [search] [privacyguides]

  search         GitHub search over privacy-related topics, active and well-starred
  privacyguides  tools recommended by privacyguides.org that we do not list

Writes .maint/discover.md. Candidates are leads for human review, not additions.
"""
import datetime as dt
import re
import sys
import time
from collections import defaultdict
from urllib.parse import urlparse

from readme import (cache_path, gh_api, http, links_in, load_readme, norm_url,
                    parse_entries, repo_of)

NOW = dt.datetime.now(dt.timezone.utc)
SINCE = (NOW - dt.timedelta(days=180)).date().isoformat()
MIN_STARS = 800
QUERIES = [
    "topic:privacy", "topic:privacy-tools", "topic:privacy-protection", "topic:e2ee",
    "topic:end-to-end-encryption", "topic:anti-tracking", "topic:self-hosted topic:privacy",
    "topic:alternative-frontend", "topic:degoogle", "topic:local-first", "topic:foss-alternatives",
    "topic:google-alternative", "topic:password-manager", "topic:vpn", "topic:tor",
    "topic:encryption topic:android", "topic:fdroid", "topic:self-hosted topic:photos",
    "topic:local-llm", "topic:offline-first",
]


def known():
    readme = load_readme()
    urls = {norm_url(u) for u in links_in(readme)}
    urls |= {norm_url(u) for u in re.findall(r"https?://[^\s)>\]\"']+", readme)}
    hosts = {urlparse("https://" + u).hostname for u in urls}
    names = {e.name.lower() for e in parse_entries(readme)}
    return urls, hosts, names


def is_known(url, homepage, name, k):
    urls, hosts, names = k
    if norm_url(url) in urls or (homepage and norm_url(homepage) in urls):
        return True
    if homepage and (urlparse(homepage).hostname or "").removeprefix("www.") in {
            (h or "").removeprefix("www.") for h in hosts}:
        return True
    return name.lower() in names


def search(k):
    seen, out = set(), []
    for q in QUERIES:
        full = f"{q} stars:>={MIN_STARS} pushed:>={SINCE} archived:false fork:false"
        status, data, hdrs = gh_api("search/repositories",
                                    "per_page=50&sort=stars&q=" + full.replace(" ", "+").replace(":", "%3A"))
        if status != 200:
            print(f"[search] {q}: HTTP {status}", flush=True)
        for r in (data or {}).get("items", []):
            if r["full_name"] in seen or not r.get("license"):
                continue
            seen.add(r["full_name"])
            if is_known(r["html_url"], r.get("homepage"), r["name"], k):
                continue
            out.append({"query": q, "repo": r["full_name"], "url": r["html_url"],
                        "homepage": r.get("homepage") or "", "stars": r["stargazers_count"],
                        "license": (r["license"] or {}).get("spdx_id"), "desc": r.get("description") or "",
                        "pushed": r["pushed_at"][:10], "topics": r.get("topics", [])[:6]})
        print(f"[search] {q}: {len((data or {}).get('items', []))} hits", flush=True)
        time.sleep(7)  # unauthenticated search allows 10 requests/minute
    return sorted(out, key=lambda r: -r["stars"])


def privacyguides(k):
    status, tree, _ = gh_api("repos/privacyguides/privacyguides.org/git/trees/main", "recursive=1")
    if status != 200:
        print(f"[pg] tree: HTTP {status}")
        return {}
    docs = [t["path"] for t in tree["tree"] if re.match(r"docs/[^/]+\.md$", t["path"])]
    found = defaultdict(list)
    for path in docs:
        s, body, _, _ = http(f"https://raw.githubusercontent.com/privacyguides/privacyguides.org/main/{path}")
        if s != 200:
            continue
        text = body.decode("utf-8", "replace")
        # Recommendation cards: a bold tool name followed by its homepage/source links.
        for block in re.split(r"\n(?=<div class=\"admonition recommendation\")", text)[1:]:
            name = re.search(r"\*\*([^*]+)\*\*", block)
            links = [u for u in re.findall(r"\]\((https?://[^)\s]+)\)", block)
                     if "privacyguides" not in u and "apps.apple.com" not in u
                     and "play.google.com" not in u and "wikipedia" not in u]
            if not name or not links:
                continue
            home = next((u for u in links if not repo_of(u)), links[0])
            src = next((u for u in links if repo_of(u)), "")
            if is_known(src or home, home, name[1], k):
                continue
            found[path.removeprefix("docs/").removesuffix(".md")].append(
                {"name": name[1].strip(), "home": home, "source": src})
    return found


def main():
    which = sys.argv[1:] or ["search", "privacyguides"]
    k = known()
    L = ["# Discovery candidates", "", f"Generated {NOW.date()}. Not in the list today; review each.", ""]
    if "privacyguides" in which:
        pg = privacyguides(k)
        L += [f"## Recommended by Privacy Guides, missing here ({sum(map(len, pg.values()))})", ""]
        for page, items in sorted(pg.items()):
            L.append(f"### {page}")
            L += [f"- {i['name']} - {i['home']}" + (f" (source {i['source']})" if i["source"] else "")
                  for i in items]
            L.append("")
    if "search" in which:
        rows = search(k)
        L += [f"## GitHub search ({len(rows)}; >= {MIN_STARS} stars, pushed since {SINCE}, licensed)", ""]
        L += [f"- [{r['repo']}]({r['url']}) {r['stars']}★ {r['license']} - {r['desc'][:150]}"
              f"{' - ' + r['homepage'] if r['homepage'] else ''} ({r['query']})" for r in rows]
    with open(cache_path("discover.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(L) + "\n")
    print("[discover] -> .maint/discover.md")


if __name__ == "__main__":
    main()
