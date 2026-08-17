import { chromium } from "playwright";
import fs from "node:fs/promises";

// 127.0.0.1 rather than localhost: another dev server may hold the IPv6
// loopback on the same port, and "localhost" resolves to ::1 first.
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
    .then(() => page.waitForTimeout(550));

const topOf = (page, id) =>
  page.evaluate((s) => {
    const el = document.getElementById(s);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, id);

const browser = await chromium.launch();
const errors = [];

for (const locale of ["en", "ar"]) {
  const path = locale === "en" ? "/" : "/ar";

  for (const [label, width, height] of [
    ["1440", 1440, 900],
    ["390", 390, 844],
    ["380", 380, 800],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on("pageerror", (e) => errors.push(`[${locale}/${label}] ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[${locale}/${label}] ${m.text()}`);
    });

    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);

    for (const [shot, id] of [
      ["01-hero", null],
      ["02-convictions", "context"],
      ["03-practices", "practices"],
      ["04-agentic", "agentic"],
      ["05-assessment", "assessment"],
      ["06-build", "build"],
      ["07-platform", "platform"],
      ["08-proof", "proof"],
      ["09-partners", "partners"],
      ["10-contact", "contact"],
    ]) {
      await jump(page, id ? await topOf(page, id) + 40 : 0);
      await page.screenshot({ path: `${OUT}/${locale}-${label}-${shot}.png` });
    }

    if (label === "1440") {
      const audit = await page.evaluate(() => {
        const root = document.documentElement;
        // No Arabic text may be letter-spaced or uppercased.
        const offenders = [];
        for (const el of document.querySelectorAll("*")) {
          const text = el.textContent ?? "";
          if (!/[؀-ۿ]/.test(text)) continue;
          if (el.children.length > 0) continue;
          const cs = getComputedStyle(el);
          const ls = parseFloat(cs.letterSpacing);
          if ((Number.isFinite(ls) && ls !== 0) || cs.textTransform === "uppercase") {
            offenders.push(`${el.tagName}.${el.className}: ls=${cs.letterSpacing} tt=${cs.textTransform}`);
          }
        }
        return {
          lang: root.lang,
          dir: root.dir,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content ?? "",
          bands: document.querySelectorAll(".v4-band").length,
          alternates: [...document.querySelectorAll('link[rel="alternate"]')].map(
            (l) => `${l.hreflang}:${new URL(l.href).pathname}`,
          ),
          arabicTypeOffenders: offenders,
          gartner: document.body.innerText.includes("Gartner does not endorse any vendor"),
          forrester: document.body.innerText.includes("Forrester Consulting (2024)"),
          disclaimer: document.body.innerText.includes(
            "Organizations shown are customers of Ataccama",
          ),
          onlyCertified: document.documentElement.outerHTML.includes("only certified"),
          offices: [...document.querySelectorAll("#contact li")].some((li) =>
            /Muscat|مسقط/.test(li.textContent ?? ""),
          ),
          // Company channels, so both assert the published values rather than
          // any link of the right kind.
          mailto: !!document.querySelector('a[href^="mailto:info@"]'),
          tel: !!document.querySelector('a[href^="tel:+962"]'),
          railStops: document.querySelectorAll("#build li").length,
        };
      });

      check(`[${locale}] lang and dir`, audit.lang === locale && audit.dir === (locale === "ar" ? "rtl" : "ltr"), `${audit.lang}/${audit.dir}`);
      check(`[${locale}] exactly two dark bands`, audit.bands === 2, String(audit.bands));
      check(`[${locale}] hreflang en, ar, x-default`, ["en:/", "ar:/ar", "x-default:/"].every((a) => audit.alternates.includes(a)), audit.alternates.join(" "));
      check(`[${locale}] no letter-spaced or uppercased Arabic`, audit.arabicTypeOffenders.length === 0, audit.arabicTypeOffenders.slice(0, 3).join(" | "));
      check(`[${locale}] Gartner attribution verbatim`, audit.gartner);
      check(`[${locale}] Forrester attribution verbatim`, audit.forrester);
      check(`[${locale}] customers disclaimer verbatim`, audit.disclaimer);
      check(`[${locale}] "only certified" absent from served output`, !audit.onlyCertified);
      check(`[${locale}] offices rendered with Muscat`, audit.offices);
      check(`[${locale}] company email and phone links present`, audit.mailto && audit.tel);
      check(`[${locale}] build rail has five stops`, audit.railStops === 5, String(audit.railStops));
      // The Arabic title leads with Latin "Agentic AI" by policy, so assert on the
      // Arabic that follows it rather than on a term now held in Latin.
      check(
        `[${locale}] localized title`,
        locale === "ar"
          ? /[؀-ۿ]/.test(audit.title) && /Agentic AI/.test(audit.title)
          : /Built to Run/i.test(audit.title),
        audit.title,
      );
      check(`[${locale}] localized description`, locale === "ar" ? /Ataccama/.test(audit.description) && /الشريك/.test(audit.description) : /Preferred Partner/.test(audit.description));

      // Form: localized labels, canonical English submitted values.
      await jump(page, await topOf(page, "contact"));
      const form = await page.evaluate(() => {
        const opts = [...document.querySelectorAll("#v4-inquiry option")].map((o) => ({
          v: o.value,
          t: o.textContent.trim(),
        }));
        return {
          options: opts,
          nameLabel: document.querySelector('label[for="v4-name"]')?.textContent?.trim(),
        };
      });
      const values = form.options.map((o) => o.v).filter(Boolean);
      check(
        `[${locale}] submitted values stay canonical English`,
        values.every((v) => /^[\x20-\x7E]+$/.test(v)) &&
          values.includes("Agentic AI") &&
          values.includes("Free AI assessment") &&
          values.includes("General inquiry"),
        values.join(" | "),
      );
      check(
        `[${locale}] form labels localize`,
        locale === "ar" ? /[؀-ۿ]/.test(form.nameLabel ?? "") : form.nameLabel === "Full name",
        form.nameLabel ?? "",
      );

      const trpc = [];
      page.on("request", (r) => r.url().includes("/api/trpc") && trpc.push(r.postData()));
      await page.locator("#v4-name").fill("Jane Smith");
      await page.locator("#v4-company").fill("Acme Corp");
      await page.locator("#v4-email").fill("jane@acme.com");
      await page.locator("#v4-inquiry").selectOption("Agentic AI");
      await page.locator("#v4-message").fill("We are planning our first production agent this quarter.");
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(2200);
      check(
        `[${locale}] submit fires tRPC with English inquiryType`,
        trpc.length > 0 && (trpc[0] ?? "").includes("Agentic AI"),
        (trpc[0] ?? "").slice(0, 90),
      );
      const status = (await page.locator("[role='status']").allTextContents()).join("").trim();
      check(`[${locale}] result announced in aria-live status`, status.length > 0, status.slice(0, 60));
    }

    await page.close();
  }
}

// Reduced motion, English only: the paths are shared.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const rm = await page.evaluate(() => ({
    heroHeight: document.getElementById("hero")?.getBoundingClientRect().height ?? 0,
    viewport: window.innerHeight,
    canvas: !!document.querySelector("#hero canvas"),
    videos: document.querySelectorAll("video").length,
    lenis: !!window.__lenis,
  }));
  check("reduced motion collapses the hero pin", Math.abs(rm.heroHeight - rm.viewport) < 40 && !rm.canvas, JSON.stringify(rm));
  check("reduced motion mounts no section loops", rm.videos === 0, String(rm.videos));
  check("reduced motion leaves smooth scrolling off", !rm.lenis);
  await page.close();
}

await browser.close();

console.log("");
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  >> " + r.detail}`);
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
console.log(errors.length ? `\nPAGE ERRORS:\n${[...new Set(errors)].join("\n")}` : "\nno page errors");
process.exit(failed ? 1 : 0);
