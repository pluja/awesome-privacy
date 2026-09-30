"""Shared helpers for the local maintenance scripts: README parsing, HTTP, cache."""
import json
import os
import re
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.path.join(ROOT, ".maint")
README = os.path.join(ROOT, "README.md")
UA = "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0"

ENTRY_RE = re.compile(r"^(\s*)[-*]\s+\[([^\]]+)\]\((\S+?)\)(.*)$")
ICON_PREFIX_RE = re.compile(r"^(\s*)[-*]\s+(?:\[[^\]]{1,4}\]\(#icons\)\s*)+")
LINK_RE = re.compile(r"\]\((https?://(?:[^()\s]|\([^()\s]*\))+)\)|<a\s+href=\"(https?://[^\"]+)\"|src=\"(https?://[^\"]+)\"")
REPO_RE = re.compile(
    r"https?://(?:www\.)?(github\.com|codeberg\.org|gitlab\.com)/"
    r"([A-Za-z0-9._-]+)/([A-Za-z0-9._-]+)"
)
RESERVED = {
    "sponsors", "orgs", "topics", "about", "features", "marketplace", "settings",
    "explore", "collections", "apps", "notifications", "login", "join", "pricing",
    "security", "site", "contact", "readme", "search", "new", "watching", "stars",
    "users", "groups", "explore", "help",
}
SELF = {"pluja/awesome-privacy"}


@dataclass
class Entry:
    line: int
    section: str
    name: str
    url: str
    desc: str
    skull: bool
    depth: int
    avoid: bool = False
    links: list = field(default_factory=list)

    @property
    def repo(self):
        for link in [self.url] + self.links:
            r = repo_of(link)
            if r:
                return r
        return None


def repo_of(url):
    """(host, owner, repo) for a forge URL, or None."""
    m = REPO_RE.match(url)
    if not m:
        return None
    host, owner, repo = m.groups()
    repo = repo[:-4] if repo.endswith(".git") else repo.rstrip(".")
    if owner.lower() in RESERVED or not repo or f"{owner}/{repo}".lower() in SELF:
        return None
    return host, owner, repo


def norm_url(url):
    """Comparable form of a URL, for duplicate detection."""
    u = url.strip().lower().split("#")[0].split("?")[0]
    u = re.sub(r"^https?://(www\.)?", "", u)
    return u.rstrip("/").removesuffix(".git")


def links_in(text):
    return [a or b or c for a, b, c in LINK_RE.findall(text)]


def parse_entries(text):
    """Every list entry of the form `- [Name](url) - description`."""
    entries, stack, avoid = [], [], False
    for i, line in enumerate(text.splitlines(), 1):
        if "⛔" in line and "Avoid" in line:
            avoid = True
        elif "✅" in line:
            avoid = False
        if line.startswith("#"):
            avoid = False
            level = len(line) - len(line.lstrip("#"))
            while stack and stack[-1][0] >= level:
                stack.pop()
            if level > 1:
                stack.append((level, line.lstrip("#").strip()))
            continue
        section = [t for _, t in stack]
        m = ENTRY_RE.match(ICON_PREFIX_RE.sub(r"\1- ", line))
        if not m or not section or section[0] == "Contents" or m.group(2).startswith("!"):
            continue
        indent, name, url, rest = m.groups()
        desc = re.sub(r"^\s*(\[💀\]\(#icons\)\s*)?[-–:]?\s*", "", rest).strip()
        entries.append(Entry(
            line=i, section=" > ".join(section), name=name.strip(), url=url,
            desc=desc, skull="💀" in rest, depth=len(indent.expandtabs(4)) // 2,
            links=links_in(rest), avoid=avoid,
        ))
    return entries


def load_readme(path=README):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def http(url, headers=None, timeout=20, method="GET", data=None):
    """(status, body_bytes, final_url, headers). status is an int or an error string."""
    req = urllib.request.Request(url, method=method, data=data)
    req.add_header("User-Agent", UA)
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read() if method != "HEAD" else b""
            return resp.status, body, resp.geturl(), dict(resp.headers)
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read() if method != "HEAD" else b"", url, dict(exc.headers or {})
    except urllib.error.URLError as exc:
        return f"url-error: {exc.reason}", b"", url, {}
    except Exception as exc:
        return f"error: {type(exc).__name__}: {exc}", b"", url, {}


def token():
    return os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")


def gh_api(path, params=""):
    """GitHub REST call, waiting out the rate limit instead of failing."""
    url = path if path.startswith("http") else f"https://api.github.com/{path.lstrip('/')}"
    if params:
        url += ("&" if "?" in url else "?") + params
    headers = {"Accept": "application/vnd.github+json"}
    if token():
        headers["Authorization"] = f"Bearer {token()}"
    while True:
        status, body, _, hdrs = http(url, headers)
        if status in (403, 429) and hdrs.get("X-RateLimit-Remaining") == "0":
            wait = int(hdrs.get("X-RateLimit-Reset", time.time() + 60)) - time.time() + 2
            print(f"[gh] rate limited, sleeping {int(wait)}s", flush=True)
            time.sleep(max(wait, 5))
            continue
        return status, (json.loads(body) if body and status == 200 else None), hdrs


def cache_path(name):
    os.makedirs(CACHE, exist_ok=True)
    return os.path.join(CACHE, name)


def save_json(name, obj):
    with open(cache_path(name), "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=1, ensure_ascii=False)


def load_json(name, default=None):
    try:
        with open(cache_path(name), encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        return default
