import * as v from "valibot";

export const PLATFORMS = ["android", "ios", "linux", "macos", "windows", "desktop", "web", "browser", "cli"] as const;
export const TAGS = ["self-host", "e2ee", "p2p", "no-account", "no-kyc", "tor", "offline", "activitypub", "audited", "fork"] as const;
export const CAVEATS = ["closed-source", "source-available", "website-trackers", "telemetry-opt-out", "play-store-trackers", "closed-server", "account-required"] as const;

const Url = v.pipe(v.string(), v.url());
const Markdown = v.pipe(v.string(), v.trim(), v.nonEmpty());
const IsoDate = v.pipe(v.string(), v.isoDate());

export type Entry = {
  name: string;
  url?: string;
  repo?: string;
  description?: string;
  platforms?: (typeof PLATFORMS)[number][];
  license?: string;
  tags?: (typeof TAGS)[number][];
  caveats?: (typeof CAVEATS)[number][];
  status?: "inactive";
  tosdr?: string;
  package_id?: string;
  fdroid?: boolean;
  added?: string;
  children?: Entry[];
};

export const EntrySchema: v.GenericSchema<Entry> = v.strictObject({
  name: Markdown,
  url: v.optional(Url), // website; equal to repo when the project has no separate site
  repo: v.optional(Url),
  description: v.optional(Markdown),
  platforms: v.optional(v.array(v.picklist(PLATFORMS))),
  license: v.optional(v.string()), // SPDX id
  tags: v.optional(v.array(v.picklist(TAGS))),
  caveats: v.optional(v.array(v.picklist(CAVEATS))),
  status: v.optional(v.literal("inactive")),
  tosdr: v.optional(v.string()),
  package_id: v.optional(v.pipe(v.string(), v.regex(/^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/))),
  fdroid: v.optional(v.boolean()), // package_id is on F-Droid; kept up to date by the health report
  added: v.optional(IsoDate),
  children: v.optional(v.lazy(() => v.array(EntrySchema))),
});

export const AvoidItemSchema = v.strictObject({
  name: Markdown,
  url: v.optional(Url),
  reason: v.optional(Markdown),
  tosdr: v.optional(v.string()),
  tools: v.optional(v.array(EntrySchema)), // helpers for leaving this service, e.g. export converters
});

export const CalloutSchema = v.strictObject({
  type: v.picklist(["note", "tip", "important", "warning", "caution"]),
  text: Markdown,
});

export type Section = {
  title: string;
  slug?: string;
  intro?: string;
  callouts?: v.InferOutput<typeof CalloutSchema>[];
  avoid?: { intro?: string; items: v.InferOutput<typeof AvoidItemSchema>[] };
  recommend?: { intro?: string; entries: Entry[] };
  notes?: string;
  subsections?: Section[];
};

export const SectionSchema: v.GenericSchema<Section> = v.strictObject({
  title: Markdown,
  slug: v.optional(v.pipe(v.string(), v.regex(/^[a-z0-9-]+$/))),
  intro: v.optional(Markdown),
  callouts: v.optional(v.array(CalloutSchema)),
  avoid: v.optional(v.strictObject({ intro: v.optional(Markdown), items: v.array(AvoidItemSchema) })),
  recommend: v.optional(v.strictObject({ intro: v.optional(Markdown), entries: v.array(EntrySchema) })),
  notes: v.optional(Markdown), // prose that follows the lists
  subsections: v.optional(v.lazy(() => v.array(SectionSchema))),
});

export const MetaSchema = v.strictObject({
  header: Markdown, // verbatim markdown/HTML above the table of contents
  categories: v.array(v.strictObject({ name: Markdown, sections: v.array(v.string()) })),
  appendix: v.array(v.string()), // section slugs rendered after the categories
});

export type Meta = v.InferOutput<typeof MetaSchema>;
