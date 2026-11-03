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
  "googletagmanager.com": "Google Tag Manager",
  "google-analytics.com": "Google Analytics",
  "gtag(": "Google Analytics",
  "doubleclick.net": "Google Ads",
  "posthog": "PostHog",
  "mixpanel": "Mixpanel",
  "cdn.segment.com": "Segment",
  "hotjar": "Hotjar",
  "clarity.ms": "Microsoft Clarity",
  "connect.facebook.net": "Facebook Pixel",
  "events.framer.com": "Framer analytics",
  "hs-scripts.com": "HubSpot",
  "intercom": "Intercom",
  "amplitude.com": "Amplitude",
  "polyfill.io": "polyfill.io",
};

// SDKs whose presence in a repo means the app may phone home; a reviewer checks the defaults.
// Quoted where the bare word has other meanings (audio amplitude); code search has no OR.
export const TELEMETRY_SDKS = ["posthog", "sentry", "mixpanel", '"amplitude-js"', '"@amplitude/analytics"', '"com.amplitude"', "firebase-analytics", "crashlytics", "segment-analytics", "scarf", "aptabase"];

export async function gh<T = any>(path: string): Promise<{ status: number; data?: T }> {
  const res = await fetch(`https://api.github.com/${path.replace(/^\//, "")}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "awesome-privacy-checks", ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  });
  return res.ok ? { status: res.status, data: (await res.json()) as T } : { status: res.status };
}

export function githubRepo(e: Pick<Entry, "url" | "repo">): string | undefined {
  const m = (e.repo ?? e.url ?? "").match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, "")}` : undefined;
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

  const adv = await gh<any[]>(`repos/${d.full_name}/security-advisories?per_page=50`);
  const open = (adv.data ?? []).filter((a) => ["critical", "high"].includes(a.severity) && !(a.vulnerabilities ?? []).some((v: any) => v.patched_versions));
  if (open.length) findings.push({ level: "fail", text: `${open.length} unpatched high or critical security advisories` });
  return { facts, findings };
}

export async function checkWebsite(url: string): Promise<Finding[]> {
  if (/^https:\/\/(github\.com|gitlab\.com|codeberg\.org)\//.test(url)) return [];
  try {
    const res = await fetch(url, { headers: { "User-Agent": BROWSER_UA }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return [{ level: "warn", text: `website returned HTTP ${res.status}` }];
    const html = (await res.text()).toLowerCase();
    const found = [...new Set(Object.entries(TRACKERS).filter(([needle]) => html.includes(needle)).map(([, name]) => name))];
    const findings: Finding[] = found.length ? [{ level: "warn", text: `website loads ${found.join(", ")}: needs the \`website-trackers\` caveat` }] : [];
    if (new URL(res.url).host !== new URL(url).host) findings.push({ level: "info", text: `website redirects to ${res.url}` });
    return findings;
  } catch (e) {
    return [{ level: "warn", text: `website not reachable (${(e as Error).name})` }];
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
