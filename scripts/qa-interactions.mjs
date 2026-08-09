import { chromium } from "@playwright/test";

// 127.0.0.1 rather than localhost: another dev server may hold the IPv6
// loopback on the same port, and "localhost" resolves to ::1 first.
const BASE = process.env.BASE ?? "http://127.0.0.1:5173";

const results = [];
const check = (name, pass, detail = "") =>
  results.push({ name, pass, detail: detail ? ` ${detail}` : "" });

async function jumpTo(page, y) {
  await page.evaluate((target) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, y);
  await page.waitForTimeout(500);
}

const topOf = (page, id) =>
  page.evaluate((sel) => {
    const el = document.getElementById(sel);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, id);

/* ── standard motion pass ─────────────────────────────────────────── */
{
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const trpcCalls = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/trpc")) trpcCalls.push({ url: r.url(), body: r.postData() });
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Practice preselect
  await jumpTo(page, await topOf(page, "practices"));
  await page.getByRole("button", { name: /Get in touch/i }).first().click();
  await page.waitForTimeout(1200);
  const selected = await page.locator("#v4-inquiry").inputValue();
  check(
    "practice row preselects the inquiry type",
    selected === "Data Governance & Ataccama One",
    `got "${selected}"`,
  );
  const contactVisible = await page.locator("#contact").isVisible();
  check("clicking a practice CTA lands on the contact form", contactVisible);

  // Validation: submit with everything empty
  await page.locator("#v4-name").fill("");
  await page.getByRole("button", { name: /Send message/i }).click();
  await page.waitForTimeout(600);
  const errorTexts = await page.locator(".v4-error").allTextContents();
  check(
    "zod errors render for an empty submit",
    errorTexts.length >= 4,
    `${errorTexts.length} shown: ${errorTexts.join(" | ")}`,
  );
  check(
    "invalid submit does not reach the server",
    trpcCalls.length === 0,
    `${trpcCalls.length} calls`,
  );

  // Valid submit
  await page.locator("#v4-name").fill("Jane Smith");
  await page.locator("#v4-company").fill("Acme Corp");
  await page.locator("#v4-email").fill("jane@acme.com");
  await page.locator("#v4-message").fill("We need help governing our data estate this quarter.");
  await page.getByRole("button", { name: /Send message/i }).click();
  await page.waitForTimeout(2500);

  check("valid submit fires the tRPC mutation", trpcCalls.length >= 1, `${trpcCalls.length} calls`);
  const payload = trpcCalls[0]?.body ?? "";
  check(
    "mutation payload carries the form fields",
    payload.includes("jane@acme.com") && payload.includes("Data Governance"),
    payload.slice(0, 140),
  );
  const toastText = (await page.locator("[data-sonner-toast]").allTextContents()).join(" | ");
  console.log(`  toast shown after submit: "${toastText}"`);
  check("submit result is surfaced to the user as a toast", toastText.length > 0, toastText);

  // Section loops
  await jumpTo(page, await topOf(page, "partners"));
  await page.waitForTimeout(1500);
  const lineage = await page.evaluate(() => {
    const v = document.querySelector('video[src*="lineage"]');
    return v ? { present: true, paused: v.paused, muted: v.muted, loop: v.loop } : { present: false };
  });
  check(
    "lineage loop lazy-mounts and autoplays muted",
    lineage.present && !lineage.paused && lineage.muted && lineage.loop,
    JSON.stringify(lineage),
  );

  await jumpTo(page, await topOf(page, "contact"));
  await page.waitForTimeout(1500);
  const team = await page.evaluate(() => {
    const v = document.querySelector('video[src*="team"]');
    return v ? { present: true, paused: v.paused, muted: v.muted } : { present: false };
  });
  check(
    "team loop lazy-mounts and autoplays muted",
    team.present && !team.paused && team.muted,
    JSON.stringify(team),
  );

  // Hero canvas is actually painting distinct frames
  await jumpTo(page, 0);
  await page.waitForTimeout(800);
  const early = await page.evaluate(() => document.querySelector("canvas")?.toDataURL().length ?? 0);
  await jumpTo(page, 900 * 1.9);
  await page.waitForTimeout(800);
  const late = await page.evaluate(() => document.querySelector("canvas")?.toDataURL().length ?? 0);
  check("hero canvas paints different frames at different scroll depths", early > 0 && early !== late, `${early} vs ${late}`);

  await browser.close();
}

/* ── reduced motion pass ──────────────────────────────────────────── */
{
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const hero = await page.evaluate(() => {
    const el = document.getElementById("hero");
    return {
      height: el?.getBoundingClientRect().height ?? 0,
      viewport: window.innerHeight,
      canvas: !!el?.querySelector("canvas"),
      poster: el?.querySelector("img")?.getAttribute("src") ?? null,
    };
  });
  check(
    "reduced motion collapses the hero pin to one screen",
    Math.abs(hero.height - hero.viewport) < 40 && !hero.canvas,
    JSON.stringify(hero),
  );
  check("reduced motion shows the settled poster", hero.poster?.includes("poster-end") ?? false, String(hero.poster));

  const lenisRunning = await page.evaluate(() => !!window.__lenis);
  check("reduced motion leaves smooth scrolling off", !lenisRunning);

  const cursor = await page.locator(".v4-cursor-dot").count();
  check("reduced motion drops the custom cursor", cursor === 0);

  const manifesto = await page.evaluate(() => {
    const el = document.getElementById("manifesto");
    return {
      height: el?.getBoundingClientRect().height ?? 0,
      viewport: window.innerHeight,
      words: [...(el?.querySelectorAll("h2") ?? [])].map((n) => n.textContent),
    };
  });
  check(
    "reduced motion renders the manifesto as static text",
    manifesto.height < manifesto.viewport * 2 && manifesto.words.length === 3,
    JSON.stringify(manifesto.words),
  );

  const videos = await page.evaluate(() => document.querySelectorAll("video").length);
  check("reduced motion never mounts the section loops", videos === 0, `${videos} videos`);

  await browser.close();
}

console.log("");
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : r.detail}`);
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
