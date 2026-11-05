import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

// Share images are drawn from Inter's outlines, so they look the same wherever they are built.
const font = (weight: number) => {
  const buf = readFileSync(resolve(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
};
const BOLD = font(800);
const MEDIUM = font(500);

const [W, H, X] = [1200, 630, 80];
const TEXT_WIDTH = W - X * 2;
const C = { bg: "#0d0d0f", text: "#ececee", muted: "#b0b0b8", faint: "#8d8d97", magenta: "#ff3dff", green: "#36f236", accent: "#ea8cf7" };

// Words that fit in `lines` lines of `width`, the last one cut with an ellipsis if needed.
function wrap(f: opentype.Font, text: string, size: number, width: number, lines: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (f.getAdvanceWidth(next, size) <= width || !line) line = next;
    else {
      out.push(line);
      line = word;
    }
  }
  if (line) out.push(line);
  if (out.length <= lines) return out;
  const kept = out.slice(0, lines);
  let last = kept[lines - 1];
  while (f.getAdvanceWidth(`${last}…`, size) > width && last.includes(" ")) last = last.slice(0, last.lastIndexOf(" "));
  kept[lines - 1] = `${last}…`;
  return kept;
}

const path = (f: opentype.Font, text: string, x: number, y: number, size: number, fill: string) =>
  `<path fill="${fill}" d="${f.getPath(text, x, y, size).toPathData(1)}"/>`;

export type Card = { eyebrow?: string; title: string; subtitle?: string };

export async function renderCard({ eyebrow, title, subtitle }: Card): Promise<Buffer> {
  const titleSize = BOLD.getAdvanceWidth(title, 88) <= TEXT_WIDTH ? 88 : 72;
  const titleLines = wrap(BOLD, title, titleSize, TEXT_WIDTH, 2);
  const subLines = subtitle ? wrap(MEDIUM, subtitle, 34, TEXT_WIDTH, 2) : [];
  const parts: string[] = [];

  // Wordmark with the site's two-colour offset.
  for (const [dx, dy, fill] of [[-2, 2, C.magenta], [2, -1, C.green], [0, 0, C.text]] as const) {
    parts.push(path(BOLD, "AWESOME PRIVACY", X + dx, 112 + dy, 34, fill));
  }

  const lineHeight = titleSize * 1.08;
  const block = (eyebrow ? 58 : 0) + titleLines.length * lineHeight + (subLines.length ? 24 + subLines.length * 46 : 0);
  let y = Math.max(220, (H - block) / 2 + 30);
  if (eyebrow) {
    parts.push(path(MEDIUM, eyebrow.toUpperCase(), X, y, 26, C.accent));
    y += 58;
  }
  for (const line of titleLines) {
    y += titleSize * 0.82;
    parts.push(path(BOLD, line, X, y, titleSize, C.text));
    y += lineHeight - titleSize * 0.82;
  }
  y += 24;
  for (const line of subLines) {
    y += 34;
    parts.push(path(MEDIUM, line, X, y, 34, C.muted));
    y += 12;
  }
  parts.push(path(MEDIUM, "awesomeprivacy.org", X, H - 64, 28, C.faint));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="${C.bg}"/><rect x="0" y="${H - 8}" width="${W}" height="8" fill="${C.accent}"/>${parts.join("")}</svg>`;
  return sharp(Buffer.from(svg)).png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer();
}
