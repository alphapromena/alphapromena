import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

// 127.0.0.1 rather than localhost on purpose: another dev server may hold the
// IPv6 loopback on the same port, and "localhost" resolves to ::1 first.
const BASE = process.env.BASE ?? "http://127.0.0.1:5173";
const OUT = process.argv[2] ?? "shots";
await fs.mkdir(OUT, { recursive: true });

const errors = [];

async function jumpTo(page, y) {
  await page.evaluate((target) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, y);
  await page.waitForTimeout(700);
}

async function shoot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(`  ${file}`);
}

async function sectionTop(page, id) {
  return page.evaluate((sel) => {
    const el = document.getElementById(sel);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, id);
}

async function hudValue(page) {
  return page.evaluate(() => {
    const nodes = [...document.querySelectorAll("span")];
    const el = nodes.find((n) => /^\d{2}\.\d$/.test(n.textContent?.trim() ?? ""));
    return el ? el.textContent.trim() : null;
  });
}

async function run(label, width, height) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

  page.on("pageerror", (e) => errors.push(`[${label}] pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${label}] console: ${m.text()}`);
  });

  console.log(`\n${label} (${width}x${height})`);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500); // let eager hero frames decode

  await jumpTo(page, 0);
  await shoot(page, `${label}-01-hero-start`);
  const hudStart = await hudValue(page);

  const vh = height;
  await jumpTo(page, vh * 1.98);
  await shoot(page, `${label}-02-hero-end`);
  const hudEnd = await hudValue(page);

  const manifestoTop = await sectionTop(page, "manifesto");
  await jumpTo(page, manifestoTop + vh * 1.2);
  await shoot(page, `${label}-03-manifesto`);

  const practicesTop = await sectionTop(page, "practices");
  await jumpTo(page, practicesTop + 60);
  await shoot(page, `${label}-04-practices`);

  const partnersTop = await sectionTop(page, "partners");
  await jumpTo(page, partnersTop + 60);
  await shoot(page, `${label}-05-partners`);

  const processTop = await sectionTop(page, "process");
  await jumpTo(page, processTop + vh * 0.6);
  await shoot(page, `${label}-06-process`);

  const contactTop = await sectionTop(page, "contact");
  await jumpTo(page, contactTop + 60);
  await shoot(page, `${label}-07-contact`);

  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await jumpTo(page, docHeight);
  await shoot(page, `${label}-08-footer`);

  console.log(`  HUD: start=${hudStart} end=${hudEnd}`);
  console.log(`  document height: ${docHeight}px`);

  await browser.close();
  return { hudStart, hudEnd };
}

const desktop = await run("desktop", 1440, 900);
const mobile = await run("mobile", 390, 844);
const narrow = await run("narrow", 380, 800);

console.log("\n─────── results ───────");
console.log(`desktop HUD ${desktop.hudStart} -> ${desktop.hudEnd}`);
console.log(`mobile  HUD ${mobile.hudStart} -> ${mobile.hudEnd} (hidden below sm by design)`);
console.log(`narrow  HUD ${narrow.hudStart} -> ${narrow.hudEnd}`);
console.log(errors.length ? `\nERRORS:\n${errors.join("\n")}` : "\nno page errors");
