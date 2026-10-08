#!/usr/bin/env python3
"""Monthly health + open-source audit of README.md.

One pass over every repository linked in the list, reporting:

  - Dead links, parsed from a lychee JSON report (produced by the workflow step).
  - Repositories that are gone, archived, stale (no push in 18+ months), not
    verifiably open source (no license, or only binaries/images/docs), or were
    renamed or transferred (the README link only works through a redirect).
  - Repos marked unmaintained (💀) that are active again.

Other findings on repos already marked 💀 go in a collapsed section and do not,
on their own, trigger a new issue. Every finding is a signal for human review,
not an automatic verdict. URLs matching .lycheeignore are skipped.

Usage:
  python3 scripts/health_report.py [--readme README.md]
      [--lychee lychee/out.json] [--limit N] [--out FILE]
  python3 scripts/health_report.py --diff-base REF   # PR mode: only added repos

Environment:
  GITHUB_TOKEN / GH_TOKEN  raises the GitHub rate limit from 60 to 5000 req/hr

Standard library only.
"""
import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

STALE_DAYS = 18 * 30  # ~18 months
REVIVED_DAYS = 180    # a 💀 repo with a commit this recent is active again
REPO_RE = re.compile(
    r"https?://(?:www\.)?(github\.com|codeberg\.org|gitlab\.com)/"
    r"([A-Za-z0-9._-]+)/([A-Za-z0-9._-]+)"
)
RESERVED = {
    "sponsors", "orgs", "topics", "about", "features", "marketplace", "settings",
    "explore", "collections", "apps", "notifications", "login", "join", "pricing",
    "security", "site", "contact", "readme", "search", "new", "watching", "stars",
    "users", "groups", "help", "-",
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
URL_RE = re.compile(r"https?://[^\s)\]\"'<>]+")
ENTRY_NAME_RE = re.compile(r"^\s*(?:>\s*)?[-*]\s+(?:\[[^\]]{1,4}\]\(#icons\)\s*)*\[([^\]!][^\]]*)\]\(")

# Report sections, in order: (kind, title, what to do about it).
SECTIONS = [
    ("gone", "Gone", "The repository no longer exists. Remove the entry, or find where it moved."),
    ("archived", "Archived", "Archived by the owner. Per the maintenance policy: remove it if a "
     "maintained alternative is listed, otherwise mark it 💀."),
    ("stale", "Stale", "No push in 18+ months. Quiet is not dead: check whether it still works "
     "before acting."),
    ("closed", "Not verifiably open source", "No license file (source-available is not open "
     "source), or no real source code in the repository."),
    ("moved", "Renamed or transferred", "The link only works through a redirect. Update the URL."),
    ("revived", "Marked 💀 but active again", "Recent commits on the default branch. "
     "Consider removing the 💀."),
]


def load_ignore(path=".lycheeignore"):
    """Regexes from .lycheeignore, the list lychee itself reads."""
    try:
        with open(path, encoding="utf-8") as fh:
            lines = fh.read().splitlines()
    except FileNotFoundError:
        return []
    return [re.compile(l.strip()) for l in lines if l.strip() and not l.lstrip().startswith("#")]


def strip_ignored(text, patterns):
    """Drop ignored URLs so their repos are not audited either."""
    if not patterns:
        return text
    return URL_RE.sub(lambda m: "" if any(p.search(m[0]) for p in patterns) else m[0], text)


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
        return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
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


def locate_repos(readme):
    """repo key -> "**Entry** (L123)" for the first README line that links it."""
    where = {}
    for i, line in enumerate(readme.splitlines(), 1):
        name = ENTRY_NAME_RE.match(line)
        label = f"**{name[1].strip()}** (L{i})" if name else f"L{i}"
        for host, owner, repo in REPO_RE.findall(line):
            cleaned = _clean(host, owner, repo)
            if cleaned:
                where.setdefault(cleaned[0], label)
    return where


def source_concern(langs):
    """Flag a repo whose 'source' is only binaries, images, or documentation."""
    if langs is None:
        return []
    if not langs:
        return ["no source code detected (only binaries, images, or empty)"]
    if not [l for l in langs if l not in DOC_ONLY]:
        return ["only documentation or markup (" + ", ".join(sorted(langs)) + ")"]
    return []


def _age(last, now):
    return f"last push {last.date()} (~{(now - last).days // 30} months ago)"


def check_repo(host, owner, repo, now, token, skull=False):
    """Findings for one repo as [(kind, detail)], or None when rate limited.

    Network blips return no findings rather than a false alarm.
    """
    slug = f"{owner}/{repo}"
    if host == "github.com":
        info, err = get_json(f"https://api.github.com/repos/{slug}", token)
        api = f"https://api.github.com/repos/{slug}"
    elif host == "codeberg.org":
        info, err = get_json(f"https://codeberg.org/api/v1/repos/{slug}")
        api = f"https://codeberg.org/api/v1/repos/{slug}"
    else:
        api = f"https://gitlab.com/api/v4/projects/{urllib.parse.quote(slug, safe='')}"
        info, err = get_json(api + "?license=true")
    if err == 403 and host == "github.com":
        return None
    if err in (404, 410):
        return [("gone", "repository not found")]
    if err or info is None:
        return []

    out = []
    archived = info.get("archived")
    if archived:
        out.append(("archived", "archived by the owner"))
    last = parse_ts(info.get("pushed_at") or info.get("updated_at") or info.get("last_activity_at"))
    if not archived and last is not None and (now - last).days > STALE_DAYS:
        out.append(("stale", _age(last, now)))

    # GitHub and GitLab follow renames with a redirect; the canonical name differs.
    canonical = info.get("full_name") or info.get("path_with_namespace") or slug
    if canonical.lower() != slug.lower():
        out.append(("moved", f"now at https://{host}/{canonical}"))

    if host in ("github.com", "gitlab.com") and not info.get("license"):
        out.append(("closed", "no license file"))  # Codeberg does not expose this reliably

    langs, lerr = get_json(f"{api}/languages", token if host == "github.com" else None)
    if lerr == 403 and host == "github.com":
        return None
    out += [("closed", c) for c in source_concern(langs)]

    if skull and not archived:
        commit = latest_commit(host, api, token)
        if commit and (now - commit).days < REVIVED_DAYS:
            out.append(("revived", f"last commit {commit.date()}"))
    return out


def latest_commit(host, api, token):
    """Date of the newest commit on the default branch (push dates count bots and branches)."""
    if host == "github.com":
        data, _ = get_json(f"{api}/commits?per_page=1", token)
        return parse_ts(((data or [{}])[0].get("commit") or {}).get("committer", {}).get("date"))
    if host == "codeberg.org":
        data, _ = get_json(f"{api}/commits?limit=1&stat=false")
        return parse_ts((data or [{}])[0].get("created"))
    data, _ = get_json(f"{api}/repository/commits?per_page=1")
    return parse_ts((data or [{}])[0].get("committed_date"))


def scan_repos(repos, skull_set, now, token, limit=0):
    """[(kind, slug, detail, is_skull)], checked count, rate_limited."""
    findings, checked, rate_limited = [], 0, False
    for host, owner, repo in repos:
        if limit and checked >= limit:
            break
        key = (host, owner.lower(), repo.lower())
        result = check_repo(host, owner, repo, now, token, skull=key in skull_set)
        if result is None:
            rate_limited = True
            break
        checked += 1
        findings += [(kind, key, detail, key in skull_set) for kind, detail in result]
        time.sleep(0.05)
    return findings, checked, rate_limited


def added_readme_text(base):
    """The lines a PR adds to README.md, for scoping the check to new entries."""
    try:
        out = subprocess.run(
            ["git", "diff", "--unified=0", base, "HEAD", "--", "README.md"],
            capture_output=True, text=True, check=False,
        ).stdout
    except Exception as exc:
        print(f"::warning::could not compute diff ({exc})", file=sys.stderr)
        return ""
    return "\n".join(
        line[1:] for line in out.splitlines()
        if line.startswith("+") and not line.startswith("+++")
    )


def _slug(key):
    return "/".join(key)


def run_pr_check(base, now, token, limit):
    """Check only the repos a PR adds. Warns, never blocks. Returns exit code 0."""
    added = strip_ignored(added_readme_text(base), load_ignore())
    repos = extract_repos(added)
    findings, checked, rate_limited = scan_repos(
        repos, extract_skull_repos(added), now, token, limit
    )
    new = [(_slug(key), detail) for kind, key, detail, skull in findings
           if not skull and kind != "revived"]
    for slug, why in new:
        print(f"::warning::{slug} - {why}")  # inline annotation on the PR

    lines = ["## Open-source check of added repositories", "",
             f"Checked {checked} newly added repo(s)."]
    if new:
        lines += ["", "Review these before merge (warnings, not blockers):"]
        lines += [f"- {slug} - {why}" for slug, why in new]
    else:
        lines.append("No open-source concerns in the added repositories.")
    if rate_limited:
        lines += ["", "_GitHub rate limit hit; some repos were not checked._"]
    summary = "\n".join(lines) + "\n"

    step = os.environ.get("GITHUB_STEP_SUMMARY")
    if step:
        with open(step, "a", encoding="utf-8") as fh:
            fh.write(summary)
    else:
        sys.stdout.write(summary)
    return 0  # warn only; the maintainer decides


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
            text = re.sub(r"^Rejected status code: |\s*\(configurable with .*\)$", "", text)
            if url and url not in seen:
                seen.add(url)
                dead.append((url, text))
    return dead, True


def group(findings):
    """{kind: {repo key: [details]}}, merging several details for one repo."""
    rows = {}
    for kind, key, detail, _ in findings:
        rows.setdefault(kind, {}).setdefault(key, []).append(detail)
    return rows


def row(key, details, where):
    """- **Entry** (L12) - github.com/o/r - archived by the owner; no license file"""
    parts = [where.get(key), _slug(key), "; ".join(details)]
    return "- " + " - ".join(p for p in parts if p)


def build_report(today, dead, dead_ok, findings, checked, rate_limited, where):
    revived = [f for f in findings if f[0] == "revived"]
    active = group([f for f in findings if not f[3] and f[0] != "revived"] + revived)
    known = group([f for f in findings if f[3] and f[0] != "revived"])
    known_count = len({key for by_key in known.values() for key in by_key})

    L = [f"# Health report {today}", "",
         "Automated monthly scan of `README.md`. Every finding is a signal for human",
         "review, not an automatic verdict. See the maintenance policy in",
         "[Contributing.md](misc/Contributing.md#maintenance-policy).", "",
         "| Check | Findings |", "|---|---|",
         f"| Dead links | {len(dead) if dead_ok else 'not checked'} |"]
    L += [f"| {title} | {len(active.get(kind, []))} |" for kind, title, _ in SECTIONS]
    L += [f"| Repositories checked | {checked}{' (stopped early, rate limit)' if rate_limited else ''} |", ""]

    L += [f"## Dead links ({len(dead)})", ""]
    if dead:
        L += [f"- {url} - {text}" for url, text in dead]
    elif dead_ok:
        L.append("None found.")
    else:
        L.append("_Link scan produced no output this run; dead links were not checked._")
    L.append("")

    for kind, title, hint in SECTIONS:
        by_key = active.get(kind, {})
        if by_key:
            L += [f"## {title} ({len(by_key)})", "", f"_{hint}_", ""]
            L += [row(key, details, where) for key, details in sorted(by_key.items())] + [""]

    if rate_limited:
        L += ["_Stopped early: GitHub rate limit hit. CI runs with a token for the full pass._", ""]
    if known:
        L += ["<details>", f"<summary>Already marked 💀 ({known_count})</summary>", "",
              "These already carry the skull. Shown for completeness; remove any that "
              "no longer work.", ""]
        merged = {}
        for kind, _, _ in SECTIONS:
            for key, details in known.get(kind, {}).items():
                merged.setdefault(key, []).extend(details)
        L += [row(key, details, where) for key, details in sorted(merged.items())]
        L += ["", "</details>", ""]
    L += ["_Some findings may be transient. Verify before acting._", ""]
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--readme", default="README.md")
    ap.add_argument("--lychee", default="lychee/out.json")
    ap.add_argument("--limit", type=int, default=0, help="cap repos checked (0 = all)")
    ap.add_argument("--out", default=None)
    ap.add_argument("--diff-base", default=None,
                    help="PR mode: check only repos added since this git ref (warns, never blocks)")
    args = ap.parse_args()

    now = dt.datetime.now(dt.timezone.utc)
    today = now.date().isoformat()
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")

    if args.diff_base:
        sys.exit(run_pr_check(args.diff_base, now, token, args.limit))

    with open(args.readme, encoding="utf-8") as fh:
        readme = strip_ignored(fh.read(), load_ignore())
    repos = extract_repos(readme)
    skull_set = extract_skull_repos(readme)
    print(f"[health] {len(repos)} repos, {len(skull_set)} already 💀", file=sys.stderr)

    dead, dead_ok = parse_dead_links(args.lychee)
    findings, checked, rate_limited = scan_repos(repos, skull_set, now, token, args.limit)

    report = build_report(today, dead, dead_ok, findings, checked, rate_limited,
                          locate_repos(readme))
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(report)
        print(f"[health] wrote {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(report)

    # Dead links, new problems on unmarked repos, or a 💀 that came back open an issue.
    actionable = [f for f in findings if not f[3] or f[0] == "revived"]
    has_findings = bool(dead) or bool(actionable) or not dead_ok
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a") as fh:
            fh.write(f"has_findings={'true' if has_findings else 'false'}\n")
            fh.write(f"date={today}\n")


if __name__ == "__main__":
    main()
