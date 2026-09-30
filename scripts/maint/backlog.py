#!/usr/bin/env python3
"""Fetch and triage the open issue/PR backlog against the current README.

  python3 scripts/maint/backlog.py fetch [--refresh]  # issues, PRs, diffs into .maint/
  python3 scripts/maint/backlog.py triage    # writes .maint/triage.md and triage.json

Triage is offline and cheap to rerun after editing the README.
"""
import datetime as dt
import json
import os
import re
import subprocess
import sys
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

from readme import (ROOT, cache_path, gh_api, http, links_in, load_json, load_readme,
                    norm_url, parse_entries, repo_of, save_json)

REPO = "pluja/awesome-privacy"
NOW = dt.datetime.now(dt.timezone.utc)

ISSUE_KINDS = [
    ("dead-link", r"\b(dead|broken|404|not working|doesn'?t work|down|offline|expired|parked|domain)\b"),
    ("unmaintained", r"\b(archived|unmaintained|abandon\w*|deprecated|discontinued|no longer|dead project|shut ?down)\b"),
    ("removal", r"\b(remove|removal|delete|delist|shouldn'?t be|should not be|not private|tracker|spyware|telemetry|closed.source|proprietary|scam|malware|sold|acquired)\b"),
    ("addition", r"\b(add|adding|suggest\w*|include|request|new (app|tool|project|service)|consider|recommend)\b"),
]


def classify(it):
    """Title decides first; the body is only consulted when the title is vague."""
    title = it["title"]
    if it["user"].endswith("[bot]"):
        return ["bot-report"]
    if re.match(r"\s*(\[?suggest\w*\]?|add\w*|proposal|request|include)\b", title, re.I) and \
            not re.search(r"\b(remove|warning|avoid)\b", title, re.I):
        return ["addition"]
    for text in (title, it["body"][:1500]):
        kinds = [k for k, rx in ISSUE_KINDS if re.search(rx, text, re.I)]
        if kinds:
            return kinds
    return []


def fetch():
    if load_json("backlog.json") and "--refresh" not in sys.argv:
        return fetch_diffs(load_json("backlog.json"))
    items, page = [], 1
    while True:
        status, data, _ = gh_api(f"repos/{REPO}/issues", f"state=open&per_page=100&page={page}")
        if status != 200:
            sys.exit(f"issues page {page}: HTTP {status}")
        items += data
        print(f"[fetch] page {page}: {len(data)}", flush=True)
        if len(data) < 100:
            break
        page += 1
    slim = [{
        "number": it["number"], "title": it["title"], "body": it.get("body") or "",
        "user": it["user"]["login"], "created": it["created_at"], "updated": it["updated_at"],
        "comments": it["comments"], "labels": [l["name"] for l in it["labels"]],
        "pr": "pull_request" in it, "draft": it.get("draft", False),
    } for it in items]
    save_json("backlog.json", slim)
    fetch_diffs(slim)


def fetch_diffs(slim):
    os.makedirs(cache_path("diffs"), exist_ok=True)
    prs = [it for it in slim if it["pr"]]

    def get_diff(it):
        path = cache_path(f"diffs/{it['number']}.diff")
        if os.path.exists(path):
            return 0
        for attempt in range(6):
            status, body, _, hdrs = http(f"https://github.com/{REPO}/pull/{it['number']}.diff", timeout=30)
            if status == 200:
                with open(path, "wb") as fh:
                    fh.write(body)
                time.sleep(1)
                return 0
            if status == 429:
                time.sleep(int(hdrs.get("Retry-After") or 0) or 15 * (attempt + 1))
        print(f"[fetch] diff #{it['number']} failed: {status}", flush=True)
        return 1

    with ThreadPoolExecutor(2) as pool:
        failed = sum(pool.map(get_diff, prs))
    print(f"[fetch] {len(slim)} items ({len(prs)} PRs), {failed} diffs failed")


def split_diff(diff):
    """{path: (added_lines, removed_lines, anchors)} from a unified diff.

    anchors[i] is the last unchanged context line before added line i, used to
    place the addition in the current README.
    """
    files, cur, ctx = {}, None, None
    for line in diff.splitlines():
        if line.startswith("diff --git"):
            cur, ctx = line.split(" b/", 1)[-1], None
            files[cur] = ([], [], [])
        elif cur is None or line.startswith(("+++", "---", "@@")):
            continue
        elif line.startswith("+"):
            files[cur][0].append(line[1:])
            files[cur][2].append(ctx)
        elif line.startswith("-"):
            files[cur][1].append(line[1:])
        elif line.startswith(" "):
            ctx = line[1:]
    return files


def entry_lines(lines):
    return [e for e in parse_entries("## x\n" + "\n".join(lines)) if not e.url.startswith("#")]


def section_index(readme):
    """line text -> section path in the current README (first occurrence)."""
    idx, stack = {}, []
    for line in readme.splitlines():
        if line.startswith("##"):
            level = len(line) - len(line.lstrip("#"))
            while stack and stack[-1][0] >= level:
                stack.pop()
            stack.append((level, line.lstrip("#").strip()))
        if line.strip():
            idx.setdefault(line, " > ".join(t for _, t in stack))
    return idx


def applies_cleanly(diff_path):
    """True when the PR's README hunks still apply to the current README."""
    r = subprocess.run(["git", "apply", "--check", "--include=README.md", diff_path],
                       cwd=ROOT, capture_output=True, text=True)
    return r.returncode == 0


def age_days(ts):
    return (NOW - dt.datetime.fromisoformat(ts.replace("Z", "+00:00"))).days


def triage():
    backlog = load_json("backlog.json")
    if not backlog:
        sys.exit("run `backlog.py fetch` first")
    readme = load_readme()
    entries = parse_entries(readme)
    by_url = {norm_url(e.url): e for e in entries}
    by_repo = {tuple(x.lower() for x in e.repo): e for e in entries if e.repo}
    sections = section_index(readme)
    by_name = defaultdict(list)
    for e in entries:
        by_name[e.name.lower()].append(e)

    def match(url):
        e = by_url.get(norm_url(url))
        r = repo_of(url)
        return e or (by_repo.get(tuple(x.lower() for x in r)) if r else None)

    prs, issues = [], []
    added_by = defaultdict(list)  # normalized url -> PR numbers adding it
    for it in backlog:
        base = {k: it[k] for k in ("number", "title", "user", "comments", "labels")}
        base["age"] = age_days(it["created"])
        base["idle"] = age_days(it["updated"])
        if not it["pr"]:
            text = f"{it['title']}\n{it['body']}"
            kinds = classify(it)
            urls = [u for u in links_in(text) + re.findall(r"https?://[^\s)>\]\"']+", text)
                    if "pluja/awesome-privacy" not in u]
            refs = sorted({f"L{m.line} {m.name}" for u in urls if (m := match(u))})
            listed = [r for r in refs if r.split(" ", 1)[1].lower() in it["title"].lower()]
            if "addition" in kinds[:1] and listed:
                kinds = ["resolved"] + kinds
            issues.append({**base, "kinds": kinds, "refs": refs,
                           "urls": sorted(set(urls))[:8]})
            continue

        path = cache_path(f"diffs/{it['number']}.diff")
        if not os.path.exists(path):
            prs.append({**base, "kind": "no-diff"})
            continue
        with open(path, encoding="utf-8", errors="replace") as fh:
            diff = fh.read()
        files = split_diff(diff)
        add_l, rem_l, anchors = files.get("README.md", ([], [], []))
        added = entry_lines(add_l)
        place = {}
        for text, ctx in zip(add_l, anchors):
            place[text] = sections.get(ctx) or next(
                (sections[a] for a in add_l if a.startswith("#") and a in sections), None)
        for e in added:
            raw = next((t for t in add_l if f"]({e.url})" in t), None)
            if e.section == "x":
                e.section = place.get(raw) or "?"
        removed = entry_lines(rem_l)
        removed_urls = {norm_url(e.url) for e in removed}
        new = [e for e in added if norm_url(e.url) not in removed_urls]
        gone = [e for e in removed if norm_url(e.url) not in {norm_url(a.url) for a in added}]
        edited = [e for e in added if norm_url(e.url) in removed_urls]

        flags = []
        other = [f for f in files if f != "README.md"]
        if other:
            flags.append("touches " + ", ".join(other[:3]))
        if not files:
            flags.append("empty diff")
        dupes = []
        for e in new:
            added_by[norm_url(e.url)].append(it["number"])
            hit = match(e.url) or next(iter(by_name.get(e.name.lower(), [])), None)
            if hit:
                dupes.append(f"{e.name} already listed (L{hit.line})")
            r = repo_of(e.url) or (e.repo if e.repo else None)
            if r and r[1].lower() == it["user"].lower():
                flags.append(f"self-promotion? author owns {r[1]}/{r[2]}")
            if not e.desc:
                flags.append(f"{e.name}: no description")
            if not any(repo_of(u) or re.search(r"\b(git|source|src)\b", u, re.I)
                       for u in [e.url] + e.links):
                flags.append(f"{e.name}: no source link")
            if "—" in e.desc:
                flags.append(f"{e.name}: em-dash in description")
        kind = ("add" if new and not gone else "remove" if gone and not new
                else "edit" if edited and not new and not gone else "mixed" if new or gone
                else "other")
        prs.append({
            **base, "kind": kind, "clean": applies_cleanly(path) if "README.md" in files else None,
            "new": [{"name": e.name, "url": e.url, "desc": e.desc, "section": e.section} for e in new],
            "gone": [{"name": e.name, "url": e.url} for e in gone],
            "edited": [e.name for e in edited], "dupes": dupes, "flags": flags,
            "draft": it["draft"],
        })

    for p in prs:
        others = sorted({n for e in p.get("new", []) for n in added_by[norm_url(e["url"])]} - {p["number"]})
        if others:
            p["flags"].append("same entry also added by #" + ", #".join(map(str, others)))

    save_json("triage.json", {"prs": prs, "issues": issues})
    with open(cache_path("triage.md"), "w", encoding="utf-8") as fh:
        fh.write(render(prs, issues))
    print(summary(prs, issues))


def summary(prs, issues):
    from collections import Counter
    c = Counter(p["kind"] for p in prs)
    return (f"PRs {len(prs)}: {dict(c)}; clean {sum(1 for p in prs if p.get('clean'))}, "
            f"conflicting {sum(1 for p in prs if p.get('clean') is False)}, "
            f"with dupes {sum(1 for p in prs if p.get('dupes'))}\n"
            f"Issues {len(issues)}: " + str(Counter(k for i in issues for k in i['kinds'] or ['unclassified'])))


def render(prs, issues):
    L = ["# Backlog triage", "", f"Generated {NOW.date()}. " + summary(prs, issues).replace("\n", " "), ""]
    groups = [
        ("PRs: fully duplicate (every added entry already listed)",
         lambda p: p.get("new") and len(p["dupes"]) >= len(p["new"])),
        ("PRs: removals", lambda p: p["kind"] == "remove"),
        ("PRs: edits to existing entries", lambda p: p["kind"] == "edit"),
        ("PRs: additions, applies cleanly", lambda p: p["kind"] in ("add", "mixed") and p.get("clean")),
        ("PRs: additions, conflicting", lambda p: p["kind"] in ("add", "mixed") and p.get("clean") is False),
        ("PRs: other", lambda p: True),
    ]
    seen = set()
    for title, pred in groups:
        rows = [p for p in prs if p["number"] not in seen and pred(p)]
        seen |= {p["number"] for p in rows}
        L += [f"## {title} ({len(rows)})", ""]
        for p in sorted(rows, key=lambda p: -p["number"]):
            L.append(f"- #{p['number']} {p['title']} (@{p['user']}, {p['age']}d old, "
                     f"{p['comments']} comments{', draft' if p.get('draft') else ''})")
            for e in p.get("new", []):
                L.append(f"  - + [{e['name']}]({e['url']}) in {e['section']}: {e['desc'][:140]}")
            for e in p.get("gone", []):
                L.append(f"  - - {e['name']} {e['url']}")
            for f in p.get("dupes", []) + p.get("flags", []):
                L.append(f"  - ! {f}")
        L.append("")
    for kind in ["bot-report", "resolved", "dead-link", "unmaintained", "removal", "addition", None]:
        rows = [i for i in issues if (i["kinds"][:1] == [kind] if kind else not i["kinds"])]
        L += [f"## Issues: {kind or 'unclassified'} ({len(rows)})", ""]
        for i in sorted(rows, key=lambda i: -i["number"]):
            extra = f" refs {', '.join(i['refs'])}" if i["refs"] else ""
            L.append(f"- #{i['number']} {i['title']} (@{i['user']}, {i['age']}d){extra}")
        L.append("")
    return "\n".join(L)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "triage"
    {"fetch": fetch, "triage": triage}[cmd]()
