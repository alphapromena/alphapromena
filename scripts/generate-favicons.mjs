/**
 * Favicon set generator (Round 28.3). Build-time only.
 *
 * Regenerate with:  node scripts/generate-favicons.mjs   (or: pnpm icons)
 *
 * Outputs into client/public/:
 * - favicon.svg           the official mark, served directly (modern favicon)
 * - favicon-16.png/-32    the mark on transparent
 * - apple-touch-icon.png  180x180, solid ink (#313234) + dark mark at ~62% width
 * - icon-192.png/-512     same treatment as apple-touch-icon
 * - site.webmanifest      background #F3F2F1, theme #313234
 */
import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "client", "public");
const MARK = path.join(pub, "brand", "logo-mark.svg");
const MARK_DARK = path.join(pub, "brand", "logo-mark-dark.svg");

/* SVG viewBox is 229.68 x 149.63 */
const ASPECT = 149.63 / 229.68;

/** Render an SVG file to a PNG buffer at the given pixel width. */
async function renderSvg(file, width) {
  const density = (72 * width) / 229.68; // scale vector cleanly
  return sharp(await readFile(file), { density }).resize({ width }).png().toBuffer();
}

/** The mark centered on a square canvas. */
async function markOnSquare(file, size, markWidth, background) {
  const mark = await renderSvg(file, markWidth);
  const meta = await sharp(mark).metadata();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: mark,
        left: Math.round((size - markWidth) / 2),
        top: Math.round((size - (meta.height ?? markWidth * ASPECT)) / 2),
      },
    ])
    .png()
    .toBuffer();
}

const INK = { r: 0x31, g: 0x32, b: 0x34, alpha: 1 };

/* Modern favicon: the committed mark itself. */
await copyFile(MARK, path.join(pub, "favicon.svg"));

/* Transparent PNG favicons from the full-color mark. */
await writeFile(path.join(pub, "favicon-32.png"), await markOnSquare(MARK, 32, 30));
await writeFile(path.join(pub, "favicon-16.png"), await markOnSquare(MARK, 16, 15));

/* Ink-background icons with the dark mark at ~62% width. */
await writeFile(path.join(pub, "apple-touch-icon.png"), await markOnSquare(MARK_DARK, 180, 112, INK));
await writeFile(path.join(pub, "icon-192.png"), await markOnSquare(MARK_DARK, 192, 119, INK));
await writeFile(path.join(pub, "icon-512.png"), await markOnSquare(MARK_DARK, 512, 317, INK));

await writeFile(
  path.join(pub, "site.webmanifest"),
  JSON.stringify(
    {
      name: "Alpha Pro MENA",
      short_name: "Alpha Pro",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      background_color: "#F3F2F1",
      theme_color: "#313234",
      display: "browser",
    },
    null,
    2,
  ) + "\n",
);

console.log("favicon set written to client/public/");
