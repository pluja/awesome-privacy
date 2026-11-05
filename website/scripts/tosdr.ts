// Fetches the ToS;DR grade and worst privacy points of each avoided service into src/data/tosdr.json.
// Services are re-checked after REFRESH_DAYS; the API rate-limits, so requests go one at a time with
// retries, and a failed one keeps what was there before. Run from website/.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadData } from "../../scripts/data.ts";
import type { Section } from "../../schema/schema.ts";

const OUT = "src/data/tosdr.json";
const REFRESH_DAYS = 30;
const MAX_POINTS = 6;
const DELAY_MS = 4000;
const RETRIES = [30_000, 60_000, 120_000];
const UA = "awesome-privacy-tosdr (+https://awesomeprivacy.org)";

type Review = { service: string; grade: string | null; points: string[]; checked: string };
type Point = { status?: string; case?: { title?: string; classification?: string; weight?: number; topic_id?: number } | null };

// ToS;DR topics about privacy, by id: trackers, anonymity, law and government requests, logs, personal
// data, third parties, types of information collected, advertising. The rest (censorship, copyright,
// dispute resolution...) are about the terms in general.
const PRIVACY_TOPICS = new Set([25, 26, 28, 40, 41, 48, 56, 57]);

const reviews: { [id: string]: Review } = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);
const isDue = (r?: Review) => !r || (Date.parse(today) - Date.parse(r.checked)) / 86_400_000 >= REFRESH_DAYS;
const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

// Blockers first, then bad points; within each, the ones ToS;DR weighs most.
const RANK: { [k: string]: number } = { blocker: 0, bad: 1 };

async function getService(id: string) {
  for (const wait of [0, ...RETRIES]) {
    await sleep(wait);
    const res = await fetch(`https://api.tosdr.org/service/v3/?id=${id.replace(/^en_/, "")}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    }).catch(() => undefined);
    const body = res ? await res.json().catch(() => undefined) : undefined;
    if (typeof body?.name === "string" && Array.isArray(body.points)) return body;
    if (!/too much/i.test(body?.error_msg ?? "") && res?.status !== 429) return;
  }
}

async function fetchReview(id: string): Promise<Review | undefined> {
  const body = await getService(id);
  if (!body) return;
  const worst = (body.points as Point[])
    .filter((p) => p.status === "approved" && p.case?.title && p.case.classification! in RANK && PRIVACY_TOPICS.has(p.case.topic_id!))
    .sort((a, b) => RANK[a.case!.classification!] - RANK[b.case!.classification!] || (b.case!.weight ?? 0) - (a.case!.weight ?? 0));
  const points = [...new Set(worst.map((p) => p.case!.title!.trim()))].slice(0, MAX_POINTS);
  const grade = typeof body.rating === "string" && /^[A-E]$/.test(body.rating) ? body.rating : null;
  return { service: body.name, grade, points, checked: today };
}

const { sections } = loadData(resolve(process.cwd(), "../data"));
const ids = new Set<string>();
const walk = (s: Section) => { s.avoid?.items.forEach((a) => a.tosdr && ids.add(a.tosdr)); s.subsections?.forEach(walk); };
Object.values(sections).forEach(walk);

let fetched = 0, failed = 0;
for (const id of [...ids].sort()) {
  if (!isDue(reviews[id])) continue;
  const review = await fetchReview(id);
  if (review) { reviews[id] = review; fetched++; } else failed++;
  await sleep(DELAY_MS);
}
for (const id of Object.keys(reviews)) if (!ids.has(id)) delete reviews[id];

writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(reviews).sort(([a], [b]) => a.localeCompare(b))), null, 1) + "\n");
console.log(`tosdr: ${fetched} updated, ${failed} failed, ${ids.size} services`);
