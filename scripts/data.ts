// Loads and validates data/: the schema, the cross-references between files, and the rules no schema can express.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import * as v from "valibot";
import { MetaSchema, SectionSchema, type Meta, type Section } from "../schema/schema.ts";

export type Data = { meta: Meta; sections: Record<string, Section> };

const read = (path: string) => parse(readFileSync(path, "utf8"), { schema: "core" });

export function loadData(dir = "data"): Data {
  const problems: string[] = [];
  const check = <T>(schema: v.GenericSchema<T>, value: unknown, where: string): T => {
    const res = v.safeParse(schema, value);
    if (!res.success) for (const i of res.issues) problems.push(`${where}: ${v.getDotPath(i) ?? "(root)"}: ${i.message}`);
    return res.output as T;
  };

  const meta = check(MetaSchema, read(`${dir}/meta.yaml`), "meta.yaml");
  const sections: Record<string, Section> = {};
  for (const file of readdirSync(`${dir}/sections`).filter((f) => f.endsWith(".yaml")).sort()) {
    const slug = file.replace(/\.yaml$/, "");
    const s = check(SectionSchema, read(`${dir}/sections/${file}`), file);
    if (s && s.slug !== slug) problems.push(`${file}: slug "${s.slug}" does not match the file name`);
    sections[slug] = s;
  }
  // Cross-checks assume valid shapes, so report schema problems on their own first.
  const fail = () => {
    console.error(problems.join("\n"));
    throw new Error(`${problems.length} data problem(s)`);
  };
  if (problems.length) fail();

  const referenced = [...meta.categories.flatMap((c) => c.sections), ...meta.appendix];
  for (const slug of referenced) if (!sections[slug]) problems.push(`meta.yaml: unknown section "${slug}"`);
  for (const slug of Object.keys(sections)) if (!referenced.includes(slug)) problems.push(`${slug}.yaml: not listed in meta.yaml`);
  // A heading needs something under it; a shared term only explains what is there.
  const hasContent = (s: Section) => !!(s.recommend?.entries.length || s.avoid || s.intro || s.notes || s.callouts?.length || s.subsections?.length);
  const checkSection = (s: Section, file: string) => {
    if (s.term && !meta.terms?.[s.term]) problems.push(`${file}: "${s.title}" uses term "${s.term}", which meta.yaml doesn't define`);
    if (s.term && s.intro) problems.push(`${file}: "${s.title}" has both an intro and a term; the intro would hide the term, so keep one`);
    if (!hasContent(s)) problems.push(`${file}: "${s.title}" has nothing under it; add entries or remove it`);
    // Children are the parts or apps of one project; a child of a child is usually a sibling indented too far.
    for (const e of [...(s.recommend?.entries ?? []), ...(s.avoid?.items.flatMap((a) => a.tools ?? []) ?? [])]) {
      for (const c of e.children ?? []) {
        if (c.children?.length) problems.push(`${file}: "${c.name}" under "${e.name}" has children of its own; list them next to it instead`);
      }
    }
    s.subsections?.forEach((sub) => checkSection(sub, file));
  };
  for (const [slug, s] of Object.entries(sections)) checkSection(s, `${slug}.yaml`);
  // Page titles are in title case; subsection titles are sentence case and stay free.
  const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "with"]);
  for (const [slug, s] of Object.entries(sections)) {
    const lower = s.title.split(/\s+/).filter((w, i) => /^[a-z]/.test(w) && (i === 0 || !SMALL_WORDS.has(w)));
    if (lower.length) problems.push(`${slug}.yaml: capitalize ${lower.map((w) => `"${w}"`).join(", ")} in the title "${s.title}"`);
  }

  const dupes = referenced.filter((s, i) => referenced.indexOf(s) !== i);
  for (const slug of new Set(dupes)) problems.push(`meta.yaml: "${slug}" listed more than once`);

  if (problems.length) fail();
  return { meta, sections };
}

// A section's intro, or the shared explanation of its term.
export const introOf = (s: Section, meta: Meta) => s.intro ?? (s.term ? meta.terms?.[s.term] : undefined);
