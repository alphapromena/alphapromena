import { useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, Phone, ChevronRight, X, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export interface DepartmentContact {
  /** Practice / department name */
  name: string;
  /** One-line tagline shown under the name */
  tagline: string;
  /** Short paragraph describing the department */
  description: string;
  /** List of services / capabilities offered */
  services: string[];
  /** Contact email for this department */
  email: string;
  /** Primary phone number (displayed + tel: href) */
  primaryPhone: { label: string; number: string; href: string };
  /** Optional secondary phone */
  secondaryPhone?: { label: string; number: string; href: string };
  /** Brand accent colour for this department */
  accentColor: string;
  /** Icon node (lucide-react icon) */
  icon: ReactNode;
  /** Optional audit / CTA label */
  auditLabel?: string;
}

interface DepartmentContactCardProps {
  dept: DepartmentContact;
  className?: string;
}

export function DepartmentContactCard({ dept, className }: DepartmentContactCardProps) {
  const [open, setOpen] = useState(false);
  const accent = dept.accentColor;

  return (
    <>
      {/* ── Compact clickable card ───────────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
        className={cn(
          "group flex flex-col rounded-2xl bg-white overflow-hidden cursor-pointer transition-all duration-300",
          className
        )}
        style={{
          border: "1px solid rgba(0,0,0,0.09)",
          boxShadow: "0 4px 28px rgba(0,0,0,0.07)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.13), 0 0 0 2px ${accent}40`;
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 28px rgba(0,0,0,0.07)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Coloured header band */}
        <div
          className="px-6 py-5 flex items-center gap-4"
          style={{ background: `${accent}12`, borderBottom: `1px solid ${accent}22` }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: accent }}
          >
            {dept.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-base font-black uppercase tracking-tight leading-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1a1a1a", letterSpacing: "0.02em" }}
            >
              {dept.name}
            </div>
            <div className="text-xs mt-0.5 font-semibold" style={{ color: accent }}>
              {dept.tagline}
            </div>
          </div>
          <ArrowRight
            className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: accent, opacity: 0.7 }}
          />
        </div>

        {/* Preview body */}
        <div className="px-6 py-5 flex-1 flex flex-col gap-3">
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "rgba(0,0,0,0.55)" }}>
            {dept.description}
          </p>
          {/* First 3 services as preview */}
          <ul className="flex flex-col gap-1">
            {dept.services.slice(0, 3).map(s => (
              <li key={s} className="flex items-center gap-2 text-xs" style={{ color: "rgba(0,0,0,0.55)" }}>
                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: accent }} />
                {s}
              </li>
            ))}
            {dept.services.length > 3 && (
              <li className="text-xs font-semibold mt-0.5" style={{ color: accent }}>
                +{dept.services.length - 3} more services…
              </li>
            )}
          </ul>
        </div>

        {/* Click hint footer */}
        <div
          className="px-6 py-3 flex items-center justify-between text-xs font-semibold"
          style={{ borderTop: `1px solid ${accent}18`, color: accent, background: `${accent}06` }}
        >
          <span>View contact details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ── Modal overlay ────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          role="dialog"
          aria-modal="true"
          aria-label={dept.name}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          tabIndex={-1}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: "#ffffff",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
              animation: "modalIn 0.22s ease forwards",
            }}
          >
            <style>{`
              @keyframes modalIn {
                from { opacity: 0; transform: scale(0.95) translateY(12px); }
                to   { opacity: 1; transform: scale(1)    translateY(0); }
              }
            `}</style>

            {/* Modal header */}
            <div
              className="px-6 py-5 flex items-center gap-4"
              style={{ background: `${accent}10`, borderBottom: `1px solid ${accent}20` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: accent, boxShadow: `0 4px 14px ${accent}50` }}
              >
                {dept.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-lg font-black uppercase tracking-tight leading-tight"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1a1a1a" }}
                >
                  {dept.name}
                </div>
                <div className="text-xs mt-0.5 font-semibold" style={{ color: accent }}>
                  {dept.tagline}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(0,0,0,0.06)", color: "#666" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.60)" }}>
                {dept.description}
              </p>

              {/* Full services list */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                  Services & Capabilities
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {dept.services.map(s => (
                    <li key={s} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(0,0,0,0.70)" }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: accent }}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Audit CTA chip */}
              {dept.auditLabel && (
                <a
                  href={`mailto:${dept.email}?subject=Request: ${dept.auditLabel}&body=Hello, I'd like to request a ${dept.auditLabel} for my organisation.`}
                  className="inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                  style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                >
                  Request {dept.auditLabel} <ChevronRight className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Modal footer — contact actions */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <div className="flex">
                <a
                  href={`mailto:${dept.email}`}
                  className="flex items-center justify-center gap-2 flex-1 py-4 text-sm font-semibold transition-all"
                  style={{ color: "#555", borderRight: "1px solid rgba(0,0,0,0.08)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = accent;
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#555";
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Email Department
                </a>
                <a
                  href={dept.primaryPhone.href}
                  className="flex items-center justify-center gap-2 flex-1 py-4 text-sm font-semibold transition-all"
                  style={{ color: "#555" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = accent;
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#555";
                  }}
                >
                  <Phone className="w-4 h-4" />
                  {dept.primaryPhone.label}: {dept.primaryPhone.number}
                </a>
              </div>
              {dept.secondaryPhone && (
                <a
                  href={dept.secondaryPhone.href}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium transition-all"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.06)", color: "#777" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = `${accent}10`;
                    (e.currentTarget as HTMLElement).style.color = accent;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#777";
                  }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {dept.secondaryPhone.label}: {dept.secondaryPhone.number}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
