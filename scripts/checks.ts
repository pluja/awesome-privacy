// Facts about a listed project, shared by the PR report and the monthly health report.
// Every check returns findings; nothing here decides on its own whether an entry gets in.
import type { Entry } from "../schema/schema.ts";

export type Level = "fail" | "warn" | "info";
export type Finding = { level: Level; text: string };

const TOKEN = process.env.GITHUB_TOKEN ?? "";
const BROWSER_UA = "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0";
const DAY = 86_400_000;
const daysSince = (iso: string) => Math.floor((Date.now() - Date.parse(iso)) / DAY);

export const MIN_AGE_DAYS = 183;
export const MAX_IDLE_DAYS = 365;
export const MIN_STARS = 100;

// Third-party trackers that earn the `website-trackers` caveat. Cookieless analytics
// (the Analytics section, Fathom, Simple Analytics, Cloudflare Web Analytics) are not listed on purpose.
export const TRACKERS: Record<string, string> = {
  // Script hosts and init calls only; plain mentions (e.g. "vs Mixpanel" on a comparison page) don't count.
  "googletagmanager.com/": "Google Tag Manager",
  "google-analytics.com/": "Google Analytics",
  "gtag('config'": "Google Analytics",
  'gtag("config"': "Google Analytics",
  "doubleclick.net/": "Google Ads",
  "posthog.init(": "PostHog",
  "i.posthog.com": "PostHog",
  "cdn.mxpnl.com": "Mixpanel",
  "mixpanel.init(": "Mixpanel",
  "cdn.segment.com": "Segment",
  "static.hotjar.com": "Hotjar",
  "clarity.ms/tag": "Microsoft Clarity",
  "connect.facebook.net": "Facebook Pixel",
  "events.framer.com": "Framer analytics",
  "hs-scripts.com": "HubSpot",
  "hs-analytics.net": "HubSpot",
  "googlesyndication.com": "Google AdSense",
  "cdn.optimizely.com": "Optimizely",
  "munchkin.marketo.net": "Marketo",
  "cdn.bizible.com": "Bizible",
  "snap.licdn.com": "LinkedIn Insight",
  "static.ads-twitter.com": "X (Twitter) Ads",
  "cdn.heapanalytics.com": "Heap",
  "js.hsforms.net": "HubSpot",
  "widget.intercom.io": "Intercom",
  "cdn.amplitude.com": "Amplitude",
  "polyfill.io/": "polyfill.io",
};

// Tracker IDs set in a page's config object, for sites that load the script later from JavaScript.
const TRACKER_IDS: [RegExp, string][] = [
  [/["']gtm-[a-z0-9]{6,8}["']/, "Google Tag Manager"],
  [/["']phc_[a-z0-9]{30,}["']/, "PostHog"],
];

// SDKs whose presence in a repo means the app may phone home; a reviewer checks the defaults.
// Quoted where the bare word has other meanings (audio amplitude); code search has no OR.
export const TELEMETRY_SDKS = ["posthog", "sentry", "mixpanel", '"amplitude-js"', '"@amplitude/analytics"', '"com.amplitude"', "firebase-analytics", "crashlytics", "segment-analytics", "scarf", "aptabase"];

export async function gh<T = any>(path: string): Promise<{ status: number; data?: T; link?: string }> {
  const res = await fetch(`https://api.github.com/${path.replace(/^\//, "")}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "awesome-privacy-checks", ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  });
  return res.ok ? { status: res.status, data: (await res.json()) as T, link: res.headers.get("link") ?? undefined } : { status: res.status };
}

const iso = (ms: number) => new Date(ms).toISOString();
const commitDate = (c: any): string | undefined => c?.commit?.committer?.date;

// With one commit per page, the last page holds the oldest commit.
async function oldestCommit(repo: string, since: string, until: string): Promise<string | undefined> {
  const q = `repos/${repo}/commits?per_page=1&since=${since}&until=${until}`;
  const first = await gh<any[]>(q);
  const last = first.link?.match(/[?&]page=(\d+)>; rel="last"/)?.[1];
  return commitDate((last ? await gh<any[]>(`${q}&page=${last}`) : first).data?.[0]);
}

// A repository created years ago whose commits only resumed this year: the creation date overstates its age.
async function resumedAfterPause(repo: string): Promise<{ since: string; before: string } | undefined> {
  const since = await oldestCommit(repo, iso(Date.now() - 365 * DAY), iso(Date.now()));
  if (!since) return;
  const prev = await gh<any[]>(`repos/${repo}/commits?per_page=1&until=${iso(Date.parse(since) - 1000)}`);
  const before = commitDate(prev.data?.[0]);
  if (before && Date.parse(since) - Date.parse(before) > 365 * DAY) return { since, before };
}

export function githubRepo(e: Pick<Entry, "url" | "repo">): string | undefined {
  const m = (e.repo ?? e.url ?? "").match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, "")}` : undefined;
}

// Issues and pull requests opened by people outside the project: a sign that others use it and care.
// Reads the 300 most recent, which is enough to tell "none yet" from "plenty".
const INSIDERS = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
const isBot = (u: any) => u?.type === "Bot" || /\[bot\]$|^dependabot|^renovate|^github-actions/i.test(u?.login ?? "");
async function community(repo: string): Promise<Finding> {
  const items: any[] = [];
  for (let page = 1; page <= 3; page++) {
    const r = await gh<any[]>(`repos/${repo}/issues?state=all&per_page=100&page=${page}`);
    items.push(...(r.data ?? []));
    if ((r.data?.length ?? 0) < 100) break;
  }
  const outside = items.filter((i) => !INSIDERS.has(i.author_association) && !isBot(i.user));
  const prs = outside.filter((i) => i.pull_request);
  const merged = prs.filter((i) => i.pull_request.merged_at).length;
  const people = new Set(outside.map((i) => i.user.login)).size;
  const more = items.length >= 300 ? "+" : "";
  if (!people) return { level: "warn", text: "no issues or pull requests from people outside the project yet" };
  const n = (count: number, word: string) => `${count}${more} ${word}${count === 1 && !more ? "" : "s"}`;
  return { level: "info", text: `outside the project: ${n(people, "person").replace(/persons$/, "people")}, ${n(outside.length - prs.length, "issue")}, ${n(prs.length, "pull request")} (${merged} merged)` };
}

export type RepoFacts = { fullName: string; stars: number; ageDays: number; idleDays: number; license?: string; release?: string; ownerLogin: string };

export async function checkRepo(repo: string): Promise<{ facts?: RepoFacts; findings: Finding[] }> {
  const findings: Finding[] = [];
  const r = await gh(`repos/${repo}`);
  if (!r.data) return { findings: [{ level: "fail", text: `repository ${repo} not reachable (HTTP ${r.status})` }] };
  const d = r.data;
  const facts: RepoFacts = { fullName: d.full_name, stars: d.stargazers_count, ageDays: daysSince(d.created_at), idleDays: daysSince(d.pushed_at), ownerLogin: d.owner.login };
  if (d.full_name.toLowerCase() !== repo.toLowerCase()) findings.push({ level: "warn", text: `repository moved to ${d.full_name}` });
  if (d.archived) findings.push({ level: "fail", text: "repository is archived" });
  if (facts.ageDays < MIN_AGE_DAYS) findings.push({ level: "fail", text: `only ${facts.ageDays} days old (minimum is 6 months)` });
  if (facts.idleDays > MAX_IDLE_DAYS) findings.push({ level: "fail", text: `no push in ${facts.idleDays} days` });
  if (facts.ageDays >= MIN_AGE_DAYS && facts.idleDays <= MAX_IDLE_DAYS) {
    const pause = await resumedAfterPause(d.full_name);
    if (pause) findings.push({ level: "warn", text: `created ${d.created_at.slice(0, 4)}, but the current commits only start on ${pause.since.slice(0, 10)}, after a pause since ${pause.before.slice(0, 10)}. Judge age from the restart unless there's a reason (moved from another host, code opened later)` });
  }
  if (facts.stars < MIN_STARS) findings.push({ level: "warn", text: `${facts.stars} stars` });
  const spdx = d.license?.spdx_id;
  if (!spdx) findings.push({ level: "warn", text: "no license detected; check for a LICENSE file" });
  else if (spdx === "NOASSERTION") findings.push({ level: "warn", text: "license not recognised; read it to decide on `source-available`" });
  else facts.license = spdx;

  const rel = await gh(`repos/${d.full_name}/releases/latest`);
  if (rel.data) {
    facts.release = `${rel.data.tag_name} (${String(rel.data.published_at).slice(0, 10)})`;
    if (/(alpha|beta|rc\d*|preview)/i.test(rel.data.tag_name)) findings.push({ level: "warn", text: `latest release looks like a pre-release: ${rel.data.tag_name}` });
  } else {
    const tags = await gh<any[]>(`repos/${d.full_name}/tags?per_page=1`);
    if (tags.data?.length) facts.release = `tag ${tags.data[0].name}`;
    else findings.push({ level: "warn", text: "no release or tag on GitHub (fine for sites and directories, not for an app)" });
  }

  findings.push(await community(d.full_name));

  const adv = await gh<any[]>(`repos/${d.full_name}/security-advisories?per_page=50`);
  const open = (adv.data ?? []).filter((a) => ["critical", "high"].includes(a.severity) && !(a.vulnerabilities ?? []).some((v: any) => v.patched_versions));
  if (open.length) findings.push({ level: "fail", text: `${open.length} unpatched high or critical security advisories` });
  return { facts, findings };
}

const siteOf = (host: string) => host.split(".").slice(-2).join(".");
const MAX_BUNDLES = 8;
const MAX_BUNDLE_CHARS = 3_000_000;

// Many sites load their trackers from their own JavaScript bundles, so those are read too.
async function ownBundles(html: string, page: string): Promise<string> {
  const site = siteOf(new URL(page).host);
  const srcs = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)]
    .map((m) => { try { return new URL(m[1], page); } catch { return undefined; } })
    .filter((u): u is URL => !!u && siteOf(u.host) === site)
    .slice(0, MAX_BUNDLES);
  const texts = await Promise.all(srcs.map(async (u) => {
    try {
      const r = await fetch(u, { headers: { "User-Agent": BROWSER_UA }, signal: AbortSignal.timeout(15_000) });
      return r.ok ? (await r.text()).slice(0, MAX_BUNDLE_CHARS) : "";
    } catch { return ""; }
  }));
  return texts.join("\n");
}

export async function checkWebsite(url: string, marked = false): Promise<Finding[]> {
  if (/^https:\/\/(github\.com|gitlab\.com|codeberg\.org)\//.test(url)) return [];
  try {
    const res = await fetch(url, { headers: { "User-Agent": BROWSER_UA }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return [{ level: "warn", text: `website returned HTTP ${res.status}` }];
    const html = await res.text();
    // What actually loads: script tags, <noscript> fallbacks (Tag Manager's iframe) and script preloads.
    // Prefetch and preconnect hints, and plain mentions in the page text, don't count.
    const preloads = (html.match(/<link\b[^>]*>/gi) ?? []).filter((t) => /rel=["']?modulepreload/i.test(t) || (/rel=["']?preload/i.test(t) && /as=["']?script/i.test(t)));
    const inline = [...(html.match(/<(script|noscript)\b[\s\S]*?<\/\1>/gi) ?? []), ...preloads].join("\n");
    const code = (inline + "\n" + (await ownBundles(html, res.url))).toLowerCase();
    const found = [...new Set([
      ...Object.entries(TRACKERS).filter(([needle]) => code.includes(needle)).map(([, name]) => name),
      ...TRACKER_IDS.filter(([id]) => id.test(code)).map(([, name]) => name),
    ])];
    const findings: Finding[] = !found.length ? []
      : marked ? [{ level: "info", text: `website loads ${found.join(", ")} (already marked \`website-trackers\`)` }]
      : [{ level: "warn", text: `website loads ${found.join(", ")}: needs the \`website-trackers\` caveat` }];
    if (new URL(res.url).host !== new URL(url).host) findings.push({ level: "info", text: `website redirects to ${res.url}` });
    return findings;
  } catch (e) {
    return [{ level: "warn", text: `website not reachable (${(e as Error).name})` }];
  }
}

// A soft signal only: a fresh domain often goes with self-promotion, but projects buy domains at any time.
// RDAP covers most generic TLDs; many country TLDs have no public RDAP, and those are skipped.
export async function checkDomain(url: string): Promise<Finding[]> {
  const host = new URL(url).hostname;
  if (/(^|\.)(github\.com|gitlab\.com|codeberg\.org|github\.io)$/.test(host)) return [];
  const labels = host.split(".");
  const domain = labels.slice(/^(co|com|org|net|ac|gov|edu)$/.test(labels.at(-2) ?? "") && labels.at(-1)!.length === 2 ? -3 : -2).join(".");
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, { headers: { Accept: "application/rdap+json", "User-Agent": "awesome-privacy-checks" }, signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return [];
    const registered = ((await res.json()).events ?? []).find((e: any) => e.eventAction === "registration")?.eventDate;
    const days = registered ? daysSince(registered) : undefined;
    return days !== undefined && days < 365 ? [{ level: "info", text: `${domain} was registered ${Math.round(days / 30)} months ago (${registered.slice(0, 10)})` }] : [];
  } catch {
    return [];
  }
}

// Code search is rate limited, so this runs once per added repo and only reports hits.
export async function checkTelemetry(repo: string): Promise<Finding[]> {
  if (!TOKEN) return [];
  const hits: string[] = [];
  for (const sdk of TELEMETRY_SDKS) {
    const r = await gh(`search/code?q=${encodeURIComponent(`${sdk} repo:${repo}`)}&per_page=1`);
    if (!r.data) return [{ level: "info", text: `telemetry scan unavailable (code search returned HTTP ${r.status}); check the code by hand` }];
    if (r.data.total_count) hits.push(`${sdk.replaceAll('"', "")} (${r.data.total_count} files)`);
    await new Promise((ok) => setTimeout(ok, 6500)); // stay under 10 code searches per minute
  }
  return hits.length ? [{ level: "warn", text: `telemetry SDKs in the code: ${hits.join(", ")}. Check whether they're on by default and whether a setting turns them off` }] : [];
}

// Exodus Privacy: known trackers in the latest scanned APK of an Android app.
// Needs EXODUS_PRIVACY_API_KEY; stay well under their rate limits.
const EXODUS = "https://reports.exodus-privacy.eu.org";
export type ExodusResult = { trackers: string[] } | { error: "no-report" | "rejected" | "rate-limited" | "failed" };

export function exodusClient(key: string) {
  const headers = { Authorization: `Token ${key}`, Accept: "application/json", "User-Agent": "awesome-privacy/1.0" };
  let names: Record<string, string> | undefined;
  const get = async (path: string) => {
    const res = await fetch(`${EXODUS}${path}`, { headers, signal: AbortSignal.timeout(25_000) });
    return { status: res.status, data: res.ok ? await res.json() : undefined };
  };
  return async function trackers(packageId: string): Promise<ExodusResult> {
    try {
      if (!names) {
        const t = await get("/api/trackers");
        if (t.status === 401 || t.status === 403) return { error: "rejected" };
        names = Object.fromEntries(Object.entries<any>(t.data?.trackers ?? {}).map(([id, v]) => [id, v.name]));
      }
      await new Promise((ok) => setTimeout(ok, 400));
      const r = await get(`/api/search/${encodeURIComponent(packageId)}`);
      if (r.status === 401 || r.status === 403) return { error: "rejected" };
      if (r.status === 429 || r.status === 503) return { error: "rate-limited" };
      const app = r.data?.[packageId] ?? Object.values<any>(r.data ?? {})[0];
      const reports: any[] = app?.reports ?? [];
      if (!reports.length) return { error: "no-report" };
      const latest = reports.reduce((a, b) => (String(b.updated_at) > String(a.updated_at) ? b : a));
      return { trackers: (latest.trackers ?? []).map((id: number) => names?.[String(id)] ?? `#${id}`).sort() };
    } catch {
      return { error: "failed" };
    }
  };
}
