import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE = process.env.BASE ?? "http://127.0.0.1:5173";
const OUT = process.argv[2] ?? "shots";
await fs.mkdir(OUT, { recursive: true });

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

const jump = (page, y) =>
  page
    .evaluate((t) => {
      const l = window.__lenis;
      if (l) l.scrollTo(t, { immediate: true, force: true });
      else window.scrollTo(0, t);
    }, y)
    .then(() => page.waitForTimeout(500));

/** Reads the HUD's rendered geometry and its current scale. */
const hudState = (page) =>
  page.evaluate(() => {
    const slot = document.querySelector(".v4-hud-slot");
    const grow = document.querySelector(".v4-hud-grow");
    const value = document.querySelector(".v4-hud-value");
    const chip = slot?.parentElement;
    if (!slot || !grow || !value || !chip) return null;
    const m = new DOMMatrixReadOnly(getComputedStyle(grow).transform);
    return {
      text: value.textContent.trim(),
      scale: Number(m.a.toFixed(3)),
      slot: { w: Math.round(slot.getBoundingClientRect().width), h: Math.round(slot.getBoundingClientRect().height) },
      chip: { w: Math.round(chip.getBoundingClientRect().width), h: Math.round(chip.getBoundingClientRect().height) },
      labelSize: getComputedStyle(document.querySelector(".v4-eyebrow")).fontSize,
    };
  });

const browser = await chromium.launch();

for (const locale of ["en", "ar"]) {
  const path = locale === "en" ? "/" : "/ar";
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Collect layout shifts for the whole session, ignoring input-driven ones.
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2200);

  const vh = 900;
  const depths = [
    ["start", 0],
    ["mid", vh * 1.0],
    ["end", vh * 2],
  ];
  const states = [];
  for (const [name, y] of depths) {
    await jump(page, y);
    const state = await hudState(page);
    states.push([name, state]);
    await page.screenshot({
      path: `${OUT}/${locale}-hud-${name}.png`,
      clip: { x: locale === "ar" ? 0 : 1180, y: 60, width: 260, height: 190 },
    });
  }

  const [[, s0], [, s1], [, s2]] = states;
  check(
    `[${locale}] HUD grows 1.0 to 2.0 with the scrub`,
    Math.abs(s0.scale - 1) < 0.05 && s1.scale > 1.4 && s1.scale < 1.7 && s2.scale > 1.95,
    states.map(([n, s]) => `${n}=${s.scale}(${s.text})`).join(" "),
  );
  check(
    `[${locale}] reserved box never resizes`,
    s0.slot.w === s1.slot.w && s1.slot.w === s2.slot.w && s0.slot.h === s2.slot.h,
    `${s0.slot.w}x${s0.slot.h} -> ${s2.slot.w}x${s2.slot.h}`,
  );
  check(
    `[${locale}] chip geometry stable across the pin`,
    s0.chip.w === s2.chip.w && s0.chip.h === s2.chip.h,
    `${s0.chip.w}x${s0.chip.h} -> ${s2.chip.w}x${s2.chip.h}`,
  );
  check(`[${locale}] label size fixed`, s0.labelSize === s2.labelSize, `${s0.labelSize} -> ${s2.labelSize}`);
  check(`[${locale}] value reaches 99.9`, s2.text === "99.9", s2.text);

  // Pop fires once at completion, and re-arms after leaving the end.
  const popped = await page.evaluate(() => document.querySelector(".v4-hud-slot")?.classList.contains("v4-hud-pop"));
  check(`[${locale}] completion pop applied`, popped === true, String(popped));

  const cls = await page.evaluate(() => window.__cls);
  // Scrub-attributable shift: reset after load, then sweep the pin again.
  await page.evaluate(() => { window.__cls = 0; });
  for (const y of [0, vh * 0.5, vh, vh * 1.5, vh * 2, vh]) await jump(page, y);
  const scrubCls = await page.evaluate(() => window.__cls);
  check(`[${locale}] HUD growth causes no layout shift`, scrubCls < 0.001, scrubCls.toFixed(5));
  check(`[${locale}] page load shift within Google's good band`, cls < 0.1, cls.toFixed(5));

  // Arabic hero after-shots at both widths.
  if (locale === "ar") {
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const p2 = await browser.newPage({ viewport: { width: w, height: h } });
      await p2.goto(BASE + path, { waitUntil: "networkidle" });
      await p2.evaluate(() => document.fonts.ready);
      await p2.waitForTimeout(2000);
      await p2.screenshot({ path: `${OUT}/ar-${w}-hero-after.png` });
      const type = await p2.evaluate(() => {
        const h1 = document.querySelector("h1");
        const cs = getComputedStyle(h1);
        return {
          fontSize: cs.fontSize,
          weight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          lines: h1.getBoundingClientRect().height,
        };
      });
      check(`[ar/${w}] hero display scale reduced`, parseFloat(type.fontSize) < (w === 1440 ? 80 : 46), JSON.stringify(type));
      check(`[ar/${w}] hero stays weight 700`, type.weight === "700", type.weight);
      await p2.close();
    }
  } else {
    const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p2.goto(BASE + path, { waitUntil: "networkidle" });
    await p2.waitForTimeout(1500);
    const en = await p2.evaluate(() => getComputedStyle(document.querySelector("h1")).fontSize);
    check("[en] Latin hero scale unchanged", parseFloat(en) > 100, en);
    await p2.close();
  }

  await page.close();
}

// Reduced motion: final size and value, no growth animation.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const s = await hudState(page);
  check("reduced motion renders the HUD at final size", s && s.scale > 1.95, JSON.stringify(s));
  check("reduced motion renders the final value", s?.text === "99.9", s?.text ?? "");
  const popped = await page.evaluate(() => document.querySelector(".v4-hud-slot")?.classList.contains("v4-hud-pop"));
  check("reduced motion plays no pop", popped === false, String(popped));
  await page.close();
}

await browser.close();

console.log("");
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  >> " + r.detail}`);
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
