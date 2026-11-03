// Sets `added` to today on entries that don't have one yet, keeping the rest of each file as written.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { isMap, isPair, isScalar, isSeq, parseDocument, visit } from "yaml";

const today = new Date().toISOString().slice(0, 10);
const ENTRY_LISTS = new Set(["entries", "children", "tools"]);
const stamped: string[] = [];

for (const file of readdirSync("data/sections").filter((f) => f.endsWith(".yaml"))) {
  const path = `data/sections/${file}`;
  const doc = parseDocument(readFileSync(path, "utf8"));
  let changed = false;
  visit(doc, {
    Map(_, node, ancestors) {
      const seq = ancestors[ancestors.length - 1];
      const pair = ancestors[ancestors.length - 2];
      const inEntryList = isSeq(seq) && isPair(pair) && isScalar(pair.key) && ENTRY_LISTS.has(String(pair.key.value));
      if (!inEntryList || !isMap(node) || node.has("added")) return;
      node.set("added", today);
      stamped.push(`${file}: ${node.get("name")}`);
      changed = true;
    },
  });
  if (changed) writeFileSync(path, doc.toString({ lineWidth: 0 }));
}
console.log(stamped.length ? `stamped ${today} on:\n  ${stamped.join("\n  ")}` : "no new entries to stamp");
