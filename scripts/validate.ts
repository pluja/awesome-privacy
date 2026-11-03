import { loadData } from "./data.ts";

const { meta, sections } = loadData();
console.log(`✓ data valid: ${Object.keys(sections).length} sections in ${meta.categories.length} categories`);
