#!/usr/bin/env python3
"""Repository health for every forge-linked entry in the README.

  python3 scripts/maint/repos.py [--refresh]

GitHub: GraphQL when GITHUB_TOKEN is set, otherwise the public web page
(archived banner, renames) plus the commits.atom feed (last default-branch commit).
Codeberg and GitLab: their public APIs. Writes .maint/repos.json and repos.md.
"""
import datetime as dt
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import quote

from readme import cache_path, http, load_json, load_readme, parse_entries, save_json, token

NOW = dt.datetime.now(dt.timezone.utc)
STALE_DAYS = 540     # ~18 months without a commit
SLOW_DAYS = 365
REVIVED_DAYS = 180   # a 💀 entry with a commit this recent is a candidate to un-skull


def ts(value):
    return dt.datetime.fromisoformat(value.replace("Z", "+00:00")) if value else None


def github_web(owner, repo):
    for attempt in range(5):
        status, body, final, hdrs = http(f"https://github.com/{owner}/{repo}", timeout=30)
        if status != 429:
            break
        time.sleep(int(hdrs.get("Retry-After") or 0) or 20 * (attempt + 1))
    if status == 404:
        return {"state": "gone"}
    if status != 200:
        return {"state": "error", "detail": str(status)}
    page = body.decode("utf-8", "replace")
    m = re.search(r"This repository was archived by the owner on ([A-Z][a-z]+ \d+, \d{4})", page)
    out = {"state": "ok", "archived": bool(m) or '"isArchived":true' in page}
    if m:
        out["archived_on"] = dt.datetime.strptime(m[1], "%b %d, %Y").date().isoformat()
    m = re.match(r"https://github\.com/([^/]+)/([^/?#]+)", final)
    if m and f"{m[1]}/{m[2]}".lower() != f"{owner}/{repo}".lower():
        out["moved_to"] = f"https://github.com/{m[1]}/{m[2]}"
        owner, repo = m[1], m[2]
    status, body, _, _ = http(f"https://github.com/{owner}/{repo}/commits.atom", timeout=30)
    if status == 200:
        m = re.search(rb"<entry>.*?<updated>([^<]+)</updated>", body, re.S)
        out["last_commit"] = m[1].decode() if m else None
    time.sleep(0.7)
    return out


GQL = """repository(owner: %s, name: %s) { nameWithOwner isArchived pushedAt
  defaultBranchRef { target { ... on Commit { committedDate } } } }"""


def github_graphql(batch):
    parts = [f"r{i}: " + GQL % (json.dumps(o), json.dumps(r)) for i, (o, r) in enumerate(batch)]
    q = json.dumps({"query": "query {" + "\n".join(parts) + "}"}).encode()
    status, body, _, _ = http("https://api.github.com/graphql", method="POST", data=q,
                              headers={"Authorization": f"Bearer {token()}",
                                       "Content-Type": "application/json"}, timeout=60)
    data = (json.loads(body).get("data") or {}) if status == 200 else {}
    out = {}
    for i, (o, r) in enumerate(batch):
        node = data.get(f"r{i}")
        if node is None:
            out[(o, r)] = {"state": "gone" if status == 200 else "error"}
            continue
        target = (node.get("defaultBranchRef") or {}).get("target") or {}
        res = {"state": "ok", "archived": node["isArchived"],
               "last_commit": target.get("committedDate") or node["pushedAt"]}
        if node["nameWithOwner"].lower() != f"{o}/{r}".lower():
            res["moved_to"] = f"https://github.com/{node['nameWithOwner']}"
        out[(o, r)] = res
    return out


def gitea(owner, repo):
    status, body, _, _ = http(f"https://codeberg.org/api/v1/repos/{owner}/{repo}")
    if status == 404:
        return {"state": "gone"}
    if status != 200:
        return {"state": "error", "detail": str(status)}
    info = json.loads(body)
    last = None
    s2, b2, _, _ = http(f"https://codeberg.org/api/v1/repos/{owner}/{repo}/commits?limit=1&stat=false")
    if s2 == 200 and json.loads(b2):
        last = json.loads(b2)[0]["created"]
    return {"state": "ok", "archived": info.get("archived", False),
            "last_commit": last or info.get("updated_at")}


def gitlab(owner, repo):
    status, body, _, _ = http(f"https://gitlab.com/api/v4/projects/{quote(owner + '/' + repo, safe='')}")
    if status == 404:
        return {"state": "gone"}
    if status != 200:
        return {"state": "error", "detail": str(status)}
    info = json.loads(body)
    return {"state": "ok", "archived": info.get("archived", False),
            "last_commit": info.get("last_activity_at")}


def main():
    entries = [e for e in parse_entries(load_readme()) if e.repo]
    repos = {}
    for e in entries:
        repos.setdefault(e.repo, []).append(e)
    cache = {} if "--refresh" in sys.argv else load_json("repos.json", {})
    todo = [r for r in repos if "/".join(r) not in cache or cache["/".join(r)]["state"] == "error"]
    print(f"[repos] {len(repos)} repos, {len(todo)} to check "
          f"({'graphql' if token() else 'web scrape'} for GitHub)", flush=True)

    results = {}
    gh = [(o, r) for h, o, r in todo if h == "github.com"]
    if token():
        for i in range(0, len(gh), 50):
            for (o, r), res in github_graphql(gh[i:i + 50]).items():
                results[("github.com", o, r)] = res
    else:
        with ThreadPoolExecutor(3) as pool:
            for (o, r), res in zip(gh, pool.map(lambda x: github_web(*x), gh)):
                results[("github.com", o, r)] = res
    for h, o, r in todo:
        if h == "codeberg.org":
            results[(h, o, r)] = gitea(o, r)
        elif h == "gitlab.com":
            results[(h, o, r)] = gitlab(o, r)
    for k, v in results.items():
        cache["/".join(k)] = v
    for k, es in repos.items():
        cache["/".join(k)]["entries"] = [{"line": e.line, "name": e.name, "skull": e.skull,
                                          "section": e.section} for e in es]
    save_json("repos.json", cache)
    report(cache, set("/".join(k) for k in repos))


def report(cache, live):
    rows = {k: v for k, v in cache.items() if k in live}
    buckets = {k: [] for k in ("gone", "archived", "stale", "slow", "revived", "moved", "error")}
    for slug, v in sorted(rows.items()):
        skull = any(e["skull"] for e in v["entries"])
        where = ", ".join(f"L{e['line']} {e['name']}" for e in v["entries"])
        last = ts(v.get("last_commit"))
        days = (NOW - last).days if last else None
        age = f"last commit {last.date()} ({days // 30} mo)" if last else "no commit date"
        line = f"- {slug} - {age}{' - already 💀' if skull else ''} - {where}"
        if v["state"] in ("gone", "error"):
            buckets[v["state"]].append(line + (f" ({v.get('detail')})" if v.get("detail") else ""))
            continue
        if v.get("moved_to"):
            buckets["moved"].append(f"- {slug} -> {v['moved_to']} - {where}")
        if v.get("archived"):
            on = f" - archived {v['archived_on']}" if v.get("archived_on") else ""
            buckets["archived"].append(line.replace(f" - {where}", f"{on} - {where}", 1))
        elif days is not None and days > STALE_DAYS:
            buckets["stale"].append(line)
        elif skull and days is not None and days < REVIVED_DAYS:
            buckets["revived"].append(line)
        elif days is not None and days > SLOW_DAYS and not skull:
            buckets["slow"].append(line)
    titles = {
        "gone": "Repository gone (404)", "archived": "Archived",
        "stale": f"Stale (no commit in {STALE_DAYS // 30}+ months)",
        "slow": "Slowing (12-18 months without a commit, watch list)",
        "revived": "Marked 💀 but active again (un-skull candidates)",
        "moved": "Renamed or transferred (update the URL)", "error": "Could not check",
    }
    L = ["# Repository health", "", f"Generated {NOW.date()}, {len(rows)} repos.", ""]
    for k, t in titles.items():
        L += [f"## {t} ({len(buckets[k])})", ""] + buckets[k] + [""]
    with open(cache_path("repos.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(L))
    print("[repos] " + ", ".join(f"{k} {len(v)}" for k, v in buckets.items()) + " -> .maint/repos.md")


if __name__ == "__main__":
    main()
