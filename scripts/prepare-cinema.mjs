#!/usr/bin/env node
/**
 * Turns the raw Higgsfield generations listed in scripts/cinema.config.json
 * into the web-ready assets the site actually ships:
 *
 *   client/public/cinema/hero/frame_###.webp  scroll-scrub frame sequence
 *   client/public/cinema/hero/manifest.json   frame count / size / fps / ext
 *   client/public/cinema/hero/poster-*.jpg    first + last frame (LQIP, reduced motion)
 *   client/public/cinema/lineage.mp4          section loop
 *   client/public/cinema/team.mp4             section loop
 *
 * Raw downloads land in .cinema-raw/ and are never committed. Encoding is
 * retried at progressively cheaper settings until each output fits its budget,
 * because oversized assets are what make a scroll-scrub stutter.
 *
 *   node scripts/prepare-cinema.mjs
 */
import { spawnSync } from "node:child_process";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW_DIR = path.join(ROOT, ".cinema-raw");
const OUT_DIR = path.join(ROOT, "client", "public", "cinema");
const HERO_DIR = path.join(OUT_DIR, "hero");
const CONFIG = path.join(ROOT, "scripts", "cinema.config.json");

const MB = 1024 * 1024;
const HERO_BUDGET = 10 * MB;
const LOOP_BUDGET = 3 * MB;

/**
 * Frame encode ladder, walked until the sequence fits HERO_BUDGET.
 *
 * Sampling rate is spent before resolution on purpose. A scroll-scrub's
 * smoothness is set by how much scroll maps to one frame, not by the source
 * fps, so 129 sharp frames read better than 193 soft ones over the same pin.
 * The film grain in these generations barely responds to quality reductions,
 * which is why dropping quality alone never gets under budget.
 */
const FRAME_LADDER = [
  { fps: 24, width: 1280, quality: 70 },
  { fps: 20, width: 1280, quality: 70 },
  { fps: 16, width: 1280, quality: 68 },
  { fps: 16, width: 1120, quality: 62 },
  { fps: 12, width: 1120, quality: 60 },
];

/** Loop encode ladder, walked until each mp4 fits LOOP_BUDGET. */
const LOOP_LADDER = [
  { width: 1280, crf: 30 },
  { width: 1280, crf: 32 },
  { width: 1120, crf: 34 },
  { width: 1024, crf: 36 },
];

function ffmpeg(args) {
  const res = spawnSync(ffmpegPath, ["-y", "-hide_banner", "-loglevel", "error", ...args], {
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
  if (res.status !== 0) {
    throw new Error(`ffmpeg failed (${res.status}):\n${res.stderr || res.stdout}`);
  }
  return res.stdout;
}

/** True when this ffmpeg build can encode the given codec. */
function hasEncoder(name) {
  const res = spawnSync(ffmpegPath, ["-hide_banner", "-encoders"], { encoding: "utf8" });
  return (res.stdout || "").includes(` ${name} `);
}

async function download(url, dest) {
  const existing = await fs.stat(dest).catch(() => null);
  if (existing && existing.size > 0) {
    console.log(`  cached  ${path.basename(dest)} (${fmt(existing.size)})`);
    return dest;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  await pipeline(res.body, createWriteStream(dest));
  const { size } = await fs.stat(dest);
  console.log(`  fetched ${path.basename(dest)} (${fmt(size)})`);
  return dest;
}

async function dirSize(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  let total = 0;
  for (const e of entries) {
    if (e.isFile()) total += (await fs.stat(path.join(dir, e.name))).size;
  }
  return total;
}

const fmt = (bytes) =>
  bytes >= MB ? `${(bytes / MB).toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

async function emptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

/** Probes the first produced frame so the manifest carries real dimensions. */
function probeSize(file) {
  const res = spawnSync(
    ffmpegPath,
    ["-hide_banner", "-i", file, "-f", "null", "-"],
    { encoding: "utf8" },
  );
  const m = (res.stderr || "").match(/,\s(\d{2,5})x(\d{2,5})/);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : { width: 0, height: 0 };
}

async function buildHeroFrames(src) {
  const webp = hasEncoder("libwebp");
  const ext = webp ? "webp" : "jpg";
  if (!webp) {
    console.log("  note: this ffmpeg build has no libwebp, falling back to JPEG frames");
  }

  let chosen = null;
  for (const rung of FRAME_LADDER) {
    await emptyDir(HERO_DIR);
    const codecArgs = webp
      ? ["-c:v", "libwebp", "-quality", String(rung.quality), "-preset", "picture"]
      : ["-q:v", String(Math.max(2, Math.round((100 - rung.quality) / 8)))];

    ffmpeg([
      "-i", src,
      "-vf", `fps=${rung.fps},scale=${rung.width}:-2:flags=lanczos`,
      ...codecArgs,
      "-an",
      path.join(HERO_DIR, `frame_%03d.${ext}`),
    ]);

    const total = await dirSize(HERO_DIR);
    const count = (await fs.readdir(HERO_DIR)).filter((f) => f.startsWith("frame_")).length;
    console.log(
      `  hero frames @ ${rung.fps}fps ${rung.width}px q${rung.quality}: ${count} frames, ${fmt(total)}`,
    );
    if (total <= HERO_BUDGET) {
      chosen = { ...rung, total, count, ext };
      break;
    }
    console.log(`    over the ${fmt(HERO_BUDGET)} budget, stepping down`);
  }
  if (!chosen) throw new Error("could not fit the hero frame sequence into its budget");

  const first = path.join(HERO_DIR, `frame_001.${chosen.ext}`);
  const { width, height } = probeSize(first);

  // Posters double as the LQIP and the reduced-motion still.
  const last = `frame_${String(chosen.count).padStart(3, "0")}.${chosen.ext}`;
  ffmpeg(["-i", first, "-vf", "scale=960:-2", "-q:v", "6", path.join(HERO_DIR, "poster-start.jpg")]);
  ffmpeg([
    "-i", path.join(HERO_DIR, last),
    "-vf", "scale=960:-2",
    "-q:v", "6",
    path.join(HERO_DIR, "poster-end.jpg"),
  ]);

  await fs.writeFile(
    path.join(HERO_DIR, "manifest.json"),
    JSON.stringify(
      { count: chosen.count, width, height, fps: chosen.fps, ext: chosen.ext },
      null,
      2,
    ) + "\n",
  );

  return { ...chosen, width, height, total: await dirSize(HERO_DIR) };
}

async function buildLoop(src, name) {
  const dest = path.join(OUT_DIR, `${name}.mp4`);
  for (const rung of LOOP_LADDER) {
    ffmpeg([
      "-i", src,
      "-vf", `scale=${rung.width}:-2:flags=lanczos`,
      "-c:v", "libx264",
      "-crf", String(rung.crf),
      "-preset", "veryslow",
      "-pix_fmt", "yuv420p",
      "-an",
      "-movflags", "+faststart",
      dest,
    ]);
    const { size } = await fs.stat(dest);
    console.log(`  ${name}.mp4 @ ${rung.width}px crf${rung.crf}: ${fmt(size)}`);
    if (size <= LOOP_BUDGET) return { size, ...rung };
    console.log(`    over the ${fmt(LOOP_BUDGET)} budget, stepping down`);
  }
  throw new Error(`could not fit ${name}.mp4 into its budget`);
}

async function main() {
  const config = JSON.parse(await fs.readFile(CONFIG, "utf8"));
  for (const key of ["heroImage", "heroClip", "lineageClip", "teamClip"]) {
    if (!config[key]) throw new Error(`cinema.config.json is missing "${key}"`);
  }

  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.mkdir(HERO_DIR, { recursive: true });

  console.log("\nDownloading sources");
  const heroImage = await download(config.heroImage, path.join(RAW_DIR, "hero.png"));
  const heroClip = await download(config.heroClip, path.join(RAW_DIR, "hero.mp4"));
  const lineage = await download(config.lineageClip, path.join(RAW_DIR, "lineage.mp4"));
  const team = await download(config.teamClip, path.join(RAW_DIR, "team.mp4"));

  console.log("\nHero scrub sequence");
  const hero = await buildHeroFrames(heroClip);

  console.log("\nSection loops");
  const lineageOut = await buildLoop(lineage, "lineage");
  const teamOut = await buildLoop(team, "team");

  // A small still of the reference image backs the hero before frames decode.
  ffmpeg(["-i", heroImage, "-vf", "scale=1280:-2", "-q:v", "7", path.join(OUT_DIR, "hero-still.jpg")]);

  // Published so the runtime fallback can rebuild frames from the source clip
  // if the sequence above ever goes missing from a deploy.
  await fs.writeFile(
    path.join(OUT_DIR, "sources.json"),
    JSON.stringify(config, null, 2) + "\n",
  );

  const stillSize = (await fs.stat(path.join(OUT_DIR, "hero-still.jpg"))).size;
  const heroTotal = await dirSize(HERO_DIR);

  console.log("\n─────────── shipped asset sizes ───────────");
  console.log(`hero frames   ${hero.count} x ${hero.width}x${hero.height} ${hero.ext}   ${fmt(heroTotal)}  (budget ${fmt(HERO_BUDGET)})`);
  console.log(`hero still    ${fmt(stillSize)}`);
  console.log(`lineage.mp4   ${fmt(lineageOut.size)}  (budget ${fmt(LOOP_BUDGET)})`);
  console.log(`team.mp4      ${fmt(teamOut.size)}  (budget ${fmt(LOOP_BUDGET)})`);
  console.log(`total shipped ${fmt(heroTotal + stillSize + lineageOut.size + teamOut.size)}`);
  console.log("───────────────────────────────────────────\n");

  if (heroTotal > HERO_BUDGET) throw new Error("hero frames exceeded budget");
  if (lineageOut.size > LOOP_BUDGET || teamOut.size > LOOP_BUDGET) {
    throw new Error("a section loop exceeded budget");
  }
}

main().catch((err) => {
  console.error(`\nprepare-cinema failed: ${err.message}\n`);
  process.exit(1);
});
