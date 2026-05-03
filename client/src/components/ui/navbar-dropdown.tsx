import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarDropdownProps {
  isLight: boolean;
  onThemeToggle: () => void;
}

export const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ isLight: _isLight, onThemeToggle: _onThemeToggle }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: 'Services',
      id: 'services',
      links: [
        { text: 'Data Governance', href: '#practices' },
        { text: 'AI Consulting & Audits', href: '#practices' },
        { text: 'Custom AI Implementation', href: '#practices' },
        { text: 'Banking & Financial Services', href: '#practices' },
        { text: 'Full-Stack Development', href: '#practices' },
      ],
    },
    {
      label: 'Partnership',
      id: 'partnership',
      links: [
        { text: 'Ataccama One', href: '#partnerships' },
        { text: 'Become a Partner', href: '#contact' },
      ],
    },
    {
      label: 'About',
      id: 'about',
      links: [
        { text: 'Our Mission', href: '#about' },
        { text: 'How We Work', href: '#how-we-work' },
        { text: 'Our Team', href: '#team' },
        { text: 'Departments', href: '#team' },
      ],
    },
    {
      label: 'Contact',
      id: 'contact',
      links: [
        { text: 'Talk to Our Experts', href: '#team' },
        { text: 'Request an Audit', href: '#contact' },
        { text: 'Get in Touch', href: '#contact' },
      ],
    },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <style>{`
        .nav-glass {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background: linear-gradient(180deg, rgba(20, 5, 10, 0.92) 0%, rgba(15, 3, 8, 0.85) 100%);
          border-bottom: 1px solid rgba(244, 63, 94, 0.12);
          box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.03) inset, 0 8px 32px -8px rgba(0, 0, 0, 0.4);
        }
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f43f5e, transparent);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::after {
          width: 70%;
        }
        .nav-cta-glow {
          box-shadow: 0 4px 20px -4px rgba(244, 63, 94, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
          transition: all 0.3s ease;
        }
        .nav-cta-glow:hover {
          box-shadow: 0 6px 28px -4px rgba(244, 63, 94, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
          transform: translateY(-1px);
        }
        .nav-dropdown {
          animation: navDropIn 0.18s ease forwards;
        }
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-6px) scaleY(0.96); }
          to   { opacity: 1; transform: translateY(0)   scaleY(1); }
        }
        .mobile-nav {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: rgba(12, 3, 6, 0.97);
          border-top: 1px solid rgba(244, 63, 94, 0.12);
        }
      `}</style>

      {/* Ambient rose glow blobs above/behind nav */}
      <div className="pointer-events-none fixed top-0 inset-x-0 h-20 z-40 overflow-hidden">
        <div style={{ position: 'absolute', left: '20%', top: '-20px', width: '320px', height: '160px', borderRadius: '50%', background: 'rgba(244,63,94,0.22)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', right: '20%', top: '-20px', width: '280px', height: '140px', borderRadius: '50%', background: 'rgba(244,63,94,0.16)', filter: 'blur(60px)' }} />
      </div>

      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="relative mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-6">

          {/* Logo */}
          <a href="#hero" className="flex items-center shrink-0">
            <img
              src="/alpha-pro-mena-logo-full.png"
              alt="Alpha Pro MENA"
              className="h-10 w-auto"
              loading="eager"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="nav-link inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200"
                  style={{
                    color: openDropdown === item.id ? '#ffffff' : 'rgba(255,255,255,0.78)',
                    background: openDropdown === item.id ? 'rgba(244,63,94,0.12)' : 'transparent',
                  }}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    strokeWidth={2.5}
                    className="opacity-60 transition-transform duration-200"
                    style={{ transform: openDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Dropdown */}
                {openDropdown === item.id && (
                  <div
                    className="nav-dropdown absolute left-0 mt-1 w-56 rounded-xl shadow-2xl z-50"
                    style={{
                      background: 'linear-gradient(180deg, rgba(22,6,12,0.97) 0%, rgba(15,3,8,0.97) 100%)',
                      border: '1px solid rgba(244,63,94,0.15)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
                    }}
                  >
                    <div className="p-3 space-y-0.5">
                      {item.links.map((link) => (
                        <a
                          key={link.text}
                          href={link.href}
                          className="block px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                          style={{ color: 'rgba(255,255,255,0.75)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.background = 'rgba(244,63,94,0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: CTA + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="nav-cta-glow hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
              }}
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ color: '#ffffff', background: mobileOpen ? 'rgba(244,63,94,0.15)' : 'transparent' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-nav md:hidden">
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    className="w-full flex items-center justify-between py-3 text-sm font-semibold uppercase tracking-widest border-b"
                    style={{ color: '#ffffff', borderColor: 'rgba(244,63,94,0.1)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.12em' }}
                    onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={2.5}
                      style={{ color: 'rgba(251,113,133,0.7)', transform: openDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    />
                  </button>
                  {openDropdown === item.id && (
                    <div className="pl-4 py-2 space-y-1">
                      {item.links.map((link) => (
                        <a
                          key={link.text}
                          href={link.href}
                          className="block py-2 text-sm"
                          style={{ color: 'rgba(255,255,255,0.65)' }}
                          onClick={closeMobile}
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="#contact"
                className="nav-cta-glow mt-4 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' }}
                onClick={closeMobile}
              >
                Get in Touch
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
