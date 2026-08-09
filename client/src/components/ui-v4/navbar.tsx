import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "./lenis-provider";

const LINKS = [
  { id: "practices", label: "Practices" },
  { id: "partners", label: "Partners" },
  { id: "process", label: "Process" },
  { id: "values", label: "Values" },
];

/**
 * Official mark, dark-background variant: same paths as logo-mark.svg with the
 * charcoal half recoloured to paper so it reads on the v4 palette.
 */
export function BrandMark({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <span className="flex items-center gap-3">
      <img src="/brand/logo-mark-dark.svg" alt="" aria-hidden="true" className={className} />
      <span className="v4-display text-[1.05rem] leading-none" style={{ letterSpacing: "0.01em" }}>
        Alpha Pro MENA
      </span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        background: scrolled ? "rgba(11,12,13,0.72)" : "transparent",
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
          aria-label="Alpha Pro MENA, back to top"
        >
          <BrandMark />
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="text-sm font-medium transition-colors"
              style={{ color: "rgba(243,242,241,0.66)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--paper)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(243,242,241,0.66)")}
            >
              {link.label}
            </button>
          ))}
          <button className="v4-pill" onClick={() => go("contact")}>
            Start a project
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="v4-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          style={{ color: "var(--paper)" }}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div
          id="v4-mobile-nav"
          className="md:hidden"
          style={{
            background: "rgba(11,12,13,0.97)",
            borderTop: "1px solid var(--line)",
            height: "calc(100svh - 4.5rem)",
          }}
        >
          <div className="flex flex-col gap-2 px-6 py-8">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className="v4-display py-3 text-left text-[2rem]"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                {link.label}
              </button>
            ))}
            <button className="v4-pill mt-6 self-start" onClick={() => go("contact")}>
              Start a project
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
