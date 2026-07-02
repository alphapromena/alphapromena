import React, { useEffect, useState } from 'react';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { useLocation } from 'wouter';

interface NavbarDropdownProps {
  isLight?: boolean;
  onThemeToggle?: () => void;
}

const navItems = [
  {
    label: 'Services',
    id: 'services',
    links: [
      { text: 'Data Governance', href: '#practices' },
      { text: 'AI Consulting & Audits', href: '#practices' },
      { text: 'Custom AI Implementation', href: '#practices' },
      { text: 'Banking & Financial Services', href: '#practices' },
    ],
  },
  {
    label: 'Partnership',
    id: 'partnership',
    links: [
      { text: 'Ataccama One', href: '#partnership' },
      { text: 'Become a Partner', href: '#contact' },
    ],
  },
  {
    label: 'About',
    id: 'about',
    links: [
      { text: 'Our Mission', href: '#about' },
      { text: 'How We Work', href: '#how-we-work' },
      { text: 'Departments', href: '#team' },
    ],
  },
  { label: 'Contact', id: 'contact', links: [] as { text: string; href: string }[] },
];

export const NavbarDropdown: React.FC<NavbarDropdownProps> = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  // On the home page, use in-page hash anchors (smooth-scroll). On any
  // other route (e.g. /privacy, /terms) prefix with "/" so the links
  // navigate back to the home page and then scroll to the section.
  const prefix = location === '/' ? '' : '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(251,250,247,0.82)' : 'rgba(251,250,247,0.5)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <div className="relative mx-auto max-w-[1320px] px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href={`${prefix}#hero`} className="flex items-center shrink-0">
          <img src="/alpha-pro-mena-logo-full.png" alt="Alpha Pro MENA" className="h-8 w-auto" loading="eager" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.links.length ? item.id : null)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={`${prefix}#${item.id === 'services' ? 'practices' : item.id}`}
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors"
                style={{ color: openDropdown === item.id ? 'var(--ink)' : 'var(--ink-soft)' }}
              >
                {item.label}
                {item.links.length > 0 && (
                  <ChevronDown
                    size={14}
                    strokeWidth={2.4}
                    className="opacity-50 transition-transform duration-200"
                    style={{ transform: openDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                )}
              </a>

              {openDropdown === item.id && item.links.length > 0 && (
                <div
                  className="absolute left-0 mt-1 w-60 rounded-2xl p-2 z-50"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-lg)' }}
                >
                  {item.links.map((link) => (
                    <a
                      key={link.text}
                      href={`${prefix}${link.href}`}
                      className="block px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors"
                      style={{ color: 'var(--ink-soft)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.background = 'var(--paper-2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-soft)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a href={`${prefix}#contact`} className="btn-pill btn-primary hidden md:inline-flex" style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}>
            Get in Touch <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </a>
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
            style={{ color: 'var(--ink)', background: mobileOpen ? 'var(--paper-2)' : 'transparent' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden" style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
          <div className="px-6 py-4 flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`${prefix}#${item.id === 'services' ? 'practices' : item.id}`}
                className="flex items-center justify-between py-3.5 text-[15px] font-semibold border-b"
                style={{ color: 'var(--ink)', borderColor: 'var(--line-soft)' }}
                onClick={closeMobile}
              >
                {item.label}
                <ArrowRight className="h-4 w-4" style={{ color: 'var(--rose-ink)' }} />
              </a>
            ))}
            <a href={`${prefix}#contact`} className="btn-pill btn-primary mt-5 w-full" onClick={closeMobile}>
              Get in Touch <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
