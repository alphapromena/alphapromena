import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Link, useLocation } from "wouter";

/**
 * Shared site footer used across the marketing home page and the
 * standalone policy pages (/privacy, /terms).
 *
 * Section links point at the home page anchors. When we are already on
 * the home page they behave as in-page smooth-scroll anchors (the app
 * sets `scroll-behavior: smooth`); from any other route they navigate
 * back to the home page and then scroll to the section.
 */
export function SiteFooter() {
  const [location] = useLocation();
  const prefix = location === "/" ? "" : "/";
  const anchor = (id: string) => `${prefix}#${id}`;

  const services = ["Data & Governance", "AI Consulting", "Custom AI & Platform", "Banking & Finance"];
  const company = [
    { label: "Partnership", id: "partnership" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <footer className="bg-paper-3" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="container py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <img src="/alpha-pro-mena-logo-full.png" alt="Alpha Pro MENA" className="h-9 w-auto" />
            <p className="text-soft text-[15px] leading-relaxed max-w-xs mt-4">
              The region's leading multi-practice AI and data firm — intelligence, governance, and engineering
              excellence for enterprises across MENA.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-[15px]">
              <a href="tel:+962791864006" className="link-row inline-flex items-center gap-2 text-soft"><Phone className="w-4 h-4" style={{ color: "var(--rose-ink)" }} /> +962 79 186 4006</a>
              <a href="mailto:info@alphapromena.com" className="link-row inline-flex items-center gap-2 text-soft"><Mail className="w-4 h-4" style={{ color: "var(--rose-ink)" }} /> info@alphapromena.com</a>
              <span className="inline-flex items-center gap-2 text-soft"><MapPin className="w-4 h-4" style={{ color: "var(--rose-ink)" }} /> Amman, Jordan · Saudi Arabia</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--ink)" }}>Services</div>
            <ul className="flex flex-col gap-2.5">
              {services.map(item => (
                <li key={item}><a href={anchor("practices")} className="text-[15px] text-soft hover:text-rose transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--ink)" }}>Company</div>
            <ul className="flex flex-col gap-2.5">
              {company.map(item => (
                <li key={item.id}><a href={anchor(item.id)} className="text-[15px] text-soft hover:text-rose transition-colors">{item.label}</a></li>
              ))}
              <li><a href="https://www.ataccama.com/platform" target="_blank" rel="noopener noreferrer" className="text-[15px] text-soft hover:text-rose transition-colors inline-flex items-center gap-1">Ataccama One <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://www.bakertilly.com" target="_blank" rel="noopener noreferrer" className="text-[15px] text-soft hover:text-rose transition-colors inline-flex items-center gap-1">Baker Tilly <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>
        <div className="rule mb-7" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-faint">© {new Date().getFullYear()} Alpha Pro MENA. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-sm text-faint hover:text-rose transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-faint hover:text-rose transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
