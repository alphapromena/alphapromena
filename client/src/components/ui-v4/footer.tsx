import { ArrowUp } from "lucide-react";
import { Link } from "wouter";
import { useContent } from "@/content/locale";
import { CONTACT_DIRECT, SOCIALS } from "@/content/site.shared";
import { BrandMark } from "./navbar";
import { scrollToSection } from "./lenis-provider";

const SOCIAL_LABELS: Record<string, string> = { linkedin: "LinkedIn" };

/**
 * Light footer. The oversized closing statement lives in the pre-footer dark
 * band above, so this is the quiet record: mark, locations, tagline, and the
 * legal links, which stay English and say so on the Arabic site.
 */
export function Footer() {
  const t = useContent();
  const year = new Date().getFullYear();
  const socials = Object.entries(SOCIALS).filter(([, href]) => Boolean(href)) as [string, string][];

  return (
    <footer
      className="px-6 pb-10 pt-16 lg:px-10"
      style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}
    >
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <BrandMark className="h-7 w-auto" />
            <p className="v4-body mt-4 text-[0.92rem]">{t.footer.tagline}</p>
            <p className="mt-2 text-[0.92rem]" style={{ color: "var(--ink-faint)" }}>
              {t.footer.locationsLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href={`mailto:${CONTACT_DIRECT.email}`} className="v4-link" lang="en" dir="ltr">
              {CONTACT_DIRECT.email}
            </a>
            {socials.map(([key, href]) => (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="v4-link">
                {SOCIAL_LABELS[key] ?? key}
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
            © {year} Alpha Pro MENA. {t.footer.rights}
          </p>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-6">
            {/* Legal documents are English only in every locale. */}
            <Link href="/privacy" className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {t.footer.privacy}
              {t.footer.legalLanguageNote}
            </Link>
            <Link href="/terms" className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {t.footer.terms}
              {t.footer.legalLanguageNote}
            </Link>
            <button
              onClick={() => scrollToSection("hero")}
              className="inline-flex items-center gap-1.5 text-sm"
              style={{ color: "var(--ink-soft)" }}
            >
              {t.footer.backToTop} <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
