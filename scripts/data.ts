// Loads and validates data/. Shared by the README generator, the validator and (later) the website.
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

  const referenced = [...meta.categories.flatMap((c) => c.sections), ...meta.appendix];
  for (const slug of referenced) if (!sections[slug]) problems.push(`meta.yaml: unknown section "${slug}"`);
  for (const slug of Object.keys(sections)) if (!referenced.includes(slug)) problems.push(`${slug}.yaml: not listed in meta.yaml`);
  const dupes = referenced.filter((s, i) => referenced.indexOf(s) !== i);
  for (const slug of new Set(dupes)) problems.push(`meta.yaml: "${slug}" listed more than once`);

  if (problems.length) {
    console.error(problems.join("\n"));
    throw new Error(`${problems.length} data problem(s)`);
  }
  return { meta, sections };
}
