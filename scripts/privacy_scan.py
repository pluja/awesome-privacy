#!/usr/bin/env python3
"""Android tracker scan for the awesome-privacy list (Exodus Privacy).

Package ids found in F-Droid, Play, or IzzyOnDroid links are looked up in the
Exodus Privacy database, which scans APKs for known trackers. Exodus flags known
trackers only, so a result is a signal for review, not proof either way.

The scan needs an Exodus API key. Without EXODUS_API_TOKEN it is skipped with a
note, so the workflow is safe to run before a key is obtained.

Repository health and open-source verification live in scripts/health_report.py.

Usage:
  python3 scripts/privacy_scan.py [--readme README.md] [--limit N] [--out FILE]

Environment:
  EXODUS_API_TOKEN   enables the scan (request a key from api@exodus-privacy.eu.org)
  EXODUS_API_USER    user-agent handle for Exodus (default: awesome-privacy)

Standard library only.
"""
import argparse
import datetime
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

# Android package ids embedded in store / index links.
HANDLE_RES = [
    re.compile(r"f-droid\.org/(?:[a-z]{2}/)?packages/([A-Za-z0-9._]+)"),
    re.compile(r"play\.google\.com/store/apps/details\?id=([A-Za-z0-9._]+)"),
    re.compile(r"apt\.izzysoft\.de/fdroid/index/apk/([A-Za-z0-9._]+)"),
]

EXODUS = "https://reports.exodus-privacy.eu.org"
# Exodus allows 30 req/s globally; stay far under it and never hammer on errors.
EXODUS_DELAY = 0.3


def get_json(url, headers=None, timeout=25):
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/json")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    if not (headers and "User-Agent" in headers):
        req.add_header("User-Agent", "awesome-privacy-scan")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.load(resp), None
    except urllib.error.HTTPError as exc:
        return None, exc.code
    except Exception:
        return None, "error"


def extract_handles(readme):
    handles = set()
    for rex in HANDLE_RES:
        handles.update(rex.findall(readme))
    return sorted(handles)


def exodus_headers():
    token = os.environ.get("EXODUS_API_TOKEN")
    if not token:
        return None
    user = os.environ.get("EXODUS_API_USER", "awesome-privacy")
    return {"Authorization": f"Token {token}", "User-Agent": f"{user}/1.0"}


def scan_trackers(handles, limit=0):
    """Return (results, checked, status). status: None | no-token | token-rejected | rate-limited."""
    headers = exodus_headers()
    if headers is None:
        return None, 0, "no-token"
    # Tracker dictionary: one call per run (Exodus caps this endpoint at 3/min).
    names, terr = get_json(f"{EXODUS}/api/trackers", headers)
    if terr == 401:
        return [], 0, "token-rejected"
    tdict = (names or {}).get("trackers", {}) if names else {}
    results, checked, status = [], 0, None
    for handle in handles:
        if limit and checked >= limit:
            break
        checked += 1
        data, err = get_json(f"{EXODUS}/api/search/{handle}", headers)
        if err in (429, 503):
            status, checked = "rate-limited", checked - 1
            break
        if err == 401:
            status, checked = "token-rejected", checked - 1
            break
        if err or not data:
            results.append((handle, None, "no report"))
            time.sleep(EXODUS_DELAY)
            continue
        entry = data.get(handle) or next(iter(data.values()), {})
        reports = entry.get("reports") or []
        if not reports:
            results.append((handle, None, "no report"))
            time.sleep(EXODUS_DELAY)
            continue
        latest = max(reports, key=lambda r: r.get("updated_at", ""))
        ids = latest.get("trackers") or []
        tnames = [tdict.get(str(i), {}).get("name", f"#{i}") for i in ids]
        results.append((handle, len(ids), ", ".join(sorted(tnames)) or "none"))
        time.sleep(EXODUS_DELAY)
    return results, checked, status


def build_report(today, handles, trackers, tchecked, tstatus):
    L = [f"# Android tracker scan {today}", "",
         "Known trackers found in each app's APK by Exodus Privacy. A signal for",
         "review, not an automatic verdict.", "", "## Trackers", ""]
    if tstatus == "no-token":
        L.append(f"Skipped: no `EXODUS_API_TOKEN` set. {len(handles)} Android package id(s) "
                 "were found and will be scanned once a key is added "
                 "(request one at api@exodus-privacy.eu.org).")
    elif tstatus == "token-rejected":
        L.append("Skipped: Exodus rejected the API token (401). Check the `EXODUS_API_TOKEN` secret.")
    else:
        withtr = [t for t in (trackers or []) if t[1]]
        L.append(f"{len(withtr)} app(s) with trackers, {tchecked} scanned.")
        L.append("")
        if trackers:
            for handle, n, detail in sorted(trackers, key=lambda t: -(t[1] or 0)):
                L.append(f"- `{handle}` - {n} tracker(s): {detail}" if n
                         else f"- `{handle}` - {detail}")
        else:
            L.append("No Android packages found in the list.")
        if tstatus == "rate-limited":
            L.append("")
            L.append("_Stopped early: Exodus rate limit hit. Remaining apps not scanned this run._")
    L.append("")
    return "\n".join(L) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--readme", default="README.md")
    ap.add_argument("--limit", type=int, default=0, help="cap apps scanned (0 = all)")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    with open(args.readme, encoding="utf-8") as fh:
        readme = fh.read()
    handles = extract_handles(readme)
    print(f"[trackers] {len(handles)} android package id(s)", file=sys.stderr)

    trackers, tchecked, tstatus = scan_trackers(handles, args.limit)
    today = datetime.date.today().isoformat()
    report = build_report(today, handles, trackers, tchecked, tstatus)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(report)
        print(f"[trackers] wrote {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(report)

    has_findings = bool(trackers and any(t[1] for t in trackers))
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a") as fh:
            fh.write(f"has_findings={'true' if has_findings else 'false'}\n")
            fh.write(f"date={today}\n")


if __name__ == "__main__":
    main()
