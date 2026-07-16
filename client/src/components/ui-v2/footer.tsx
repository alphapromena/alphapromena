import { Link, useLocation } from "wouter";

const NAV = [
  { label: "Practices", id: "practices" },
  { label: "Partnerships", id: "partnership" },
  { label: "Process", id: "how-we-work" },
  { label: "Contact", id: "contact" },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-mono)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

/**
 * Lineage footer: three columns over a hairline bottom bar. Shared by the
 * home page and the standalone policy pages.
 */
export function FooterV2() {
  const [location] = useLocation();
  const prefix = location === "/" ? "" : "/";
  const anchor = (id: string) => `${prefix}#${id}`;

  return (
    <footer style={{ background: "var(--ink-900)", borderTop: "1px solid var(--line)" }}>
      <div className="v2-container pt-16 pb-8">
        <div className="grid gap-12 md:grid-cols-3 pb-14">
          <div>
            <div className="v2-wordmark">Alpha Pro MENA</div>
            <p className="v2-small mt-4" style={{ maxWidth: "34ch" }}>
              Data governance, enterprise AI, and banking advisory for institutions across
              the Middle East and North Africa.
            </p>
            <p className="mt-5" style={{ ...mono, color: "var(--brass-500)" }}>
              Certified Ataccama Solution Partner, MENA
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col items-start gap-4 md:justify-self-center">
            {NAV.map((l) => (
              <a key={l.id} href={anchor(l.id)} className="v2-nav-link">{l.label}</a>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-4 md:justify-self-end">
            <a href="mailto:info@alphapromena.com" className="v2-nav-link" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
              info@alphapromena.com
            </a>
            <span className="v2-small">Amman, Jordan</span>
            {/* Parent firm's page. Swap to a dedicated Alpha Pro MENA page once one exists. */}
            <a
              href="https://www.linkedin.com/company/alpha-pro-consulting"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-nav-link"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <span style={{ ...mono, textTransform: "none", color: "var(--sand-400)" }}>
            © {new Date().getFullYear()} Alpha Pro MENA. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="v2-nav-link" style={{ textTransform: "none", letterSpacing: "0.02em" }}>Privacy</Link>
            <Link href="/terms" className="v2-nav-link" style={{ textTransform: "none", letterSpacing: "0.02em" }}>Terms</Link>
            <span style={{ ...mono, textTransform: "none", color: "var(--sand-400)" }}>Designed and built in Amman</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
