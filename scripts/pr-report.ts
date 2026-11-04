// Checks a pull request and writes a Markdown report for the PR comment.
//   node scripts/pr-report.ts --base <sha> [--out report.md]
// Env: GITHUB_TOKEN, PR_AUTHOR, PR_BODY. Exits 1 only for problems that must be fixed before review
// (invalid data, hand-edited README); findings about entries are advice for the reviewer.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { parse } from "yaml";
import { loadData, type Data } from "./data.ts";
import type { Entry, Section } from "../schema/schema.ts";
import { checkRepo, checkTelemetry, checkWebsite, gh, githubRepo, type Finding } from "./checks.ts";

const arg = (name: string) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const base = arg("--base");
const out = arg("--out") ?? "pr-report.md";
if (!base) throw new Error("--base <sha> is required");

const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" });
const norm = (u = "") => u.toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/[#?].*$/, "").replace(/\/+$/, "").replace(/\.git$/, "");

function entriesOf(sections: Record<string, Section>) {
  const all: { entry: Entry; where: string }[] = [];
  const walk = (list: Entry[] = [], where: string) => list.forEach((e) => { all.push({ entry: e, where }); walk(e.children, where); });
  const sec = (s: Section, path: string[]) => {
    const here = [...path, s.title];
    walk(s.recommend?.entries, here.join(" › "));
    (s.avoid?.items ?? []).forEach((a) => walk(a.tools, here.join(" › ")));
    (s.subsections ?? []).forEach((x) => sec(x, here));
  };
  Object.values(sections).forEach((s) => sec(s, []));
  return all;
}

function sectionsAt(ref: string): Record<string, Section> {
  let files: string[] = [];
  try { files = git("ls-tree", "--name-only", ref, "data/sections/").trim().split("\n").filter(Boolean); } catch { return {}; }
  return Object.fromEntries(files.map((f) => [f, parse(git("show", `${ref}:${f}`), { schema: "core" })]));
}

const blocking: string[] = [];
let head: Data | undefined;
try { head = loadData(); } catch (e) { blocking.push(`The data doesn't validate: ${(e as Error).message}. Run \`npm run validate\` for details.`); }

const baseSections = sectionsAt(base);
const bootstrap = !Object.keys(baseSections).length; // the pull request that introduces data/ itself
const changed = git("diff", "--name-only", `${base}...HEAD`).trim().split("\n").filter(Boolean);
if (!bootstrap && changed.includes("README.md")) blocking.push("`README.md` is generated from `data/`. Please revert your changes to it and edit the YAML files instead.");

// Entries are matched by website or repo; the few without either (e.g. "Cash") by name.
const keys = (e: Entry) => [norm(e.url), norm(e.repo)].filter(Boolean).concat(e.url || e.repo ? [] : [`name:${e.name.toLowerCase()}`]);
const known = new Set(entriesOf(baseSections).flatMap(({ entry }) => keys(entry)));
const headEntries = head ? entriesOf(head.sections) : [];
const added = bootstrap ? [] : headEntries.filter(({ entry }) => !keys(entry).some((k) => known.has(k)));

// Signals about the submitter, which matter most for self-promotion and spam.
const author = process.env.PR_AUTHOR ?? "";
const body = (process.env.PR_BODY ?? "").toLowerCase();
const discloses = /\b(i(?:'m| am) (?:the|a) (?:author|maintainer|developer|creator|founder)|my (?:own )?(?:project|app|tool)|i (?:built|made|created|develop|maintain)|affiliat|disclos)/.test(body);
const submitter: Finding[] = [];
if (author) {
  const user = await gh(`users/${author}`);
  const age = user.data ? Math.floor((Date.now() - Date.parse(user.data.created_at)) / 86_400_000) : undefined;
  if (age !== undefined && age < 30) submitter.push({ level: "warn", text: `the GitHub account is ${age} days old` });
  const since = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
  const prs = await gh(`search/issues?q=${encodeURIComponent(`type:pr author:${author} created:>=${since}`)}&per_page=100`);
  const lists = new Set((prs.data?.items ?? []).map((i: any) => i.repository_url.split("/").slice(-2).join("/")).filter((r: string) => /\/awesome-/i.test(r) && !/pluja\/awesome-privacy/i.test(r)));
  if (lists.size >= 3) submitter.push({ level: "warn", text: `opened pull requests to ${lists.size} other awesome lists in the last two days` });
}

const icon = { fail: "❌", warn: "⚠️", info: "ℹ️" } as const;
const lines = ["<!-- awesome-privacy-pr-report -->", "## Automated checks", ""];
if (blocking.length) lines.push("**Please fix before review:**", "", ...blocking.map((b) => `- ${b}`), "");

const DEEP_CHECK_LIMIT = 15; // keeps one PR from tying up CI for hours
if (bootstrap) lines.push("The base branch has no `data/` yet, so only the data was validated.");
else if (!added.length) lines.push("No new entries in this pull request.");
if (added.length > DEEP_CHECK_LIMIT) lines.push(`⚠️ This pull request adds ${added.length} entries; only the first ${DEEP_CHECK_LIMIT} were checked. Please send one project per pull request.`, "");
for (const { entry, where } of added.slice(0, DEEP_CHECK_LIMIT)) {
  const findings: Finding[] = [];
  const repo = githubRepo(entry);
  const dupes = headEntries.filter((x) => x.entry !== entry && (norm(x.entry.url) === norm(entry.url) || (entry.repo && norm(x.entry.repo) === norm(entry.repo))));
  if (dupes.length) findings.push({ level: "warn", text: `also listed under ${dupes.map((d) => d.where).join(", ")}` });
  if (!entry.repo) findings.push({ level: "warn", text: "no `repo`: apps need public source code (services can qualify on their record)" });
  let facts = "";
  if (repo) {
    const r = await checkRepo(repo);
    findings.push(...r.findings);
    if (r.facts) {
      facts = [`${r.facts.stars}★`, `${Math.round(r.facts.ageDays / 30)} months old`, `last push ${r.facts.idleDays} days ago`, r.facts.release ?? "", r.facts.license ?? ""].filter(Boolean).join(" · ");
      if (author && r.facts.ownerLogin.toLowerCase() === author.toLowerCase()) {
        findings.push(discloses ? { level: "info", text: "submitted by the project's owner (disclosed)" } : { level: "warn", text: "submitted by the project's owner without saying so" });
      }
      if (r.facts.license && entry.license && r.facts.license !== entry.license) findings.push({ level: "warn", text: `\`license: ${entry.license}\` doesn't match GitHub's ${r.facts.license}` });
    }
    findings.push(...(await checkTelemetry(repo)));
  }
  if (entry.url) findings.push(...(await checkWebsite(entry.url, entry.caveats?.includes("website-trackers"))));
  lines.push(`### ${entry.name}`, "", `${where}${facts ? ` · ${facts}` : ""}`, "");
  lines.push(...(findings.length ? findings.map((f) => `- ${icon[f.level]} ${f.text}`) : ["- ✅ no issues found"]), "");
}
if (submitter.length) lines.push("### Submitter", "", ...submitter.map((f) => `- ${icon[f.level]} ${f.text}`), "");
lines.push("---", "These checks are signals for the reviewer, not a verdict. See [what makes a good entry](https://github.com/pluja/awesome-privacy/blob/main/misc/Contributing.md#what-makes-a-good-entry).");

writeFileSync(out, lines.join("\n") + "\n");
console.log(lines.join("\n"));
process.exit(blocking.length ? 1 : 0);
