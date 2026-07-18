import { useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  Button,
  ButtonLink,
  CardV2,
  Eyebrow,
  FooterV2,
  HeroV2,
  LineageNode,
  LineageThread,
  NavbarV2,
  Section,
} from "@/components/ui-v2";

/* The thread's route through the page, in document order (Phase 4). */
const WAYPOINTS = [
  "thread-origin",
  "process-node-0",
  "process-node-1",
  "process-node-2",
  "process-node-3",
  "process-node-4",
  "process-node-5",
  "contact-node",
  "cta-node",
];

/* ── Content ────────────────────────────────────────────────────── */

const PRACTICES = [
  {
    id: "data",
    index: "01",
    title: "Data Governance & Intelligence",
    sub: "Powered by Ataccama One",
    body: "Ataccama's only certified Solution Partner across MENA. We deploy Ataccama One to catalogue, govern, and enforce quality across your entire data estate, from lineage to regulatory compliance.",
    chips: ["Data catalog & lineage", "Data quality", "Master data", "Regulatory compliance"],
    formValue: "Data Governance & Intelligence",
  },
  {
    id: "ai",
    index: "02",
    title: "Enterprise AI & Platform Development",
    sub: "From audit to production",
    body: "Strategy first, then production. We run AI readiness assessments and model audits, then design, build, and operate custom AI systems and the platforms that power them.",
    chips: ["AI strategy & audits", "Custom ML development", "MLOps & lifecycle", "Cloud-native platforms"],
    formValue: "Enterprise AI & Platform Development",
  },
  {
    id: "banking",
    index: "03",
    title: "Banking & Finance Advisory",
    sub: "For regulated institutions",
    body: "Precision solutions for banks, insurers, and financial institutions. We deliver risk models, fraud detection, regulatory reporting, and core banking integrations built for supervisory scrutiny.",
    chips: ["Credit risk & scoring", "Fraud detection & AML", "Regulatory reporting", "Open banking APIs"],
    formValue: "Banking & Finance Advisory",
  },
];

const PARTNERS = [
  {
    name: "Ataccama",
    record: "Region / MENA · Status / Certified Solution Partner · Scope / Data governance",
    sentence:
      "We deploy Ataccama One, the unified data management platform, for governance, quality, catalog, and master data across the region's most demanding enterprises.",
    link: "https://www.ataccama.com/platform",
    linkLabel: "Explore Ataccama One",
  },
  {
    name: "Baker Tilly",
    record: "Region / MENA · Status / Strategic alliance · Scope / Audit, tax & advisory",
    sentence:
      "In alliance with Baker Tilly, we pair AI and data engineering with assurance and financial advisory depth for regulated institutions.",
    link: "https://www.bakertilly.com",
    linkLabel: "Explore Baker Tilly",
  },
];

const PROCESS = [
  { step: "STEP 01", label: "Discovery", desc: "A structured session to understand your data landscape, AI maturity, and objectives." },
  { step: "STEP 02", label: "Roadmap", desc: "A tailored roadmap with milestones, technology recommendations, and ROI projections." },
  { step: "STEP 03", label: "Architecture", desc: "Data models, AI pipelines, integrations, and governance designed up front." },
  { step: "STEP 04", label: "Sprints", desc: "Engineering ships in sprints with continuous visibility and weekly reviews." },
  { step: "STEP 05", label: "UAT & go-live", desc: "Rigorous testing and a managed go-live ensure production readiness." },
  { step: "STEP 06", label: "Support", desc: "Ongoing support, monitoring, and continuous improvement as you scale." },
];

const VALUES = [
  { title: "Trust and integrity", line: "The highest standards of transparency and accountability in every engagement." },
  { title: "Deep expertise", line: "Years of domain knowledge across AI, data, finance, and engineering." },
  { title: "Execution speed", line: "Fast without cutting corners. Production outcomes on enterprise timelines." },
  { title: "Client partnership", line: "We embed with your teams and measure success by your outcomes." },
  { title: "MENA focus", line: "Regional knowledge, regulatory awareness, and a network built over years." },
  { title: "Innovation first", line: "At the frontier of AI and data, so clients always have what is next." },
];

const ROUTING = [
  { label: "Data governance", practice: "Data Governance & Intelligence" },
  { label: "Banking & finance", practice: "Banking & Finance Advisory" },
  { label: "Enterprise AI", practice: "Enterprise AI & Platform Development" },
];

const PRACTICE_OPTIONS = [...PRACTICES.map((p) => p.formValue), "General inquiry"];

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.email("Valid email required"),
  inquiryType: z.string().min(1, "Select a practice"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

/* ── Helpers ────────────────────────────────────────────────────── */

/* Label voice: Barlow 600 uppercase (kit) */
const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-mono)",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

function PracticeDetail({
  practice,
  onEnquire,
}: {
  practice: (typeof PRACTICES)[number];
  onEnquire: (formValue: string) => void;
}) {
  return (
    <div>
      <p style={{ ...monoLabel, color: "var(--rose-deep)" }}>{practice.sub}</p>
      <p className="v2-body mt-4" style={{ maxWidth: "52ch" }}>{practice.body}</p>
      <div className="flex flex-wrap gap-2 mt-6">
        {practice.chips.map((c) => (
          <span key={c} className="v2-chip">{c}</span>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="outline" onClick={() => onEnquire(practice.formValue)}>
          Get in touch <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

export default function Home() {
  const [activePractice, setActivePractice] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<number>(0);

  /* Waypoints light up as the thread head passes them, and stay lit. */
  const [litNodes, setLitNodes] = useState<ReadonlySet<string>>(new Set());
  const onNodeActivate = useCallback((id: string) => {
    setLitNodes((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);
  const lit = useCallback((id: string) => litNodes.has(id), [litNodes]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: "" },
  });
  const submitContact = trpc.contact.submit.useMutation();
  const onSubmit = (data: ContactForm) => submitContact.mutate(data);

  /* Practice CTAs land on the form with the practice preselected. */
  const enquire = useCallback(
    (formValue: string) => {
      setValue("inquiryType", formValue, { shouldValidate: false });
      scrollTo("contact");
    },
    [setValue, scrollTo],
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <LineageThread waypoints={WAYPOINTS} onActivate={onNodeActivate} />
      <NavbarV2 />

      <main id="main" className="flex-1">
        <HeroV2 />

        {/* ══ PRACTICES ═══════════════════════════════════════════ */}
        <Section id="practices" className="overflow-hidden">
          <div className="relative z-[1]">
            <Eyebrow index="CATALOG / 01">Practices</Eyebrow>
            <h2 className="v2-h2 mt-5" style={{ maxWidth: "24ch" }}>
              Three practices, one accountable partner.
            </h2>

            {/* Desktop: index list + swapping detail panel */}
            <div className="hidden md:grid md:grid-cols-12 gap-12 mt-14">
              <div
                className="md:col-span-5"
                role="tablist"
                aria-label="Practices"
                aria-orientation="vertical"
                onKeyDown={(e) => {
                  const move = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                  const jump = e.key === "Home" ? 0 : e.key === "End" ? PRACTICES.length - 1 : -1;
                  if (!move && jump < 0) return;
                  e.preventDefault();
                  const next = jump >= 0 ? jump : (activePractice + move + PRACTICES.length) % PRACTICES.length;
                  setActivePractice(next);
                  document.getElementById(`practice-tab-${PRACTICES[next].id}`)?.focus();
                }}
              >
                {PRACTICES.map((p, i) => {
                  const active = activePractice === i;
                  return (
                    <button
                      key={p.id}
                      role="tab"
                      aria-selected={active}
                      id={`practice-tab-${p.id}`}
                      aria-controls="practice-panel"
                      className="w-full flex items-center gap-5 text-left py-6"
                      style={{ borderTop: "1px solid var(--line)" }}
                      onClick={() => setActivePractice(i)}
                      onMouseEnter={() => setActivePractice(i)}
                    >
                      <LineageNode active={active} />
                      <span style={{ ...monoLabel, color: active ? "var(--rose-deep)" : "var(--ink-faint)" }}>
                        {p.index}
                      </span>
                      <span
                        className="v2-h3 transition-colors"
                        style={{ color: active ? "var(--ink)" : "var(--ink-faint)", transitionDuration: "var(--dur-fast)" }}
                      >
                        {p.title}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div
                className="md:col-span-7 pt-6"
                id="practice-panel"
                role="tabpanel"
                aria-labelledby={`practice-tab-${PRACTICES[activePractice].id}`}
              >
                <div key={activePractice} className="v2-swap">
                  <PracticeDetail practice={PRACTICES[activePractice]} onEnquire={enquire} />
                </div>
              </div>
            </div>

            {/* Mobile: stacked accordion */}
            <div className="md:hidden mt-10">
              {PRACTICES.map((p, i) => {
                const open = mobileOpen === i;
                return (
                  <div key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
                    <button
                      className="w-full flex items-center gap-4 text-left py-5"
                      aria-expanded={open}
                      aria-controls={`practice-detail-${p.id}`}
                      onClick={() => setMobileOpen(open ? -1 : i)}
                    >
                      <LineageNode active={open} />
                      <span style={{ ...monoLabel, color: open ? "var(--rose-deep)" : "var(--ink-faint)" }}>{p.index}</span>
                      <span className="v2-h3 flex-1" style={{ color: open ? "var(--ink)" : "var(--ink-faint)" }}>
                        {p.title}
                      </span>
                    </button>
                    {open && (
                      <div id={`practice-detail-${p.id}`} className="v2-swap pb-7">
                        <PracticeDetail practice={p} onEnquire={enquire} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ══ PARTNERSHIPS ─ charcoal band ════════════════════════ */}
        <Section id="partnership" className="band-dark overflow-hidden">
          <div className="relative z-[1]">
            <Eyebrow index="REGISTRY">Partnerships</Eyebrow>
            <h2 className="v2-h2 mt-5" style={{ maxWidth: "22ch" }}>
              Certified, on the record.
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-14">
              {PARTNERS.map((p) => (
                <CardV2 key={p.name} interactive className="p-8 lg:p-10 flex flex-col">
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.75rem",
                      letterSpacing: "-0.005em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                    }}
                  >
                    {p.name}
                  </div>
                  <p className="mt-3" style={{ ...monoLabel, color: "var(--ink-faint)", lineHeight: 1.8 }}>
                    {p.record}
                  </p>
                  <p className="mt-5 flex-1" style={{ fontSize: "var(--text-body)", lineHeight: 1.65, color: "var(--ink-soft)" }}>
                    {p.sentence}
                  </p>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-7 self-start"
                    style={{ ...monoLabel, color: "var(--rose-deep)" }}
                  >
                    {p.linkLabel} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </CardV2>
              ))}
            </div>
          </div>
        </Section>

        {/* ══ PROCESS ─ steps on the thread ═══════════════════════ */}
        <Section id="how-we-work">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Eyebrow index="LINEAGE">Process</Eyebrow>
                <h2 className="v2-h2 mt-5">A structured engagement.</h2>
                <p className="v2-body mt-5" style={{ maxWidth: "38ch" }}>
                  Six stages, each with a clear gate. Enterprise clients see status, spend, and
                  risk at every step.
                </p>
              </div>
            </div>
            <div className="lg:col-span-8">
              {/* The SVG thread is the connecting line between these nodes. */}
              {PROCESS.map((p, i) => (
                <div key={p.step} className="flex gap-6">
                  <LineageNode id={`process-node-${i}`} active={lit(`process-node-${i}`)} className="mt-1" />
                  <div className={i < PROCESS.length - 1 ? "pb-12" : ""} style={{ marginTop: "-4px" }}>
                    <p style={{ ...monoLabel, color: "var(--rose-deep)" }}>{p.step}</p>
                    <h3 className="v2-h3 mt-2">{p.label}</h3>
                    <p className="v2-small mt-2" style={{ maxWidth: "52ch" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══ VALUES ══════════════════════════════════════════════ */}
        <Section id="values" style={{ background: "var(--surface)" }}>
          <Eyebrow index="CATALOG / 02">How we work</Eyebrow>
          <h2 className="v2-h2 mt-5">Six working principles.</h2>
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 mt-14"
            style={{ gap: "1px", background: "var(--line)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}
          >
            {VALUES.map((v) => (
              <div key={v.title} className="p-7" style={{ background: "var(--surface)" }}>
                <div className="font-semibold" style={{ color: "var(--ink)" }}>{v.title}</div>
                <p className="v2-small mt-2">{v.line}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ══ CONTACT ═════════════════════════════════════════════ */}
        <Section id="contact">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4">
                <LineageNode id="contact-node" active={lit("contact-node")} />
                <Eyebrow>Open a record</Eyebrow>
              </div>
              <h2 className="v2-h2 mt-5">Start the conversation.</h2>
              <p className="v2-body mt-5" style={{ maxWidth: "40ch" }}>
                Tell us about your challenge. We reply within one business day.
              </p>
              <a
                href="mailto:info@alphapromena.com"
                className="inline-block mt-6"
                style={{ ...monoLabel, textTransform: "none", letterSpacing: "0.02em", color: "var(--rose-deep)" }}
              >
                info@alphapromena.com
              </a>

              {/* Department routing rows: preselect the practice in the form */}
              <div className="mt-10">
                {ROUTING.map((r) => (
                  <button
                    key={r.label}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                    style={{ borderTop: "1px solid var(--line)" }}
                    onClick={() => {
                      setValue("inquiryType", r.practice, { shouldValidate: false });
                      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    <span style={{ ...monoLabel, color: "var(--ink)" }}>{r.label}</span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--rose)" }}
                    />
                  </button>
                ))}
                <div style={{ borderTop: "1px solid var(--line)" }} />
              </div>
            </div>

            <div className="lg:col-span-7" id="contact-form">
              {submitContact.isSuccess ? (
                <CardV2 className="p-10">
                  <LineageNode active />
                  <h3 className="v2-h3 mt-5">Message sent.</h3>
                  <p className="v2-body mt-2">We reply within one business day.</p>
                </CardV2>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-x-6 gap-y-6" noValidate>
                  <div className="flex flex-col gap-2">
                    <label className="v2-label" htmlFor="f-name">Full name</label>
                    <input id="f-name" className="v2-field" placeholder="Jane Smith" autoComplete="name" {...register("name")} />
                    {errors.name && <span className="v2-field-error">{errors.name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="v2-label" htmlFor="f-company">Company</label>
                    <input id="f-company" className="v2-field" placeholder="Acme Corp" autoComplete="organization" {...register("company")} />
                    {errors.company && <span className="v2-field-error">{errors.company.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="v2-label" htmlFor="f-email">Email</label>
                    <input id="f-email" type="email" className="v2-field" placeholder="jane@company.com" autoComplete="email" {...register("email")} />
                    {errors.email && <span className="v2-field-error">{errors.email.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="v2-label" htmlFor="f-practice">Practice</label>
                    <select id="f-practice" className="v2-field" {...register("inquiryType")}>
                      <option value="" disabled>Select a practice</option>
                      {PRACTICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.inquiryType && <span className="v2-field-error">{errors.inquiryType.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="v2-label" htmlFor="f-message">Message</label>
                    <textarea id="f-message" className="v2-field" rows={4} placeholder="Tell us about your challenge or project" {...register("message")} />
                    {errors.message && <span className="v2-field-error">{errors.message.message}</span>}
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-3">
                    <div>
                      <Button variant="rose" type="submit" disabled={submitContact.isPending}>
                        {submitContact.isPending ? "Sending" : "Send message"}
                        {!submitContact.isPending && <ArrowRight className="w-4 h-4" />}
                      </Button>
                    </div>
                    {submitContact.isError && (
                      <p className="v2-field-error">
                        Could not send your message. Try again, or email{" "}
                        <a href="mailto:info@alphapromena.com" style={{ textDecoration: "underline" }}>
                          info@alphapromena.com
                        </a>{" "}
                        directly.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </Section>

        {/* ══ CTA BAND ─ charcoal, the thread terminates here ═════ */}
        <section className="band-dark relative overflow-hidden">
          <div className="v2-container relative z-[1] py-24 sm:py-28">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex items-center gap-5">
                <LineageNode id="cta-node" active={lit("cta-node")} />
                <h2 className="v2-h2" style={{ maxWidth: "18ch" }}>Start with a discovery call.</h2>
              </div>
              <Button variant="rose" onClick={() => scrollTo("contact")} className="shrink-0">
                Book a discovery call <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <FooterV2 />
    </div>
  );
}
