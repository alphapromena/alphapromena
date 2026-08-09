/**
 * OG image composer (Round 28.3). Build-time only.
 *
 * Regenerate with:  node scripts/generate-og.mjs   (or: pnpm og)
 *
 * Composes client/public/brand/og-image.png (1200x630) entirely from
 * vectors: ink gradient + rose glow background, the dark brand mark,
 * and text converted to SVG paths with opentype.js from the committed
 * Barlow TTFs in scripts/fonts/ — so the render is identical on any
 * machine, independent of system fonts.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTS = path.join(root, "scripts", "fonts");
const OUT = path.join(root, "client", "public", "brand", "og-image.png");

const W = 1200;
const H = 630;

const loadFont = async (file) => {
  const buf = await readFile(path.join(FONTS, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const bold = await loadFont("Barlow-Bold.ttf");
const regular = await loadFont("Barlow-Regular.ttf");

/** Text → SVG path element (baseline at y). Space glyphs make
    opentype.js emit NaN commands that abort librsvg's rendering; they
    carry no visible geometry, so NaN commands are stripped. */
function textPath(font, text, x, y, size, fill, opacity = 1) {
  const d = font
    .getPath(text, x, y, size)
    .toPathData(2)
    .replace(/[A-Za-z][^A-Za-z]*NaN[^A-Za-z]*/g, "");
  if (d.includes("NaN")) throw new Error(`NaN survived sanitizing: ${text}`);
  const op = opacity < 1 ? ` opacity="${opacity}"` : "";
  return `<path d="${d}" fill="${fill}"${op}/>`;
}

/* The dark mark, inlined from the committed SVG (viewBox 229.68x149.63). */
const markSvg = await readFile(path.join(root, "client", "public", "brand", "logo-mark-dark.svg"), "utf8");
const markPaths = [...markSvg.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join("\n    ");

const MARK_SCALE = 1.72; // ~395px wide
const MARK_X = 92;
const MARK_Y = 186; // vertically centered: 630/2 - (149.63*1.72)/2 ≈ 186

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#313234"/>
      <stop offset="1" stop-color="#1A1C1E"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.12" r="0.75">
      <stop offset="0" stop-color="#FF1E57" stop-opacity="0.28"/>
      <stop offset="0.55" stop-color="#FF1E57" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#FF1E57" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g transform="translate(${MARK_X}, ${MARK_Y}) scale(${MARK_SCALE})">
    ${markPaths}
  </g>
  <rect x="562" y="196" width="72" height="8" fill="#FF1E57"/>
  ${textPath(bold, "ALPHA PRO", 558, 318, 104, "#F3F2F1")}
  ${textPath(bold, "MENA", 558, 424, 104, "#F3F2F1")}
  ${textPath(regular, "Ataccama's certified partner across MENA", 560, 486, 30, "#F3F2F1", 0.8)}
</svg>`;

await writeFile(OUT, await sharp(Buffer.from(svg)).png().toBuffer());
console.log(`og-image written to ${path.relative(root, OUT)}`);
