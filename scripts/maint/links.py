#!/usr/bin/env python3
"""Check every non-forge link in the README.

  python3 scripts/maint/links.py [--workers 16] [--only-failed]

Writes .maint/links.json (all results) and .maint/links.md (problems by severity).
Forge repo links (github/codeberg/gitlab) are checked by repos.py via their APIs.
"""
import argparse
import re
import socket
import ssl
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

from readme import cache_path, http, links_in, load_json, load_readme, parse_entries, repo_of, save_json

PARKED = re.compile(
    r"domain (is|may be) for sale|buy this domain|this domain has expired|domain has been registered"
    r"|sedoparking|parkingcrew|dan\.com/|afternic|hugedomains|bodis\.com|domain parking"
    r"|this site can.t be reached|account has been suspended|site not found|default web page",
    re.I,
)
SKIP_HOSTS = {"localhost", "127.0.0.1", "shields.tosdr.org", "img.shields.io", "awesome.re"}


def base_domain(host):
    parts = (host or "").lower().removeprefix("www.").split(".")
    return ".".join(parts[-3:] if len(parts) > 2 and len(parts[-2]) <= 3 else parts[-2:])


def check(url):
    """(verdict, detail). verdict: ok | dead | moved | suspect."""
    host = urlparse(url).hostname or ""
    status, body, final, _ = http(url, timeout=25)
    if isinstance(status, str):
        low = status.lower()
        if any(s in low for s in ("name or service not known", "nodename nor servname",
                                   "no address associated", "temporary failure in name")):
            return "dead", "DNS does not resolve"
        if "refused" in low:
            return "dead", "connection refused"
        if "certificate" in low or "ssl" in low:
            return "suspect", status[:120]
        return "suspect", status[:120]
    if status in (404, 410):
        return "dead", f"HTTP {status}"
    if status in (401, 403, 429, 503) or status >= 500:
        return "suspect", f"HTTP {status}"
    if status >= 400:
        return "dead", f"HTTP {status}"
    text = body[:200_000].decode("utf-8", "replace")
    if PARKED.search(text) and len(text) < 60_000:
        return "dead", "parked / expired domain page"
    fhost = urlparse(final).hostname or ""
    if base_domain(fhost) != base_domain(host):
        return "moved", f"redirects to {final}"
    return "ok", str(status)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--workers", type=int, default=16)
    ap.add_argument("--only-failed", action="store_true", help="recheck only previous non-ok results")
    args = ap.parse_args()
    socket.setdefaulttimeout(25)

    readme = load_readme()
    where = defaultdict(list)
    for e in parse_entries(readme):
        for u in [e.url] + e.links:
            where[u].append(f"L{e.line} {e.name}")
    for i, line in enumerate(readme.splitlines(), 1):
        for u in links_in(line):
            where.setdefault(u, [f"L{i}"])
    urls = sorted(u for u in where
                  if u.startswith("http") and not repo_of(u)
                  and (urlparse(u).hostname or "") not in SKIP_HOSTS
                  and not re.match(r"https?://(www\.)?(github\.com|codeberg\.org|gitlab\.com)/", u))

    prev = load_json("links.json", {})
    if args.only_failed:
        urls = [u for u in urls if prev.get(u, {}).get("verdict", "ok") != "ok"]
    print(f"[links] checking {len(urls)} urls", flush=True)

    results = dict(prev)
    with ThreadPoolExecutor(args.workers) as pool:
        for url, (v, d) in zip(urls, pool.map(check, urls)):
            results[url] = {"verdict": v, "detail": d}
    # One slower retry for anything that failed, to shake out flakes.
    retry = [u for u in urls if results[u]["verdict"] != "ok"]
    print(f"[links] retrying {len(retry)}", flush=True)
    time.sleep(5)
    with ThreadPoolExecutor(4) as pool:
        for url, (v, d) in zip(retry, pool.map(check, retry)):
            results[url] = {"verdict": v, "detail": d}
    for u in results:
        results[u]["where"] = where.get(u, [])
    save_json("links.json", results)

    L = ["# Link check", ""]
    for verdict, title in [("dead", "Dead"), ("moved", "Redirects off-domain"),
                           ("suspect", "Inconclusive (bot wall, timeout, 5xx)")]:
        rows = sorted((u, r) for u, r in results.items() if r["verdict"] == verdict and u in where)
        L += [f"## {title} ({len(rows)})", ""]
        L += [f"- {u} - {r['detail']} - {', '.join(r['where'][:3])}" for u, r in rows]
        L.append("")
    with open(cache_path("links.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(L))
    counts = defaultdict(int)
    for u in where:
        if u in results:
            counts[results[u]["verdict"]] += 1
    print(f"[links] {dict(counts)} -> .maint/links.md")


if __name__ == "__main__":
    main()
