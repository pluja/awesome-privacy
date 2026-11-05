import * as v from "valibot";

export const PLATFORMS = ["android", "ios", "linux", "macos", "windows", "desktop", "web", "browser", "cli"] as const;
export const TAGS = ["self-host", "e2ee", "p2p", "no-account", "anonymous-account", "no-kyc", "tor", "offline", "activitypub", "audited", "fork"] as const;
export const CAVEATS = ["closed-source", "source-available", "website-trackers", "telemetry-opt-out", "play-store-trackers", "closed-server", "account-required"] as const;

const Url = v.pipe(v.string(), v.url(), v.regex(/^https?:\/\//, "use an http(s) link"));
const Markdown = v.pipe(v.string(), v.trim(), v.nonEmpty());
// Headings and service names end up in page titles, URLs and metadata, so no markup there.
const Label = v.pipe(Markdown, v.regex(/^[^<>]*$/, "no < or > here"), v.regex(/[\p{L}\p{N}]/u, "needs at least one letter or digit"));
const IsoDate = v.pipe(v.string(), v.isoDate());
const Slug = v.pipe(v.string(), v.regex(/^[a-z0-9-]+$/));
const PackageId = v.pipe(v.string(), v.regex(/^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/));
export const MAX_AVOID = 5;
export const MAX_REASON = 110;

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
  package_id: v.optional(PackageId),
  fdroid: v.optional(v.boolean()), // package_id is on F-Droid; kept up to date by the health report
  added: v.optional(IsoDate),
  children: v.optional(v.lazy(() => v.array(EntrySchema))),
});

// Mainstream services people are likely replacing. Each needs a concrete, documented privacy harm.
export const AvoidItemSchema = v.pipe(
  v.strictObject({
    name: Label,
    reason: v.pipe(Markdown, v.maxLength(MAX_REASON, `keep the reason under ${MAX_REASON} characters`), v.regex(/^[^[\]]*$/, "no links in the reason; use tosdr, exodus or source")),
    tosdr: v.optional(v.pipe(v.string(), v.regex(/^en_\d+$/))), // ToS;DR service id
    exodus: v.optional(PackageId), // Android package with an Exodus Privacy report
    source: v.optional(Url), // other evidence for the reason
    site: v.optional(Url), // the service's homepage, where the website finds its logo
    tools: v.optional(v.array(EntrySchema)), // helpers for leaving this service, e.g. export converters
  }),
  v.check((a) => !!(a.tosdr || a.exodus || a.source), "back the reason with tosdr, exodus or source"),
);

export type AvoidItem = v.InferOutput<typeof AvoidItemSchema>;

export const CalloutSchema = v.strictObject({
  type: v.picklist(["note", "tip", "important", "warning", "caution"]),
  text: Markdown,
});

export type Section = {
  title: string;
  slug?: string;
  intro?: string;
  term?: string;
  callouts?: v.InferOutput<typeof CalloutSchema>[];
  avoid?: { intro?: string; items: AvoidItem[] };
  recommend?: { intro?: string; entries: Entry[] };
  notes?: string;
  subsections?: Section[];
};

export const SectionSchema: v.GenericSchema<Section> = v.strictObject({
  title: Label,
  slug: v.optional(Slug),
  intro: v.optional(Markdown),
  term: v.optional(Slug), // key in meta.yaml `terms`; its explanation shows when the section has no intro
  callouts: v.optional(v.array(CalloutSchema)),
  avoid: v.optional(v.strictObject({ intro: v.optional(Markdown), items: v.pipe(v.array(AvoidItemSchema), v.maxLength(MAX_AVOID, `list at most ${MAX_AVOID} services to avoid`)) })),
  recommend: v.optional(v.strictObject({ intro: v.optional(Markdown), entries: v.array(EntrySchema) })),
  notes: v.optional(Markdown), // prose that follows the lists
  subsections: v.optional(v.lazy(() => v.array(SectionSchema))),
});

export const MetaSchema = v.strictObject({
  header: Markdown, // verbatim markdown/HTML above the table of contents
  categories: v.array(v.strictObject({ name: Markdown, sections: v.array(v.string()) })),
  appendix: v.array(v.string()), // section slugs rendered after the categories
  terms: v.optional(v.record(Slug, Markdown)), // plain explanations shared by subsections, e.g. self-hosted
});

export type Meta = v.InferOutput<typeof MetaSchema>;
