import { ArrowUp, Mail } from "lucide-react";
import { Link } from "wouter";
import { CONTACT, SOCIALS } from "@/content/site";
import { BrandMark } from "./navbar";
import { scrollToSection } from "./lenis-provider";

/** Display label for each supported network key in SOCIALS. */
const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
};

/**
 * Oversized closing statement. The display line is the last thing a visitor
 * reads, so it carries the page's weight and the email is the only competing
 * target. Social links render only for entries that actually hold a URL.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(SOCIALS).filter(([, href]) => Boolean(href)) as [string, string][];

  return (
    <footer
      className="relative pb-10 pt-28 lg:pt-40"
      style={{ background: "var(--void)", borderTop: "1px solid var(--line)" }}
    >
      <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-10">
        <p className="v4-display" style={{ fontSize: "clamp(2.4rem, 8.4vw, 7.5rem)" }}>
          Got data worth <span className="v4-rose">governing?</span>
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
          <a href={`mailto:${CONTACT.email}`} className="v4-pill">
            <Mail className="h-4 w-4" /> {CONTACT.email}
          </a>
          {socials.map(([key, href]) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="v4-link"
            >
              {SOCIAL_LABELS[key] ?? key}
            </a>
          ))}
          <span className="text-sm" style={{ color: "rgba(243,242,241,0.42)" }}>
            {CONTACT.location}
          </span>
        </div>

        <div
          className="mt-20 flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <div className="flex flex-col gap-4">
            <BrandMark className="h-6 w-auto" />
            <p className="text-sm" style={{ color: "rgba(243,242,241,0.42)" }}>
              © {year} Alpha Pro MENA. All rights reserved. Designed and built in Amman.
            </p>
          </div>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-7">
            <Link href="/privacy" className="text-sm" style={{ color: "rgba(243,242,241,0.55)" }}>
              Privacy
            </Link>
            <Link href="/terms" className="text-sm" style={{ color: "rgba(243,242,241,0.55)" }}>
              Terms
            </Link>
            <button
              onClick={() => scrollToSection("hero")}
              className="inline-flex items-center gap-1.5 text-sm"
              style={{ color: "rgba(243,242,241,0.55)" }}
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
