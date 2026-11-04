// Fetches the icon of each entry and avoided service into public/logos/<id>.webp, 64px square, and records where it came from
// in src/data/logos.json. New entries are fetched on the next run, entries without a logo are retried
// after RETRY_DAYS, found ones re-checked after REFRESH_DAYS, and a file only changes when its image
// does. Run from website/.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp, { type Sharp } from "sharp";
import { loadData } from "../../scripts/data.ts";
import type { Entry, Section } from "../../schema/schema.ts";
import { brandOf } from "../src/lib/brand.ts";
import { avoidLogoId, logoId } from "../src/lib/logo-id.ts";

const SIZE = 64;
const MIN_SOURCE = 32;
const REFRESH_DAYS = 30;
const RETRY_DAYS = 7;
const MAX_BYTES = 2_000_000;
const CONCURRENCY = 8;
const OUT = "public/logos";
const MANIFEST = "src/data/logos.json";
const UA = "awesome-privacy-logos (+https://awesomeprivacy.org)";
const DARK_TILE = { r: 26, g: 26, b: 30, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const CODE_HOSTS = new Set(["github.com", "gitlab.com", "codeberg.org", "sr.ht", "git.sr.ht", "bitbucket.org", "framagit.org"]);
// A site that borrows its code host's favicon, or redirects to its repository, would get the host's logo.
const FOREIGN_ICON_HOSTS = new Set([...CODE_HOSTS, "github.githubassets.com", "assets.gitlab-static.net"]);
const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const urlFrom = (href: string, base: string) => {
  try {
    return new URL(href, base).href;
  } catch {
    return undefined;
  }
};
// Ids become file names; anything else (say, a hand-edited manifest key) never reaches the disk.
const SAFE_ID = /^[\p{L}\p{N}_-]+$/u;

type Record = { source: string | null; checked: string; hash?: string };
const manifest: { [id: string]: Record } = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);
const daysSince = (date: string) => (Date.parse(today) - Date.parse(date)) / 86_400_000;
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : undefined;

async function get(url: string, accept: string): Promise<Response | undefined> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: accept }, signal: AbortSignal.timeout(15_000), redirect: "follow" });
    if (!res.ok || Number(res.headers.get("content-length") ?? 0) > MAX_BYTES) return;
    return res;
  } catch {
    return;
  }
}

// Reads at most MAX_BYTES of the decoded body: content-length can be missing, or be the compressed size.
async function read(res: Response): Promise<Buffer | undefined> {
  if (!res.body) return;
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for await (const chunk of res.body) {
      size += chunk.length;
      if (size > MAX_BYTES) {
        await res.body.cancel().catch(() => {});
        return;
      }
      chunks.push(chunk);
    }
  } catch {
    return;
  }
  return Buffer.concat(chunks);
}

async function bytes(url: string) {
  const res = await get(url, "image/*,*/*;q=0.5");
  return res && read(res);
}

// sharp can't read .ico. Take its largest icon: a PNG as is, or an uncompressed bitmap, stored
// bottom-up with its height doubled for a 1-bit transparency mask that follows the pixels.
function fromIco(buf: Buffer): Sharp | undefined {
  const count = buf.length >= 6 ? buf.readUInt16LE(4) : 0;
  if (buf.length < 6 + count * 16) return;
  let best: Buffer | undefined;
  let bestSize = 0;
  for (let i = 0; i < count; i++) {
    const at = 6 + i * 16;
    const size = buf[at] || 256;
    const offset = buf.readUInt32LE(at + 12);
    const data = buf.subarray(offset, offset + buf.readUInt32LE(at + 8));
    if (size > bestSize && data.length >= 40) [best, bestSize] = [data, size];
  }
  if (!best) return;
  if (best.subarray(0, 4).toString("hex") === "89504e47") return sharp(best, { limitInputPixels: 4096 * 4096 });
  return fromBitmap(best);
}

function fromBitmap(bmp: Buffer): Sharp | undefined {
  const [header, width, height, bits] = [bmp.readUInt32LE(0), bmp.readInt32LE(4), bmp.readInt32LE(8) / 2, bmp.readUInt16LE(14)];
  if (![4, 8, 24, 32].includes(bits) || width !== height || width <= 0 || width > 256 || bmp.readUInt32LE(16) !== 0) return;
  const colors = bits <= 8 ? bmp.readUInt32LE(32) || 1 << bits : 0;
  const pixels = header + colors * 4;
  const row = Math.ceil((width * bits) / 32) * 4;
  const mask = pixels + row * height;
  const maskRow = Math.ceil(width / 32) * 4;
  if (bmp.length < (bits === 32 ? mask : mask + maskRow * height)) return;
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const line = pixels + (height - 1 - y) * row;
    for (let x = 0; x < width; x++) {
      let at: number;
      if (bits === 32 || bits === 24) at = line + x * (bits / 8);
      else {
        const index = bits === 8 ? bmp[line + x] : (bmp[line + (x >> 1)] >> (x & 1 ? 0 : 4)) & 15;
        at = header + index * 4;
      }
      const hidden = bits !== 32 && (bmp[mask + (height - 1 - y) * maskRow + (x >> 3)] >> (7 - (x & 7))) & 1;
      const to = (y * width + x) * 4;
      [rgba[to], rgba[to + 1], rgba[to + 2]] = [bmp[at + 2], bmp[at + 1], bmp[at]];
      rgba[to + 3] = bits === 32 ? bmp[at + 3] : hidden ? 0 : 255;
    }
  }
  return sharp(rgba, { raw: { width, height, channels: 4 } });
}

// A light logo on a transparent background vanishes on the white tile, so it gets a dark one.
async function isLightOnTransparent(image: Sharp) {
  const { data, info } = await image.clone().resize(32, 32, { fit: "contain", background: CLEAR }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let seen = 0, light = 0, clear = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 32) { clear++; continue; }
    seen++;
    if (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2] > 215) light++;
  }
  return clear > data.length / info.channels / 5 && seen > 0 && light / seen > 0.8;
}

async function render(buf: Buffer): Promise<Buffer | undefined> {
  const isIco = buf.length >= 4 && buf.readUInt16LE(0) === 0 && buf.readUInt16LE(2) === 1;
  try {
    const img = isIco ? fromIco(buf) : sharp(buf, { density: 384, limitInputPixels: 4096 * 4096 });
    if (!img) return;
    const { width = 0, height = 0, format } = await img.metadata();
    if (format !== "svg" && Math.min(width, height) < MIN_SOURCE) return;
    const tile = (await isLightOnTransparent(img)) ? DARK_TILE : CLEAR;
    const out = img.resize(SIZE, SIZE, { fit: "contain", background: tile });
    if (tile === DARK_TILE) out.flatten({ background: DARK_TILE });
    return await out.webp({ quality: 85, alphaQuality: 90, effort: 6 }).toBuffer();
  } catch {
    return;
  }
}

type Candidate = { url: string; score: number };

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(2).find((v) => v !== undefined);
const largest = (sizes = "") => Math.max(0, ...sizes.split(/\s+/).map((s) => Number(s.split("x")[0]) || 0));

async function candidates(page: string): Promise<Candidate[]> {
  const res = await get(page, "text/html");
  if (!res || !(res.headers.get("content-type") ?? "").includes("html")) return [];
  const base = res.url;
  const body = await read(res);
  if (!body) return [];
  const html = body.toString("utf8");
  const head = html.slice(0, html.search(/<\/head>/i) + 1 || html.length);
  const found: Candidate[] = [];
  for (const tag of head.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase();
    const href = attr(tag, "href");
    if (!href) continue;
    const url = urlFrom(href, base);
    if (!url) continue;
    if (rel.split(/\s+/).includes("manifest")) {
      const m = await get(url, "application/manifest+json,application/json");
      const body = m && (await read(m));
      let icons: { src?: string; sizes?: string; purpose?: string; type?: string }[] = [];
      try {
        icons = body ? (JSON.parse(body.toString("utf8"))?.icons ?? []) : [];
      } catch {}
      for (const i of Array.isArray(icons) ? icons : []) {
        const src = typeof i?.src === "string" ? urlFrom(i.src, m!.url) : undefined;
        const [purpose, type, sizes] = [String(i?.purpose ?? ""), String(i?.type ?? ""), String(i?.sizes ?? "")];
        if (!src || purpose.includes("monochrome")) continue;
        found.push({ url: src, score: type.includes("svg") ? 1000 : largest(sizes) - (purpose.includes("maskable") ? 1 : 0) });
      }
    } else if (rel.includes("apple-touch-icon")) {
      found.push({ url, score: largest(attr(tag, "sizes")) || 180 });
    } else if (rel.split(/\s+/).includes("icon")) {
      const svg = (attr(tag, "type") ?? "").includes("svg") || /\.svg(\?|$)/i.test(url);
      found.push({ url, score: svg ? 1000 : largest(attr(tag, "sizes")) || 32 });
    }
  }
  found.push({ url: new URL("/apple-touch-icon.png", base).href, score: 180 });
  found.push({ url: new URL("/favicon.ico", base).href, score: 16 });
  return found.sort((a, b) => b.score - a.score);
}

// Code hosts show their own favicon, so a project hosted there gets its organization's avatar.
// A personal account's avatar is a person, not a logo, so those get none.
async function orgAvatar(repo: string): Promise<string | undefined> {
  const u = new URL(repo);
  const owner = u.pathname.split("/")[1];
  if (!owner) return;
  if (u.hostname === "github.com") {
    const headers: { [k: string]: string } = { "User-Agent": UA, Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/users/${owner}`, { headers, signal: AbortSignal.timeout(15_000) }).catch(() => undefined);
    const user = res?.ok ? await res.json() : undefined;
    return user?.type === "Organization" ? `${user.avatar_url}&s=128` : undefined;
  }
  if (u.hostname === "codeberg.org") {
    const res = await get(`https://codeberg.org/api/v1/orgs/${owner}`, "application/json");
    const org = res ? await res.json().catch(() => undefined) : undefined;
    return org?.avatar_url;
  }
}

const isCodeHost = (url: string) => CODE_HOSTS.has(hostOf(url));

type Target = { url?: string; repo?: string; service?: boolean }; // service: the site is the avoided service itself, code hosts included

async function find(e: Target): Promise<{ source: string; image: Buffer } | undefined> {
  const site = e.url && (e.service || !isCodeHost(e.url)) ? e.url : undefined;
  const tries = site ? (await candidates(site)).map((c) => c.url).filter((u) => e.service || !FOREIGN_ICON_HOSTS.has(hostOf(u))) : [];
  const repo = e.repo ?? e.url;
  if (repo && isCodeHost(repo)) {
    const avatar = await orgAvatar(repo);
    if (avatar) tries.push(avatar);
  }
  for (const url of new Set(tries)) {
    const buf = await bytes(url);
    const image = buf && (await render(buf));
    if (image) return { source: url, image };
  }
}

function collect(): Map<string, Target> {
  const { sections } = loadData(resolve(process.cwd(), "../data"));
  const all = new Map<string, Target>();
  const add = (id: string, t: Target) => { if (SAFE_ID.test(id) && !all.has(id)) all.set(id, t); };
  const entries = (list: Entry[] = []) =>
    list.forEach((e) => { add(logoId(e.name), e); entries(e.children); });
  const walk = (s: Section) => {
    entries(s.recommend?.entries);
    s.avoid?.items.forEach((a) => { if (a.site && !brandOf(a)) add(avoidLogoId(a.name), { url: a.site, service: true }); entries(a.tools); });
    s.subsections?.forEach(walk);
  };
  Object.values(sections).forEach(walk);
  return all;
}

const entries = collect();
mkdirSync(OUT, { recursive: true });
const isDue = (r: Record | undefined) => !r || daysSince(r.checked) >= (r.source ? REFRESH_DAYS : RETRY_DAYS);
const due = [...entries].filter(([id]) => (only ? id === only : isDue(manifest[id])));
const counts = { added: 0, changed: 0, same: 0, none: 0 };

const queue = [...due];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  for (let next = queue.shift(); next; next = queue.shift()) {
    const [id, entry] = next;
    const found = await find(entry).catch((err) => void console.error(`${id}: ${err}`));
    const previous = manifest[id];
    if (!found) {
      // Keep a logo that worked before when its site is only briefly unreachable.
      if (!previous?.source) counts.none++;
      manifest[id] = { ...(previous ?? { source: null }), checked: today };
      continue;
    }
    const hash = createHash("sha256").update(found.image).digest("hex").slice(0, 16);
    if (previous?.hash === hash) counts.same++;
    else {
      writeFileSync(`${OUT}/${id}.webp`, found.image);
      previous?.hash ? counts.changed++ : counts.added++;
    }
    manifest[id] = { source: found.source, checked: today, hash };
  }
}));

// Drop logos of entries that left the list.
for (const id of Object.keys(manifest)) {
  if (entries.has(id)) continue;
  delete manifest[id];
  if (SAFE_ID.test(id)) rmSync(`${OUT}/${id}.webp`, { force: true });
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");
console.log(`logos: ${due.length} checked, ${counts.added} added, ${counts.changed} changed, ${counts.same} unchanged, ${counts.none} without a logo`);
