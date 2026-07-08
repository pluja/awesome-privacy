#!/usr/bin/env python3
"""Monthly health + open-source audit of README.md.

One pass over every repository linked in the list, reporting:

  - Dead links, parsed from a lychee JSON report (produced by the workflow step).
  - Repository issues: gone, archived, stale (no push in 18+ months), unlicensed,
    or no real source code (only binaries, images, or documentation, the
    "blob posing as open source" case).

Repos already marked unmaintained (💀) in the list are shown in a separate
section and do not, on their own, trigger a new issue. Every finding is a signal
for human review, not an automatic verdict.

Usage:
  python3 scripts/health_report.py [--readme README.md]
      [--lychee lychee/out.json] [--limit N] [--out FILE]

Environment:
  GITHUB_TOKEN / GH_TOKEN  raises the GitHub rate limit from 60 to 5000 req/hr

Standard library only.
"""
import argparse
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

STALE_DAYS = 18 * 30  # ~18 months
REPO_RE = re.compile(
    r"https?://(?:www\.)?(github\.com|codeberg\.org)/"
    r"([A-Za-z0-9._-]+)/([A-Za-z0-9._-]+)"
)
RESERVED = {
    "sponsors", "orgs", "topics", "about", "features", "marketplace", "settings",
    "explore", "collections", "apps", "notifications", "login", "join", "pricing",
    "security", "site", "contact", "readme", "search", "new", "watching", "stars",
}
# The list's own repo (badges, mirror, edit and issue links) is not a listed tool.
SELF_REPOS = {
    ("github.com", "pluja", "awesome-privacy"),
    ("codeberg.org", "pluja", "awesome-privacy"),
}
# Linguist "languages" that are documentation or markup, not real source code.
DOC_ONLY = {
    "Markdown", "Text", "reStructuredText", "AsciiDoc", "Org", "TeX",
    "Roff", "Rich Text Format",
}


def get_json(url, token=None, timeout=20):
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/json")
    req.add_header("User-Agent", "awesome-privacy-health-report")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.load(resp), None
    except urllib.error.HTTPError as exc:
        return None, exc.code
    except Exception:
        return None, "error"


def parse_ts(value):
    if not value:
        return None
    try:
        return dt.datetime.strptime(value.replace("Z", "+0000"), "%Y-%m-%dT%H:%M:%S%z")
    except ValueError:
        return None


def _clean(host, owner, repo):
    if owner.lower() in RESERVED:
        return None
    repo = repo[:-4] if repo.rstrip(".").endswith(".git") else repo.rstrip(".")
    if not repo:
        return None
    key = (host, owner.lower(), repo.lower())
    return None if key in SELF_REPOS else (key, (host, owner, repo))


def extract_repos(readme):
    repos = {}
    for host, owner, repo in REPO_RE.findall(readme):
        cleaned = _clean(host, owner, repo)
        if cleaned:
            key, value = cleaned
            repos.setdefault(key, value)
    return sorted(repos.values())


def extract_skull_repos(readme):
    skull = set()
    for line in readme.splitlines():
        if "💀" not in line:
            continue
        for host, owner, repo in REPO_RE.findall(line):
            cleaned = _clean(host, owner, repo)
            if cleaned:
                skull.add(cleaned[0])
    return skull


def source_concern(langs):
    """Flag a repo whose 'source' is only binaries, images, or documentation."""
    if langs is None:
        return []
    if not langs:
        return ["no source code detected (only binaries, images, or empty)"]
    if not [l for l in langs if l not in DOC_ONLY]:
        return ["only documentation or markup (" + ", ".join(sorted(langs)) + ")"]
    return []


def check_repo(host, owner, repo, now, token):
    """Combined staleness + openness reasons for one repo (empty = healthy)."""
    if host == "github.com":
        info, err = get_json(f"https://api.github.com/repos/{owner}/{repo}", token)
    else:
        info, err = get_json(f"https://codeberg.org/api/v1/repos/{owner}/{repo}")
    if err == 403:
        return ["__ratelimit__"]
    if err in (404, 410):
        return ["repository not found"]
    if err or info is None:
        return []  # transient; do not flag on a network blip

    reasons = []
    if info.get("archived"):
        reasons.append("archived")
    last = parse_ts(info.get("pushed_at") if host == "github.com" else info.get("updated_at"))
    if last is not None and (now - last).days > STALE_DAYS:
        reasons.append(f"no push since {last.date()} (~{(now - last).days // 30} months)")
    if host == "github.com" and not info.get("license"):
        reasons.append("no license")  # Codeberg/Gitea does not expose this reliably

    if host == "github.com":
        langs, lerr = get_json(f"https://api.github.com/repos/{owner}/{repo}/languages", token)
        if lerr == 403:
            return ["__ratelimit__"]
    else:
        langs, _ = get_json(f"https://codeberg.org/api/v1/repos/{owner}/{repo}/languages")
    reasons += source_concern(langs)
    return reasons


def scan_repos(repos, skull_set, now, token, limit=0):
    findings, checked, rate_limited = [], 0, False
    for host, owner, repo in repos:
        if limit and checked >= limit:
            break
        checked += 1
        reasons = check_repo(host, owner, repo, now, token)
        if reasons == ["__ratelimit__"]:
            rate_limited, checked = True, checked - 1
            break
        if reasons:
            key = (host, owner.lower(), repo.lower())
            findings.append((f"{host}/{owner}/{repo}", "; ".join(reasons), key in skull_set))
        time.sleep(0.05)
    return findings, checked, rate_limited


def parse_dead_links(path):
    """Return (dead_links, scan_ran). dead_links = [(url, reason), ...]."""
    try:
        with open(path) as fh:
            data = json.load(fh)
    except FileNotFoundError:
        return [], False
    except Exception as exc:
        print(f"::warning::could not parse lychee output ({exc})", file=sys.stderr)
        return [], False
    dead, seen = [], set()
    emap = data.get("error_map") or data.get("fail_map") or {}
    for entries in emap.values():
        for item in entries:
            url = item.get("url", "")
            status = item.get("status") or {}
            text = status.get("text") or status.get("details") or "error"
            if url and url not in seen:
                seen.add(url)
                dead.append((url, text))
    return dead, True


def build_report(today, dead, dead_ok, findings, checked, rate_limited):
    new = [(s, w) for s, w, sk in findings if not sk]
    known = [(s, w) for s, w, sk in findings if sk]
    L = [f"# Health report {today}", "", "Automated monthly scan of `README.md`. Every",
         "finding is a signal for human review, not an automatic verdict.", ""]

    L.append(f"## Dead links ({len(dead)})")
    L.append("")
    if dead:
        L += [f"- {url} - {text}" for url, text in dead]
    elif dead_ok:
        L.append("None found.")
    else:
        L.append("_Link scan produced no output this run; dead links were not checked._")
    L.append("")

    L.append(f"## Repository issues ({len(new)} new, {len(known)} already 💀, {checked} checked)")
    L.append("")
    L.append("Repos that are gone, archived, stale (no push in 18+ months), unlicensed,")
    L.append("or have no real source code (only binaries, images, or documentation).")
    L.append("Review before delisting, marking 💀, or trusting an \"open source\" claim.")
    L.append("")
    if new:
        L += [f"- {slug} - {why}" for slug, why in new]
    else:
        L.append("No new findings.")
    if rate_limited:
        L.append("")
        L.append("_Stopped early: GitHub rate limit hit. CI runs with a token for the full pass._")
    if known:
        L += ["", "### Already marked unmaintained (💀)", "",
              "These already carry the skull in the list. Shown for completeness.", ""]
        L += [f"- {slug} - {why}" for slug, why in known]
    L += ["", "_Some entries may be transient. Verify before acting._", ""]
    return "\n".join(L) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--readme", default="README.md")
    ap.add_argument("--lychee", default="lychee/out.json")
    ap.add_argument("--limit", type=int, default=0, help="cap repos checked (0 = all)")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    now = dt.datetime.now(dt.timezone.utc)
    today = now.date().isoformat()
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")

    with open(args.readme, encoding="utf-8") as fh:
        readme = fh.read()
    repos = extract_repos(readme)
    skull_set = extract_skull_repos(readme)
    print(f"[health] {len(repos)} repos, {len(skull_set)} already 💀", file=sys.stderr)

    dead, dead_ok = parse_dead_links(args.lychee)
    findings, checked, rate_limited = scan_repos(repos, skull_set, now, token, args.limit)

    report = build_report(today, dead, dead_ok, findings, checked, rate_limited)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(report)
        print(f"[health] wrote {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(report)

    # New (non-skull) repo problems or any dead links open an issue.
    new_findings = [f for f in findings if not f[2]]
    has_findings = bool(dead) or bool(new_findings) or not dead_ok
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a") as fh:
            fh.write(f"has_findings={'true' if has_findings else 'false'}\n")
            fh.write(f"date={today}\n")


if __name__ == "__main__":
    main()
