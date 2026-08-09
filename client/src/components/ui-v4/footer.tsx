import { ArrowUp, Mail } from "lucide-react";
import { Link } from "wouter";
import { scrollToSection } from "./lenis-provider";

/**
 * Oversized closing statement. The display line is the last thing a visitor
 * reads, so it carries the whole page's weight and the email is the only
 * competing target.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative pb-10 pt-28 lg:pt-40"
      style={{ background: "var(--void)", borderTop: "1px solid var(--line)" }}
    >
      <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-10">
        <p
          className="v4-display"
          style={{ fontSize: "clamp(2.4rem, 8.4vw, 7.5rem)" }}
        >
          Got data worth <span className="v4-rose">governing?</span>
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
          <a href="mailto:info@alphapromena.com" className="v4-pill">
            <Mail className="h-4 w-4" /> info@alphapromena.com
          </a>
          <a href="tel:+962791864006" className="v4-link">
            +962 79 186 4006
          </a>
        </div>

        <div
          className="mt-20 flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <p className="text-sm" style={{ color: "rgba(243,242,241,0.42)" }}>
            © {year} Alpha Pro MENA. Amman, Jordan · Saudi Arabia.
          </p>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-7">
            <Link
              href="/privacy"
              className="text-sm transition-colors"
              style={{ color: "rgba(243,242,241,0.55)" }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm transition-colors"
              style={{ color: "rgba(243,242,241,0.55)" }}
            >
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
