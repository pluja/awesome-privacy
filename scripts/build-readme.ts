// Generates README.md from data/. `--check` exits 1 if README.md is out of date.
import { readFileSync, writeFileSync } from "node:fs";
import { introOf, loadData } from "./data.ts";
import type { AvoidItem, Entry, Meta, Section } from "../schema/schema.ts";
import { CAVEAT_LABEL, CAVEAT_MEANING, PLATFORM_LABEL, PLAY_STORE_TRACKERS, README_TAGS, TAG_LABEL, byName, evidenceLinks, fdroidUrl, headingId, warnings } from "./labels.ts";

const badge = (s: string) => `\`${s}\``;

// Trade-offs stay visible as tags; plain facts (platforms, features, license) go in small text.
function warningBadges(e: Entry): string {
  const out = warnings(e).map((w) => `${w.key === "inactive" ? "💀" : "⚠️"} ${w.label}`);
  return out.length ? " " + out.map(badge).join(" ") : "";
}

function details(e: Entry): string {
  const url = fdroidUrl(e);
  const fdroid = url ? `[F-Droid](${url})${e.caveats?.includes("play-store-trackers") ? ` (${PLAY_STORE_TRACKERS})` : ""}` : "";
  const out = [
    ...(e.platforms ?? []).map((p) => PLATFORM_LABEL[p]),
    ...(e.tags ?? []).filter((t) => README_TAGS.includes(t)).map((t) => TAG_LABEL[t]),
    ...(e.license ? [e.license] : []),
    ...(fdroid ? [fdroid] : []),
  ];
  return out.length ? ` <sub>${out.join(" · ")}</sub>` : "";
}

function renderEntries(list: Entry[], depth = 0): string[] {
  return [...list].sort(byName).flatMap((e) => {
    const name = `**${e.url ? `[${e.name}](${e.url})` : e.name}**`;
    const desc = e.description ? ` - ${e.description}` : "";
    return [`${"  ".repeat(depth)}- ${name}${desc}${warningBadges(e)}${details(e)}`, ...renderEntries(e.children ?? [], depth + 1)];
  });
}

function evidence(a: AvoidItem): string {
  return ` <sub>${evidenceLinks(a).map((l) => `[${l.label}](${l.url})`).join(" · ")}</sub>`;
}

// GitHub dedupes repeated heading anchors with -N.
function anchorFactory() {
  const seen = new Map<string, number>();
  return (title: string) => {
    const base = headingId(title);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
}

function renderSection(s: Section, level: number, meta: Meta, anchor: (t: string) => string, anchors?: Map<Section, string>): string[] {
  const id = anchor(s.title); // always consume the anchor, even when not recording it
  anchors?.set(s, id);
  const out = [`${"#".repeat(Math.min(level, 6))} ${s.title}`, ""];
  const intro = introOf(s, meta);
  if (intro) out.push(intro, "");
  for (const c of s.callouts ?? []) out.push(`> [!${c.type.toUpperCase()}]`, ...c.text.split("\n").map((l) => `> ${l}`.trimEnd()), "");
  if (s.avoid) {
    out.push("🚫 **Avoid**", "");
    if (s.avoid.intro) out.push(s.avoid.intro, "");
    for (const a of s.avoid.items) out.push(`- **${a.name}**: ${a.reason}${evidence(a)}`, ...renderEntries(a.tools ?? [], 1));
    out.push("");
    if (s.recommend?.entries.length || s.subsections?.length) out.push("✅ **Use instead**", "");
  }
  if (s.recommend) {
    if (s.recommend.intro) out.push(s.recommend.intro, "");
    if (s.recommend.entries.length) out.push(...renderEntries(s.recommend.entries), "");
  }
  if (s.notes) out.push(s.notes, "");
  for (const sub of s.subsections ?? []) out.push(...renderSection(sub, level + 1, meta, anchor));
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
    const parts = c.sections.map((slug) => renderSection(sections[slug], 3, meta, anchor, anchors));
    return [`## ${c.name}`, "", ...parts.flatMap((p, i) => (i ? ["---", "", ...p] : p)), "<sub>[↑ Back to contents](#contents)</sub>", ""];
  });
  const appendix = meta.appendix.flatMap((slug) => renderSection(sections[slug], 2, meta, anchor, anchors));
  const toc = meta.categories.map((c) => {
    const links = c.sections.map((slug) => `[${sections[slug].title}](#${anchors.get(sections[slug])})`);
    return [`**${c.name}**<br>`, links.join(" · "), ""];
  }).flat();
  const legend = [
    "## Legend", "",
    "Small text after an entry lists its platforms, features and license, and links its [F-Droid](https://f-droid.org) build for Android apps. \"Play Store version has trackers\" means the Google Play build includes ads or analytics libraries, according to [Exodus Privacy](https://exodus-privacy.eu.org), while the F-Droid build doesn't.", "",
    "Tags point out a trade-off:", "",
    ...Object.entries(CAVEAT_MEANING).map(([key, meaning]) => `- \`${key === "inactive" ? "💀 inactive" : `⚠️ ${CAVEAT_LABEL[key as keyof typeof CAVEAT_LABEL]}`}\`: ${meaning}`),
    "",
    "🚫 **Avoid** lists name mainstream services and the main privacy problem with each. The links lead to the evidence: [ToS;DR](https://tosdr.org) grades privacy policies, [Exodus Privacy](https://exodus-privacy.eu.org) lists the trackers in Android apps, and Source points to a report.",
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
