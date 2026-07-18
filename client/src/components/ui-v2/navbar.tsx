import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ButtonLink } from "./button";

const LINKS = [
  { label: "Practices", id: "practices" },
  { label: "Partnerships", id: "partnership" },
  { label: "Process", id: "how-we-work" },
  { label: "Contact", id: "contact" },
];

/**
 * Interlock navbar: fixed, transparent over the hero, gains a paper/85
 * backdrop blur after 40px of scroll. Real brand mark beside the
 * wordmark. Mobile: full-screen overlay menu, focus-trapped, closed on
 * Escape or link click.
 */
export function NavbarV2() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // On the home page use in-page hash anchors (smooth scroll); from any
  // other route navigate back to the home page section.
  const prefix = location === "/" ? "" : "/";
  const anchor = (id: string) => `${prefix}#${id}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Focus trap + scroll lock while the mobile menu is open. */
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;

    const focusables = () =>
      Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={`v2-nav ${scrolled ? "v2-nav--scrolled" : ""}`}>
        <div className="v2-container flex items-center justify-between" style={{ height: "72px" }}>
          <Link href="/" className="v2-wordmark">
            <img src="/brand/logo-mark.svg" alt="" className="h-7 w-auto" />
            Alpha Pro MENA
          </Link>

          <nav className="hidden md:flex items-center" style={{ gap: "var(--space-8)" }} aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.id} href={anchor(l.id)} className="v2-nav-link">{l.label}</a>
            ))}
            <ButtonLink href={anchor("contact")} variant="rose" style={{ padding: "10px 22px" }}>
              Book a call
            </ButtonLink>
          </nav>

          <button
            ref={toggleRef}
            className="md:hidden inline-flex items-center justify-center w-10 h-10"
            style={{ color: "var(--ink)" }}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {open && (
        <div ref={menuRef} id="mobile-menu" className="v2-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="v2-container flex items-center justify-between" style={{ height: "72px" }}>
            <span className="v2-wordmark">
              <img src="/brand/logo-mark.svg" alt="" className="h-7 w-auto" />
              Alpha Pro MENA
            </span>
            <button
              className="inline-flex items-center justify-center w-10 h-10"
              style={{ color: "var(--ink)" }}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="v2-container flex flex-col justify-center flex-1 pb-16" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.id} href={anchor(l.id)} className="v2-menu-link" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="mt-8">
              <ButtonLink href={anchor("contact")} variant="rose" onClick={() => setOpen(false)}>
                Book a call
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
