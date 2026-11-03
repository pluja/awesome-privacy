// Generates README.md from data/. `--check` exits 1 if README.md is out of date.
import { readFileSync, writeFileSync } from "node:fs";
import { loadData } from "./data.ts";
import type { Entry, Section } from "../schema/schema.ts";

const PLATFORM_LABEL: Record<string, string> = {
  android: "Android", ios: "iOS", linux: "Linux", macos: "macOS", windows: "Windows",
  desktop: "Desktop", web: "Web", browser: "Browser", cli: "CLI",
};
const TAG_LABEL: Record<string, string> = { "self-host": "self-host", activitypub: "ActivityPub", fork: "fork" };
const CAVEAT_LABEL: Record<string, string> = {
  "closed-source": "closed source",
  "source-available": "source-available", "website-trackers": "website trackers",
  "telemetry-opt-out": "telemetry opt-out", "closed-server": "closed server", "account-required": "account required",
};

const badge = (s: string) => `\`${s}\``;

function badges(e: Entry): string {
  const out = [
    ...(e.platforms ?? []).map((p) => PLATFORM_LABEL[p]),
    ...(e.tags ?? []).filter((t) => TAG_LABEL[t]).map((t) => TAG_LABEL[t]),
    ...(e.license ? [e.license] : []),
    ...(e.caveats ?? []).map((c) => `⚠️ ${CAVEAT_LABEL[c]}`),
    ...(e.status === "inactive" ? ["💀 inactive"] : []),
  ];
  return out.length ? " " + out.map(badge).join(" ") : "";
}

const byName = (a: Entry, b: Entry) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

function renderEntries(list: Entry[], depth = 0): string[] {
  return [...list].sort(byName).flatMap((e) => {
    const name = e.url ? `[${e.name}](${e.url})` : e.name;
    const desc = e.description ? ` - ${e.description}` : "";
    return [`${"  ".repeat(depth)}- ${name}${desc}${badges(e)}`, ...renderEntries(e.children ?? [], depth + 1)];
  });
}

function tosdrLink(id: string) {
  return `[ToS;DR](https://tosdr.org/en/service/${id.replace(/^en_/, "")})`;
}

// GitHub heading anchors: lowercase, drop punctuation and emoji, spaces to hyphens, dedupe with -N.
function anchorFactory() {
  const seen = new Map<string, number>();
  return (title: string) => {
    const base = title.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/ /g, "-");
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
}

function renderSection(s: Section, level: number, anchor: (t: string) => string, anchors?: Map<Section, string>): string[] {
  const id = anchor(s.title); // always consume the anchor, even when not recording it
  anchors?.set(s, id);
  const out = [`${"#".repeat(Math.min(level, 6))} ${s.title}`, ""];
  if (s.intro) out.push(s.intro, "");
  for (const c of s.callouts ?? []) out.push(`> [!${c.type.toUpperCase()}]`, ...c.text.split("\n").map((l) => `> ${l}`.trimEnd()), "");
  if (s.avoid) {
    out.push("**Avoid**", "");
    if (s.avoid.intro) out.push(s.avoid.intro, "");
    for (const a of s.avoid.items) {
      const name = a.url ? `[${a.name}](${a.url})` : a.name;
      const extra = [a.reason, a.tosdr ? tosdrLink(a.tosdr) : ""].filter(Boolean).join(" ");
      out.push(`- **${name}**${extra ? `: ${extra}` : ""}`, ...renderEntries(a.tools ?? [], 1));
    }
    out.push("");
  }
  if (s.recommend) {
    if (s.avoid) out.push("**Use instead**", "");
    if (s.recommend.intro) out.push(s.recommend.intro, "");
    if (s.recommend.entries.length) out.push(...renderEntries(s.recommend.entries), "");
  }
  if (s.notes) out.push(s.notes, "");
  for (const sub of s.subsections ?? []) out.push(...renderSection(sub, level + 1, anchor));
  return out;
}

export function buildReadme(): string {
  const { meta, sections } = loadData();
  // Anchors follow document order, as GitHub numbers duplicate headings that way.
  const anchor = anchorFactory();
  ["Contents"].forEach(anchor);
  const anchors = new Map<Section, string>();
  const body = meta.categories.flatMap((c) => {
    anchor(c.name);
    return [`## ${c.name}`, "", ...c.sections.flatMap((slug) => renderSection(sections[slug], 3, anchor, anchors))];
  });
  const appendix = meta.appendix.flatMap((slug) => renderSection(sections[slug], 2, anchor, anchors));
  const toc = meta.categories.map((c) => {
    const links = c.sections.map((slug) => `[${sections[slug].title}](#${anchors.get(sections[slug])})`);
    return `- **${c.name}**: ${links.join(" · ")}`;
  });
  const legend = [
    "## Legend", "",
    "Badges after an entry show its platforms, license and features. Some point out a trade-off:", "",
    "- `💀 inactive`: development has stalled. It still works and has no maintained alternative, so check before relying on it.",
    "- `⚠️ closed source`: the code isn't public. Listed only because of a long, trusted record.",
    "- `⚠️ source-available`: the code is public, but the license isn't an open source one.",
    "- `⚠️ website trackers`: the project's website loads third-party trackers. That says nothing about the app itself.",
    "- `⚠️ telemetry opt-out`: the app sends usage data by default, but a setting turns it off.",
    "- `⚠️ closed server` and `⚠️ account required`: the server code isn't public, or an account is needed to use it.",
    "",
  ];
  return [meta.header, "", "## Contents", "", ...toc, "", ...body, ...appendix, ...legend].join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

const readme = buildReadme();
if (process.argv.includes("--check")) {
  if (readFileSync("README.md", "utf8") !== readme) {
    console.error("README.md is out of date: run `npm run build`.");
    process.exit(1);
  }
  console.log("README.md is up to date.");
} else {
  writeFileSync("README.md", readme);
  console.log(`wrote README.md (${readme.split("\n").length} lines)`);
}
