import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useContent, LOCALE_PATH, OTHER_LOCALE } from "@/content/locale";
import { scrollToSection } from "./lenis-provider";

/**
 * Official mark. On paper the charcoal-and-rose original reads correctly, so
 * the light theme uses logo-mark.svg rather than the dark-background variant.
 */
export function BrandMark({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <span className="flex items-center gap-3">
      <img src="/brand/logo-mark.svg" alt="" aria-hidden="true" className={className} />
      <span className="v4-display text-[1.05rem] leading-none">Alpha Pro MENA</span>
    </span>
  );
}

export function Navbar() {
  const t = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const otherPath = LOCALE_PATH[OTHER_LOCALE[t.locale]];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: scrolled ? "rgba(243,242,241,0.86)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[4.5rem] w-full max-w-[1300px] items-center justify-between px-6 lg:px-10"
      >
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            go("hero");
          }}
          aria-label={t.nav.backToTopAria}
        >
          <BrandMark />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {t.nav.links.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="v4-nav-item text-sm font-medium transition-colors"
              style={{ color: "var(--ink-soft)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
            >
              {link.label}
            </button>
          ))}
          <Link
            href={otherPath}
            className="text-sm font-semibold"
            style={{ color: "var(--ink)" }}
            hrefLang={OTHER_LOCALE[t.locale]}
          >
            {t.nav.languageToggle}
          </Link>
          <button className="v4-pill" onClick={() => go("contact")}>
            {t.nav.cta}
          </button>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="v4-mobile-nav"
          aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
          style={{ color: "var(--ink)" }}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div
          id="v4-mobile-nav"
          className="lg:hidden"
          style={{
            background: "var(--paper)",
            borderTop: "1px solid var(--line)",
            height: "calc(100svh - 4.5rem)",
            overflowY: "auto",
          }}
        >
          <div className="flex flex-col gap-1 px-6 py-8">
            {t.nav.links.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className="v4-display v4-d3 py-3 text-start"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                {link.label}
              </button>
            ))}
            <Link
              href={otherPath}
              className="v4-display v4-d3 py-3 text-start"
              style={{ borderBottom: "1px solid var(--line)" }}
              hrefLang={OTHER_LOCALE[t.locale]}
            >
              {t.nav.languageToggle}
            </Link>
            <button className="v4-pill mt-6 self-start" onClick={() => go("contact")}>
              {t.nav.cta}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
