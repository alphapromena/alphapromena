/* Round 28.4 cross-browser QA. Local vite preview serves the exact
   redesign/v2 commit (vercel.app is network-blocked on this machine);
   production screenshots come from the reachable custom domain. */
import { chromium, firefox, webkit, devices } from "playwright";
import path from "node:path";

const LOCAL = "http://localhost:4173";
const PROD = "https://www.alphapromena.com";
const OUT = "c:/Claude_Projects/alphapromena/alphapromena/docs/qa-28.4";

const results = [];
const log = (s) => { console.log(s); results.push(s); };

function watch(page, label, errors) {
  page.on("console", (m) => { if (m.type() === "error") errors.push(`${label} console: ${m.text().slice(0, 160)}`); });
  page.on("pageerror", (e) => errors.push(`${label} pageerror: ${String(e).slice(0, 160)}`));
}

async function shoot(page, name, opts = {}) {
  await page.screenshot({ path: path.join(OUT, name), ...opts });
}

/* ── Chromium: full interactive pass at 1440x900 ── */
async function chromiumPass() {
  const errors = [];
  const b = await chromium.launch();
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  watch(page, "chromium", errors);

  await page.goto(LOCAL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800); // hero load sequence
  await shoot(page, "after-01-hero.png");

  // 3D intent-load: pointer gesture must fetch the chunk and mount the canvas
  await page.mouse.move(700, 400);
  await page.mouse.move(900, 500);
  try {
    await page.waitForSelector("canvas", { timeout: 20000 });
    await page.waitForTimeout(2500); // entrance fade
    log("PASS chromium: 3D canvas mounted after pointer gesture");
  } catch { log("FAIL chromium: no canvas after gesture"); }
  await shoot(page, "after-02-hero-3d.png");

  // pointer-follow smoke: move pointer, ensure no crash + canvas persists
  for (let i = 0; i < 8; i++) await page.mouse.move(300 + i * 120, 300 + (i % 3) * 100);
  await page.waitForTimeout(600);
  log((await page.$("canvas")) ? "PASS chromium: canvas stable under pointer-follow" : "FAIL chromium: canvas gone");

  // marquee present
  log((await page.$(".v3-marquee")) ? "PASS chromium: marquee rendered" : "FAIL chromium: marquee missing");

  // practices: click row 2, panel swap + chips; then Get in touch preselect
  await page.click("#practices >> text=Three practices", { timeout: 5000 }).catch(() => {});
  await page.locator("#practice-tab-banking").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await shoot(page, "after-03-practices.png");
  await page.click("#practice-tab-banking");
  await page.waitForTimeout(500);
  const sub = await page.locator("#practice-panel").innerText();
  log(sub.includes("regulated institutions") || sub.includes("Precision") ? "PASS chromium: practice panel swaps" : "FAIL chromium: panel did not swap");
  await page.locator("#practice-panel >> text=Get in touch").click();
  await page.waitForTimeout(1200);
  const preVal = await page.locator("#f-practice").inputValue();
  log(preVal === "Banking & Finance Advisory" ? "PASS chromium: preselect wired (Banking)" : `FAIL chromium: preselect value '${preVal}'`);

  // partnerships band
  await page.locator("#partnership").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await shoot(page, "after-04-partnerships.png");

  // process: thread nodes activate as we scroll
  await page.locator("#how-we-work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(900);
  const activeNodes = await page.$$eval(".v2-node--active", (els) => els.length);
  log(activeNodes >= 2 ? `PASS chromium: ${activeNodes} thread nodes active after scroll` : `FAIL chromium: only ${activeNodes} nodes active`);
  await shoot(page, "after-05-process.png");

  // values
  await page.locator("#values").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await shoot(page, "after-06-values.png");

  // scroll-spy: contact link active when contact in view
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const spy = await page.$eval("nav[aria-label='Primary'] .v2-nav-link--active", (el) => el.textContent).catch(() => null);
  log(spy ? `PASS chromium: scroll-spy active on '${spy.trim()}'` : "WARN chromium: no scroll-spy active link at contact");
  await shoot(page, "after-07-contact.png");

  // form: empty submit -> validation errors appear, no network call
  await page.locator("#contact-form button[type=submit]").click();
  await page.waitForTimeout(400);
  const errCount = await page.$$eval(".v2-field-error", (els) => els.length);
  log(errCount >= 3 ? `PASS chromium: ${errCount} validation errors on empty submit` : `FAIL chromium: ${errCount} validation errors`);

  // CTA band + footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1100);
  await shoot(page, "after-08-cta-footer.png");
  const ctaNode = await page.$eval("#cta-node", (el) => el.classList.contains("v2-node--active")).catch(() => false);
  log(ctaNode ? "PASS chromium: terminal cta-node active at page end" : "WARN chromium: cta-node not active at page end");

  // policy + 404
  await page.goto(LOCAL + "/privacy", { waitUntil: "networkidle" });
  const pol = await page.locator("h1").first().innerText();
  log(pol.includes("Privacy") ? "PASS chromium: /privacy renders" : "FAIL chromium: /privacy broken");
  await shoot(page, "after-09-privacy.png");
  await page.goto(LOCAL + "/nope-404", { waitUntil: "networkidle" });
  const nf = await page.locator("h1").first().innerText();
  log(nf.includes("404") ? "PASS chromium: 404 page renders" : "FAIL chromium: 404 broken");

  await b.close();
  return errors;
}

/* ── Reduced motion + WebGL-blocked fallback paths ── */
async function fallbackPass() {
  const errors = [];
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  watch(page, "reduced-motion", errors);
  await page.goto(LOCAL, { waitUntil: "networkidle" });
  await page.mouse.move(700, 400);
  await page.waitForTimeout(2500);
  const canvas = await page.$("canvas");
  const fallbackImg = await page.$(".v3-stage img");
  log(!canvas && fallbackImg ? "PASS reduced-motion: flat mark fallback, no canvas" : "FAIL reduced-motion: canvas mounted or no fallback");
  const headlineVisible = await page.locator("h1").isVisible();
  log(headlineVisible ? "PASS reduced-motion: content instant" : "FAIL reduced-motion: content hidden");
  await b.close();

  const b2 = await chromium.launch({ args: ["--disable-webgl", "--disable-webgl2"] });
  const page2 = await (await b2.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  watch(page2, "no-webgl", errors);
  await page2.goto(LOCAL, { waitUntil: "networkidle" });
  await page2.mouse.move(700, 400);
  await page2.waitForTimeout(2500);
  const canvas2 = await page2.$("canvas");
  const img2 = await page2.$(".v3-stage img");
  log(!canvas2 && img2 ? "PASS no-webgl: flat mark fallback, no canvas" : "FAIL no-webgl: unexpected state");
  await b2.close();
  return errors;
}

/* ── Firefox + WebKit smoke ── */
async function engineSmoke(engine, name) {
  const errors = [];
  const b = await engine.launch();
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  watch(page, name, errors);
  await page.goto(LOCAL, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  const h1 = await page.locator("h1").first().innerText();
  log(h1.toLowerCase().includes("data partner") ? `PASS ${name}: headline renders` : `FAIL ${name}: headline missing`);
  await page.mouse.move(700, 400).catch(() => {});
  await page.waitForTimeout(4000);
  log((await page.$("canvas")) ? `PASS ${name}: 3D mounts` : `WARN ${name}: 3D did not mount (fallback should show)`);
  await shoot(page, `after-hero-${name}.png`);
  await b.close();
  return errors;
}

/* ── Mobile emulation (375-class) ── */
async function mobilePass() {
  const errors = [];
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  watch(page, "iphone13-emu", errors);
  await page.goto(LOCAL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const pills = await page.$$eval(".v3-pill", (els) => els.filter((e) => getComputedStyle(e).display !== "none").length);
  log(pills === 3 ? "PASS mobile: exactly 3 pills visible under 640px" : `FAIL mobile: ${pills} pills visible`);
  await shoot(page, "after-10-mobile-hero.png");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await shoot(page, "after-11-mobile-contact.png");
  // mobile menu focus trap smoke
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click("button[aria-label='Open menu']");
  await page.waitForTimeout(400);
  log((await page.$("#mobile-menu")) ? "PASS mobile: overlay menu opens" : "FAIL mobile: menu missing");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  log(!(await page.$("#mobile-menu")) ? "PASS mobile: Escape closes menu" : "FAIL mobile: menu did not close");
  await b.close();
  return errors;
}

/* ── Production (before) screenshots via reachable custom domain ── */
async function prodShots() {
  const b = await chromium.launch();
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  try {
    await page.goto(PROD, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3000);
    await shoot(page, "before-01-hero.png");
    for (const [i, id] of ["practices", "partnership", "how-we-work", "contact"].entries()) {
      await page.evaluate((sel) => document.getElementById(sel)?.scrollIntoView(), id);
      await page.waitForTimeout(1200);
      await shoot(page, `before-0${i + 2}-${id}.png`);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    await shoot(page, "before-06-footer.png");
    log("PASS production screenshots captured");
  } catch (e) { log("WARN production screenshots failed: " + e.message.slice(0, 120)); }
  await b.close();
}

const allErrors = [];
allErrors.push(...await chromiumPass());
allErrors.push(...await fallbackPass());
allErrors.push(...await engineSmoke(firefox, "firefox"));
allErrors.push(...await engineSmoke(webkit, "webkit"));
allErrors.push(...await mobilePass());
await prodShots();

console.log("\n=== CONSOLE/PAGE ERRORS ===");
const uniq = [...new Set(allErrors)];
console.log(uniq.length ? uniq.join("\n") : "none");
console.log("\n=== DONE ===");
