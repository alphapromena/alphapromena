import { Link, useLocation } from "wouter";

const NAV = [
  { label: "Practices", id: "practices" },
  { label: "Partnerships", id: "partnership" },
  { label: "Process", id: "how-we-work" },
  { label: "Contact", id: "contact" },
];

const label: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 600,
  fontSize: "var(--text-mono)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

/**
 * Interlock footer: full-width charcoal band (ink to ink-deep), off-white
 * text, rose accents, dark logo mark. Shared by the home page and the
 * standalone policy pages.
 */
export function FooterV2() {
  const [location] = useLocation();
  const prefix = location === "/" ? "" : "/";
  const anchor = (id: string) => `${prefix}#${id}`;

  return (
    <footer className="band-dark">
      <div className="v2-container pt-16 pb-8">
        <div className="grid gap-12 md:grid-cols-3 pb-14">
          <div>
            <div className="flex items-center gap-3">
              <img src="/brand/logo-mark-dark.svg" alt="" className="h-8 w-auto" />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--band-text)",
                }}
              >
                Alpha Pro MENA
              </span>
            </div>
            <p className="v2-small mt-4" style={{ maxWidth: "34ch" }}>
              Data governance, enterprise AI, and banking advisory for institutions across
              the Middle East and North Africa.
            </p>
            <p className="mt-5" style={{ ...label, color: "var(--rose)" }}>
              Certified Ataccama Solution Partner, MENA
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col items-start gap-4 md:justify-self-center">
            {NAV.map((l) => (
              <a
                key={l.id}
                href={anchor(l.id)}
                className="footer-link"
                style={{ ...label, color: "var(--band-text-soft)" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-4 md:justify-self-end">
            <a
              href="mailto:info@alphapromena.com"
              style={{ ...label, textTransform: "none", letterSpacing: "0.02em", color: "var(--band-text)" }}
            >
              info@alphapromena.com
            </a>
            <span className="v2-small">Amman, Jordan</span>
            {/* Parent firm's page. Swap to a dedicated Alpha Pro MENA page once one exists. */}
            <a
              href="https://www.linkedin.com/company/alpha-pro-consulting"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...label, color: "var(--band-text-soft)" }}
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid rgba(243,242,241,0.14)" }}
        >
          <span className="v2-small">© {new Date().getFullYear()} Alpha Pro MENA. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="v2-small" style={{ color: "var(--band-text-soft)" }}>Privacy</Link>
            <Link href="/terms" className="v2-small" style={{ color: "var(--band-text-soft)" }}>Terms</Link>
            <span className="v2-small">Designed and built in Amman</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
