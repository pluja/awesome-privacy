// Monthly health report over every entry in data/. Writes Markdown for one issue.
//   node scripts/health-report.ts [--lychee lychee/out.json] [--out health-report.md] [--limit N]
// Env: GITHUB_TOKEN (rate limit), EXODUS_PRIVACY_API_KEY (Android tracker scan).
// Every finding is a signal for review; nothing here edits the data.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { isMap, isPair, isScalar, isSeq, parseDocument, visit } from "yaml";
import { loadData } from "./data.ts";
import type { Entry, Section } from "../schema/schema.ts";
import { checkWebsite, exodusClient, gh, githubRepo } from "./checks.ts";

const arg = (name: string) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const OUT = arg("--out") ?? "health-report.md";
const LIMIT = Number(arg("--limit") ?? 0); // for local test runs
const FIX = process.argv.includes("--fix"); // apply the safe fixes to data/ for a pull request
const STALE_DAYS = 540; // a gap in commits isn't death; ~18 months is worth a look
const REVIVED_DAYS = 180;
const today = new Date().toISOString().slice(0, 10);
const days = (iso?: string) => (iso ? Math.floor((Date.now() - Date.parse(iso)) / 86_400_000) : undefined);
const norm = (u = "") => u.toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/[#?].*$/, "").replace(/\/+$/, "");

const ignore = existsSync(".lycheeignore")
  ? readFileSync(".lycheeignore", "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => new RegExp(l))
  : [];
const ignored = (url = "") => ignore.some((re) => re.test(url));

type Located = { entry: Entry; file: string; where: string };
const { sections } = loadData();
const all: Located[] = [];
for (const [slug, root] of Object.entries(sections)) {
  const walk = (list: Entry[] = [], where: string) => list.forEach((e) => { all.push({ entry: e, file: `data/sections/${slug}.yaml`, where }); walk(e.children, where); });
  const sec = (s: Section, path: string[]) => {
    const here = [...path, s.title].join(" › ");
    walk(s.recommend?.entries, here);
    (s.avoid?.items ?? []).forEach((a) => walk(a.tools, here));
    (s.subsections ?? []).forEach((x) => sec(x, [...path, s.title]));
  };
  sec(root, []);
}
const entries = LIMIT ? all.slice(0, LIMIT) : all;

type Finding = { group: string; at: Located; text: string };
const findings: Finding[] = [];
const add = (group: string, at: Located, text: string) => findings.push({ group, at, text });

// Safe, mechanical fixes. Everything else stays a finding for a human to decide.
type Fix = { at: Located; text: string; apply: (node: any) => void };
const fixes: Fix[] = [];
const fix = (at: Located, text: string, apply: Fix["apply"]) => fixes.push({ at, text, apply });

// --- repositories (one API call per repo keeps this inside GITHUB_TOKEN's hourly budget) ---
async function repoInfo(e: Entry) {
  const gh_ = githubRepo(e);
  if (gh_) {
    const r = await gh(`repos/${gh_}`);
    if (!r.data) return { gone: r.status === 404, status: r.status };
    return { name: r.data.full_name, moved: r.data.full_name.toLowerCase() !== gh_.toLowerCase(), archived: r.data.archived, pushed: r.data.pushed_at, license: r.data.license?.spdx_id };
  }
  const cb = (e.repo ?? "").match(/^https:\/\/codeberg\.org\/([^/]+\/[^/#?]+)/);
  if (cb) {
    const res = await fetch(`https://codeberg.org/api/v1/repos/${cb[1]}`);
    if (!res.ok) return { gone: res.status === 404, status: res.status };
    const d = await res.json();
    return { archived: d.archived, pushed: d.updated_at };
  }
  const gl = (e.repo ?? "").match(/^https:\/\/gitlab\.com\/([^#?]+?)\/?$/);
  if (gl && !gl[1].includes("/")) return undefined; // a group page (a whole OS project), not one repository
  if (gl) {
    const res = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(gl[1])}`);
    if (!res.ok) return { gone: res.status === 404, status: res.status };
    const d = await res.json();
    return { archived: d.archived, pushed: d.last_activity_at };
  }
  return undefined;
}

const seenRepos = new Set<string>();
for (const at of entries) {
  const { entry: e } = at;
  if (!e.repo && !githubRepo(e)) continue;
  const key = norm(e.repo ?? e.url);
  if (seenRepos.has(key) || ignored(e.repo ?? e.url)) continue;
  seenRepos.add(key);
  const info = await repoInfo(e);
  if (!info) continue;
  if ("status" in info) { if (info.gone) add("Repository gone", at, `${e.repo ?? e.url} returns 404`); continue; }
  const idle = days(info.pushed);
  if (info.archived) add("Archived", at, "archived by its owner");
  else if (e.status === "inactive" && idle !== undefined && idle < REVIVED_DAYS) fix(at, `removed \`status: inactive\`: last push ${idle} days ago`, (n) => n.delete("status"));
  else if (e.status !== "inactive" && idle !== undefined && idle > STALE_DAYS) add("Stale", at, `no push in ${idle} days. Quiet isn't dead: check it still works`);
  if (info.moved) {
    const from = `https://github.com/${githubRepo(e)}`, to = `https://github.com/${info.name}`;
    fix(at, `repository moved to ${to}`, (n) => {
      for (const k of ["repo", "url"]) if (String(n.get(k) ?? "").toLowerCase().startsWith(from.toLowerCase())) n.set(k, to + String(n.get(k)).slice(from.length));
    });
  }
  if (info.license && e.license && info.license !== "NOASSERTION" && info.license !== e.license) fix(at, `license changed from ${e.license} to ${info.license}`, (n) => n.set("license", info.license));
}

// --- websites: keep the `website-trackers` caveat in step with what sites actually load ---
const sites = [...new Map(entries.filter(({ entry: e }) => e.url && !ignored(e.url)).map((at) => [norm(at.entry.url), at])).values()];
for (let i = 0; i < sites.length; i += 8) {
  await Promise.all(sites.slice(i, i + 8).map(async (at) => {
    const result = await checkWebsite(at.entry.url!);
    const loads = result.find((f) => f.text.startsWith("website loads"));
    const marked = at.entry.caveats?.includes("website-trackers");
    // The same site can be listed in several sections; mark every copy.
    if (loads) for (const x of all.filter((y) => norm(y.entry.url) === norm(at.entry.url) && !y.entry.caveats?.includes("website-trackers"))) {
      fix(x, `added the \`website-trackers\` caveat: ${loads.text.replace(/: needs.*$/, "")}`, (n) => {
        const list = n.get("caveats");
        if (isSeq(list)) list.add("website-trackers"); else n.set("caveats", ["website-trackers"]);
      });
    }
    // Absence proves little (trackers injected by JavaScript aren't in the HTML), so this is only a hint.
    if (!loads && marked && !result.some((f) => f.text.startsWith("website not reachable") || f.text.startsWith("website returned"))) {
      add("Website trackers: check by hand", at, "no tracker script in the homepage HTML; it may be loaded by JavaScript, so check in a browser before removing the badge");
    }
  }));
}

// --- dead links, from the lychee run in the workflow ---
const lycheePath = arg("--lychee");
let deadChecked = false;
if (lycheePath && existsSync(lycheePath)) {
  deadChecked = true;
  const data = JSON.parse(readFileSync(lycheePath, "utf8"));
  const byUrl = new Map(all.flatMap((at) => [at.entry.url, at.entry.repo].filter(Boolean).map((u) => [norm(u), at] as const)));
  const seen = new Set<string>();
  for (const items of Object.values<any[]>(data.error_map ?? data.fail_map ?? {})) {
    for (const item of items) {
      if (!item.url || seen.has(item.url) || ignored(item.url)) continue;
      seen.add(item.url);
      const reason = String(item.status?.text ?? item.status?.details ?? "error").replace(/^Rejected status code: |\s*\(configurable with .*\)$/g, "");
      const at = byUrl.get(norm(item.url));
      if (at) add("Dead links", at, `${item.url}: ${reason}`);
      else add("Dead links", { entry: { name: item.url }, file: "data/", where: "in a description, intro or note" }, reason);
    }
  }
}

// --- Android apps: known trackers via Exodus Privacy ---
const exodusKey = process.env.EXODUS_PRIVACY_API_KEY;
let exodusNote = "";
const crashReporters: string[] = [];
if (!exodusKey) exodusNote = "Skipped: `EXODUS_PRIVACY_API_KEY` is not set.";
else {
  const lookup = exodusClient(exodusKey);
  const apps = entries.filter(({ entry: e }) => e.package_id);
  let scanned = 0;
  for (const at of apps) {
    const r = await lookup(at.entry.package_id!);
    if ("error" in r) {
      if (r.error === "rejected") { exodusNote = "Stopped: Exodus rejected the API key."; break; }
      if (r.error === "rate-limited") { exodusNote = `Stopped after ${scanned} apps: rate limited by Exodus.`; break; }
      if (r.error === "no-report") add("Android: no Exodus report", at, `\`${at.entry.package_id}\` has never been scanned`);
      continue;
    }
    scanned++;
    // Crash reporters that send to the developer's own endpoint, usually only when the user agrees.
    const benign = r.trackers.filter((t) => /^(ACRA|Sentry|OpenTelemetry|Bugsnag)\b/i.test(t));
    const bad = r.trackers.filter((t) => !benign.includes(t));
    if (bad.length) add("Android: trackers found", at, `\`${at.entry.package_id}\`: ${bad.join(", ")}${benign.length ? ` (also ${benign.join(", ")})` : ""}`);
    else if (benign.length) crashReporters.push(`${at.entry.name} (${benign.join(", ")})`);
  }
  exodusNote ||= `${scanned} of ${apps.length} Android apps scanned.`;
}

// --- apply fixes (each entry is found by file, name and website) ---
if (FIX && fixes.length) {
  const byFile = Map.groupBy(fixes, (f) => f.at.file);
  for (const [file, list] of byFile) {
    const doc = parseDocument(readFileSync(file, "utf8"));
    visit(doc, {
      Map(_, node, ancestors) {
        const pair = ancestors[ancestors.length - 2];
        if (!isSeq(ancestors[ancestors.length - 1]) || !isPair(pair) || !isScalar(pair.key) || !["entries", "children", "tools"].includes(String(pair.key.value))) return;
        for (const f of list) if (isMap(node) && node.get("name") === f.at.entry.name && node.get("url") === f.at.entry.url) f.apply(node);
      },
    });
    writeFileSync(file, doc.toString({ lineWidth: 0 }));
  }
  loadData(); // the fixed data must still validate
}

// --- report: what was fixed, then a checklist of what needs a decision ---
const ORDER = ["Repository gone", "Archived", "Dead links", "Android: trackers found", "Stale", "Website trackers: check by hand", "Android: no Exodus report"];
const HELP: Record<string, string> = {
  "Repository gone": "Remove the entry, or point it to where the project lives now.",
  "Archived": "Remove it if a maintained alternative exists; otherwise keep it as `status: inactive`.",
  "Dead links": "A temporary outage, a new address, or a dead project?",
  "Android: trackers found": "Ads and analytics SDKs, or crash reporting that goes to Google. Exodus scans the Play Store build; an F-Droid build may be clean.",
  "Stale": "Quiet isn't dead. Check that it still works before marking it inactive.",
  "Website trackers: check by hand": "Open the site with the browser's network tab before removing the badge.",
};
const L = [`# Health report ${today}`, "", `Monthly check of ${entries.length} entries. Dead links: ${deadChecked ? "checked with lychee" : "not checked in this run"}. Android trackers: ${exodusNote}`, ""];
if (fixes.length) {
  L.push(`## ${FIX ? "Applied automatically" : "Safe fixes"} (${fixes.length})`, "", FIX ? "These are already in this pull request's diff." : "Run with `--fix` to apply these.", "");
  for (const f of fixes) L.push(`- **${f.at.entry.name}** (\`${f.at.file}\`): ${f.text}`);
  L.push("");
}
const groups = ORDER.map((g) => [g, findings.filter((f) => f.group === g)] as const).filter(([, list]) => list.length);
if (groups.length) L.push("## Needs your decision", "");
for (const [g, list] of groups) {
  L.push(`### ${g} (${list.length})`, "", ...(HELP[g] ? [HELP[g], ""] : []));
  for (const f of list) L.push(`- [ ] **${f.at.entry.name}** (${f.at.where}, \`${f.at.file}\`): ${f.text}`);
  L.push("");
}
if (crashReporters.length) L.push("## For information", "", `Developer-controlled crash reporters, usually opt-in: ${crashReporters.join(", ")}.`, "");
if (!fixes.length && !groups.length) L.push("Nothing to report this month.");
writeFileSync(OUT, L.join("\n"));
console.log(`${fixes.length} fixes, ${findings.length} findings over ${entries.length} entries -> ${OUT}`);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `has_fixes=${FIX && fixes.length > 0}\nhas_findings=${findings.length > 0}\ndate=${today}\n`);
