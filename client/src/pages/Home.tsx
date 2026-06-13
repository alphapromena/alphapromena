import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight, X, ExternalLink, Check,
  Database, Brain, Cpu, Building2, Globe, ArrowUpRight,
  TrendingUp, Shield, Users, Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NavbarDropdown } from "@/components/ui/navbar-dropdown";

/* ── Asset URLs ─────────────────────────────────────────────────── */
const HERO_BG     = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/hero-dark-cinematic-V6ChsH2WWVArr5voDyBZy9.webp";
const BANKING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/banking-finance-visual-RHzeNFLAucjXwQSP2VhPcg.webp";
const DATA_IMG    = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/data-governance-visual-bDPCBPBmZbZaGw7DULtTUs.webp";
const DEV_IMG     = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/fullstack-dev-visual-HAc54YqGJnrqHAgCfyzEC.webp";

/* ── Motion ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

/* ── Counter ────────────────────────────────────────────────────── */
function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick); else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{Math.round(val).toLocaleString()}{suffix}</span>;
}

/* ── Section ────────────────────────────────────────────────────── */
function Section({ id, children, className = "", style }: { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.section id={id} ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className} style={style}>
      {children}
    </motion.section>
  );
}

/* ── Data ───────────────────────────────────────────────────────── */
const NAV = [
  { id: "practices", label: "Services" },
  { id: "partnership", label: "Partnership" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const PRACTICES = [
  {
    id: "data",
    tab: "Data & Governance",
    headline: "Data Governance & Intelligence",
    sub: "Powered by Ataccama One",
    body: "Alpha Pro MENA is Ataccama's only certified Solution Partner across the Middle East and North Africa. We help enterprises take full control of their data estate — from cataloguing and lineage to quality enforcement and regulatory compliance — by deploying the industry's leading data governance platform at the scale your organisation demands.",
    img: DATA_IMG,
    badge: "Exclusive MENA Partner",
    link: "https://www.ataccama.com/platform",
    linkLabel: "Explore Ataccama One",
    features: ["Data Catalog & Lineage", "Data Quality Rules", "Master Data Management", "Regulatory Compliance", "Data Mesh Architecture", "Metadata Management"],
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "ai-consulting",
    tab: "AI Consulting",
    headline: "AI Consulting & Audits",
    sub: "Strategy. Readiness. Accountability.",
    body: "Before you build, you need clarity. Our AI consulting practice delivers executive-level strategy, AI readiness assessments, model audits, and ethical AI governance frameworks — so your AI investments are grounded, defensible, and aligned with business outcomes.",
    img: HERO_BG,
    badge: "Advisory Practice",
    link: null,
    linkLabel: null,
    features: ["AI Strategy & Roadmapping", "Readiness Assessments", "Model Audits & Explainability", "Ethical AI Frameworks", "Risk & Compliance Reviews", "Executive Workshops"],
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: "ai-implementation",
    tab: "Custom AI & Platforms",
    headline: "Custom AI Solutions & Platform Development",
    sub: "From prototype to production — end to end.",
    body: "We design, build, and deploy custom AI and machine learning solutions alongside the full-stack platforms that power them. From NLP pipelines and computer vision to cloud-native backends, high-performance APIs, and polished React frontends — we deliver production-grade software that scales with your ambitions.",
    img: DEV_IMG,
    badge: "Engineering Practice",
    link: null,
    linkLabel: null,
    features: ["Custom ML Development", "NLP & Conversational AI", "Computer Vision", "MLOps & Lifecycle", "Cloud-Native Architecture", "React / Next.js Frontends"],
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "banking",
    tab: "Banking & Finance",
    headline: "Banking & Financial Services",
    sub: "Precision solutions for regulated industries.",
    body: "Financial institutions face unique pressures: regulatory scrutiny, legacy infrastructure, and the relentless pace of fintech disruption. Our Banking & Finance practice delivers AI-powered risk models, fraud detection systems, regulatory reporting automation, and intelligent customer-experience platforms.",
    img: BANKING_IMG,
    badge: "Industry Vertical",
    link: null,
    linkLabel: null,
    features: ["Credit Risk & Scoring", "Fraud Detection & AML", "Regulatory Reporting", "Core Banking Integration", "Open Banking APIs", "Customer Intelligence"],
    icon: <Building2 className="w-5 h-5" />,
  },
];

const SERVICES = [
  { icon: <Database className="w-5 h-5" />, title: "Data Governance & Intelligence", desc: "Enterprise cataloguing, quality enforcement, and compliance — powered by Ataccama One.", tags: ["Ataccama One", "Compliance"], idx: 0 },
  { icon: <Brain className="w-5 h-5" />, title: "AI Consulting & Audits", desc: "Strategy, readiness assessments, model audits, and ethical AI governance for executive teams.", tags: ["Advisory", "Governance"], idx: 1 },
  { icon: <Cpu className="w-5 h-5" />, title: "Custom AI & Platform Development", desc: "Custom models, NLP, MLOps, cloud-native backends, and polished React frontends — under one roof.", tags: ["Engineering", "MLOps"], idx: 2 },
  { icon: <Building2 className="w-5 h-5" />, title: "Banking & Financial Services", desc: "AI-powered risk models, fraud detection, regulatory reporting, and intelligent CX platforms.", tags: ["Risk", "Fintech"], idx: 3 },
];

const STATS = [
  { value: 50, suffix: "+", label: "Enterprise clients", sub: "Across MENA" },
  { value: 98, suffix: "%", label: "Client retention", sub: "Year over year" },
  { value: 1, prefix: "#", suffix: "", label: "Certified partner", sub: "Ataccama One, MENA" },
  { value: 24, suffix: "/7", label: "Managed support", sub: "Post go-live" },
];

const VALUES = [
  { icon: <Shield className="w-5 h-5" />, title: "Trust & Integrity", body: "The highest standards of transparency and accountability in every engagement." },
  { icon: <Brain className="w-5 h-5" />, title: "Deep Expertise", body: "Years of domain knowledge across AI, data, finance, and engineering." },
  { icon: <Zap className="w-5 h-5" />, title: "Execution Speed", body: "Fast without cutting corners — production-grade outcomes on enterprise timelines." },
  { icon: <Users className="w-5 h-5" />, title: "Client Partnership", body: "We embed with your teams and measure success by your outcomes, not our outputs." },
  { icon: <Globe className="w-5 h-5" />, title: "MENA Focus", body: "Deep regional knowledge, regulatory awareness, and a network built over years." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Innovation First", body: "At the frontier of AI and data so clients always have access to what's next." },
];

const PROCESS = [
  { step: "01", label: "Discovery & Scoping", desc: "A structured discovery session to understand your data landscape, AI maturity, and business objectives." },
  { step: "02", label: "Strategy & Roadmap", desc: "A tailored roadmap with clear milestones, technology recommendations, and ROI projections." },
  { step: "03", label: "Design & Architecture", desc: "We architect data models, AI pipelines, integrations, and governance before a line of code is written." },
  { step: "04", label: "Build & Implement", desc: "Engineering teams build and deploy in sprints, with continuous visibility and weekly reviews." },
  { step: "05", label: "Validate & Go Live", desc: "Rigorous UAT, performance testing, and a managed go-live ensure production-readiness from day one." },
  { step: "06", label: "Support & Evolve", desc: "Ongoing support, monitoring, and continuous improvement — growing the solution as you scale." },
];

const DEPARTMENTS = [
  { accent: "#6C2BD9", tag: "Ataccama One Partner", title: "Data Governance & Intelligence", desc: "Govern, understand, and trust your data at scale — unifying metadata, enforcing quality, and ensuring compliance." },
  { accent: "#0B5FFF", tag: "Find Your Solution", title: "Banking, Finance & Partnerships", desc: "Specialist advisory for regulated institutions — compliance, risk modelling, and digital transformation across MENA." },
  { accent: "#FF1E57", tag: "Free Discovery", title: "AI Solutions & Consulting", desc: "End-to-end AI services — strategy, custom model development, MLOps, and production deployment for the enterprise." },
];

const HEALTH = [
  { l: "Catalog coverage", v: 96 },
  { l: "Quality rules passing", v: 92 },
  { l: "Compliance readiness", v: 99 },
];

/* ── Contact schema ─────────────────────────────────────────────── */
const contactSchema = z.object({
  name:        z.string().min(2, "Name is required"),
  company:     z.string().min(1, "Company is required"),
  email:       z.email("Valid email required"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message:     z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

const inputStyle: React.CSSProperties = { background: "var(--paper)", border: "1px solid var(--line)" };

/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [activePractice, setActivePractice] = useState(0);
  const [partnerPopupShown, setPartnerPopupShown] = useState(false);
  const [partnerPopupOpen, setPartnerPopupOpen] = useState(false);

  useEffect(() => {
    if (partnerPopupShown) return;
    const el = document.getElementById("practices");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => { setPartnerPopupOpen(true); setPartnerPopupShown(true); }, 900);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [partnerPopupShown]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openPractice = useCallback((i: number) => {
    setActivePractice(i);
    const el = document.getElementById("practices");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });
  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => { toast.success("Message sent! We'll be in touch shortly."); reset(); },
    onError: () => toast.error("Something went wrong. Please try again."),
  });
  const onSubmit = (data: ContactForm) => submitContact.mutate(data);

  const practice = PRACTICES[activePractice];

  return (
    <div className="min-h-screen flex flex-col bg-paper" style={{ color: "var(--ink)" }}>
      <NavbarDropdown />

      <main className="flex-1">
        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section id="hero" className="relative overflow-hidden" style={{ paddingTop: "7.5rem", paddingBottom: "5rem" }}>
          <div className="absolute inset-0 dot-field dot-field-fade pointer-events-none" />
          <div className="absolute pointer-events-none" style={{ top: "-12%", right: "-8%", width: 520, height: 520, background: "radial-gradient(circle, rgba(255,30,87,0.08), transparent 70%)" }} />

          <div className="container container-wide relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Copy */}
              <div className="lg:col-span-7">
                <motion.div variants={fadeUp} custom={0}>
                  <span className="eyebrow">Enterprise AI & Data — MENA</span>
                </motion.div>

                <motion.h1 variants={fadeUp} custom={1} className="display mt-6 balance" style={{ fontSize: "clamp(2.6rem, 6vw, 4.7rem)" }}>
                  We build the <span className="ink-underline text-rose">intelligence</span> behind your enterprise.
                </motion.h1>

                <motion.p variants={fadeUp} custom={2} className="lead mt-7 max-w-xl">
                  Alpha Pro MENA is the region's leading multi-practice AI and data firm — delivering data
                  governance, AI consulting, custom implementation, and banking solutions to enterprises that
                  demand excellence.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="mt-9 flex flex-wrap items-center gap-3">
                  <button onClick={() => scrollTo("practices")} className="btn-pill btn-primary">
                    Explore our services <ArrowRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => scrollTo("contact")} className="btn-pill btn-secondary">
                    Book a free discovery
                  </button>
                </motion.div>

                <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Certified Ataccama One Partner</span>
                  <span className="rule" style={{ width: 28 }} />
                  <span className="text-sm text-soft">Banking · Data · Custom AI</span>
                </motion.div>
              </div>

              {/* Platform card */}
              <motion.div variants={fadeUp} custom={3} className="lg:col-span-5">
                <div className="float-y card overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
                  <div className="relative h-28 overflow-hidden">
                    <img src={DATA_IMG} alt="" className="w-full h-full object-cover" style={{ opacity: 0.9 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 30%, #fff 100%)" }} />
                  </div>
                  <div className="px-6 pb-6 -mt-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="tag"><Shield className="w-3 h-3" /> Live platform</span>
                      <span className="text-xs text-faint font-medium">Ataccama One</span>
                    </div>
                    <div className="text-[15px] font-bold mb-4" style={{ color: "var(--ink)" }}>Data estate · Health</div>
                    {HEALTH.map((row) => (
                      <div key={row.l} className="mb-3.5">
                        <div className="flex justify-between text-[13px] mb-1.5">
                          <span className="text-soft">{row.l}</span>
                          <span className="font-semibold" style={{ color: "var(--ink)" }}>{row.v}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--paper-2)" }}>
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${row.v}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeOut" }} className="h-full rounded-full" style={{ background: "var(--rose)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ CREDENTIAL STRIP ══════════════════════════════════════ */}
        <div className="border-y" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
          <div className="container py-5 flex items-center gap-6">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-faint shrink-0 hidden sm:inline">Capabilities</span>
            <div className="overflow-hidden marquee-mask flex-1">
              <div className="animate-marquee flex gap-10 w-max">
                {[...["Data Governance", "AI Strategy & Audits", "Machine Learning", "MLOps", "Fraud Detection", "Regulatory Reporting", "Data Quality", "Master Data Management", "Cloud-Native Platforms"], ...["Data Governance", "AI Strategy & Audits", "Machine Learning", "MLOps", "Fraud Detection", "Regulatory Reporting", "Data Quality", "Master Data Management", "Cloud-Native Platforms"]].map((t, i) => (
                  <span key={i} className="text-sm font-medium whitespace-nowrap text-soft">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ STATS ═════════════════════════════════════════════════ */}
        <Section className="py-16 bg-paper">
          <div className="container">
            <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: "var(--line)", border: "1px solid var(--line)" }}>
              {STATS.map((s, i) => (
                <motion.div key={s.label} variants={fadeUp} custom={i} className="bg-surface px-6 py-8">
                  <div className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)", color: "var(--ink)" }}>
                    <Counter to={s.value} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="mt-2 text-[15px] font-semibold" style={{ color: "var(--ink)" }}>{s.label}</div>
                  <div className="text-sm text-faint">{s.sub}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ SERVICES ══════════════════════════════════════════════ */}
        <Section id="services" className="py-24 bg-paper">
          <div className="container">
            <div className="max-w-2xl mb-14">
              <motion.div variants={fadeUp} custom={0}><span className="eyebrow">What we do</span></motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="display mt-5 balance" style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)" }}>
                One firm, every layer of the stack.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="lead mt-5">
                Four deeply specialised practices — from data governance to production engineering — under a single, accountable partner.
              </motion.p>
            </div>

            <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-5">
              {SERVICES.map((s, i) => (
                <motion.button key={s.title} variants={fadeUp} custom={i} onClick={() => openPractice(s.idx)} className="card card-hover card-feature p-7 text-left">
                  <div className="flex items-start justify-between">
                    <span className="icon-tile">{s.icon}</span>
                    <ArrowUpRight className="w-5 h-5 text-faint" />
                  </div>
                  <h3 className="text-xl font-bold mt-5" style={{ color: "var(--ink)" }}>{s.title}</h3>
                  <p className="text-soft mt-2.5 text-[15px] leading-relaxed">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {s.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ PRACTICES ═════════════════════════════════════════════ */}
        <Section id="practices" className="py-24 bg-paper-2">
          <div className="container">
            <div className="max-w-2xl mb-10">
              <motion.div variants={fadeUp} custom={0}><span className="eyebrow">Practice areas</span></motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="display mt-5" style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)" }}>
                Our services.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="lead mt-5">
                From data strategy to production software — we cover every layer of the enterprise technology stack.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2.5 mb-9">
              {PRACTICES.map((p, i) => (
                <button key={p.id} className={`tab-pill ${activePractice === i ? "active" : ""}`} onClick={() => setActivePractice(i)}>{p.tab}</button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePractice}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="card grid lg:grid-cols-2 overflow-hidden"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                <div className="p-9 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="icon-tile">{practice.icon}</span>
                    <span className="tag">{practice.badge}</span>
                  </div>
                  <h3 className="display" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", color: "var(--ink)" }}>{practice.headline}</h3>
                  <p className="text-rose font-semibold mt-2.5 text-[15px]">{practice.sub}</p>
                  <p className="text-soft mt-4 leading-relaxed">{practice.body}</p>
                  <div className="grid sm:grid-cols-2 gap-2.5 mt-7">
                    {practice.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[14px] text-soft">
                        <Check className="w-4 h-4 shrink-0" style={{ color: "var(--rose-ink)" }} /> {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-8">
                    <button onClick={() => scrollTo("contact")} className="btn-pill btn-primary" style={{ padding: "0.65rem 1.3rem", fontSize: "0.85rem" }}>
                      Enquire now <ArrowRight className="h-4 w-4" />
                    </button>
                    {practice.link && (
                      <a href={practice.link} target="_blank" rel="noopener noreferrer" className="btn-pill btn-secondary" style={{ padding: "0.65rem 1.3rem", fontSize: "0.85rem" }}>
                        {practice.linkLabel} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="relative min-h-64 lg:min-h-0 order-first lg:order-last">
                  <img src={practice.img} alt={practice.headline} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(255,255,255,0.0) 55%, rgba(255,255,255,0.0))" }} />
                  <div className="absolute bottom-5 right-5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.92)", color: "var(--ink)", backdropFilter: "blur(6px)" }}>
                    Practice 0{activePractice + 1}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Section>

        {/* ══ PARTNERSHIP ═══════════════════════════════════════════ */}
        <Section id="partnership" className="py-24 bg-paper">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <motion.div variants={fadeUp} custom={0}><span className="eyebrow">Strategic partnership</span></motion.div>
                <motion.h2 variants={fadeUp} custom={1} className="display mt-5 balance" style={{ fontSize: "clamp(2.1rem, 4vw, 3.3rem)" }}>
                  The only certified <span className="text-rose">Ataccama</span> partner in MENA.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="lead mt-6">
                  Alpha Pro MENA is Ataccama's exclusive certified Solution Partner across the Middle East and North
                  Africa. We bring the industry's leading unified data management platform — governance, quality,
                  catalog, and MDM — to enterprises that can't afford to get their data wrong.
                </motion.p>

                <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-3 mt-8">
                  {[
                    { t: "Unified Governance", d: "One platform for catalog, lineage & policy." },
                    { t: "Data Quality at Scale", d: "Automated rules across every source." },
                    { t: "Master Data Management", d: "A single trusted version of the truth." },
                    { t: "Regulatory Compliance", d: "Audit-ready for MENA & global frameworks." },
                  ].map((b, i) => (
                    <motion.div key={b.t} variants={fadeUp} custom={i} className="card p-5">
                      <Check className="w-5 h-5 mb-2.5" style={{ color: "var(--rose-ink)" }} />
                      <div className="font-semibold" style={{ color: "var(--ink)" }}>{b.t}</div>
                      <div className="text-sm text-soft mt-1 leading-relaxed">{b.d}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3 mt-8">
                  <button onClick={() => scrollTo("contact")} className="btn-pill btn-primary">Talk to a specialist <ArrowRight className="h-4 w-4" /></button>
                  <a href="https://www.ataccama.com/platform" target="_blank" rel="noopener noreferrer" className="btn-pill btn-secondary">Explore Ataccama One <ExternalLink className="w-3.5 h-3.5" /></a>
                </motion.div>
              </div>

              <motion.div variants={fadeUp} custom={2} className="card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={DATA_IMG} alt="Ataccama data governance" className="w-full h-full object-cover" />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                    <img src="/alpha-pro-mena-icon.png" alt="Alpha Pro MENA" className="h-6 w-auto" />
                    <span className="font-bold" style={{ color: "var(--ink)" }}>Alpha Pro MENA</span>
                    <span className="text-faint">×</span>
                    <span className="font-bold" style={{ color: "#6C2BD9" }}>Ataccama</span>
                  </div>
                  <span className="tag mb-3"><Shield className="w-3 h-3" /> Certified Solution Partner</span>
                  <p className="text-soft text-[15px] leading-relaxed mt-3">
                    Deploying enterprise data governance across banks, insurers, telcos, and public-sector
                    institutions throughout the region.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ ABOUT ═════════════════════════════════════════════════ */}
        <Section id="about" className="py-24 bg-paper-2">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <div>
                <motion.div variants={fadeUp} custom={0}><span className="eyebrow">About Alpha Pro MENA</span></motion.div>
                <motion.h2 variants={fadeUp} custom={1} className="display mt-5 balance" style={{ fontSize: "clamp(2.1rem, 4vw, 3.3rem)" }}>
                  Built for the MENA enterprise.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="lead mt-6">
                  Alpha Pro MENA is a multi-practice technology firm headquartered in the MENA region. We combine deep
                  domain expertise across AI, data, finance, and software engineering to deliver transformative
                  outcomes for enterprise clients.
                </motion.p>
                <motion.div variants={fadeUp} custom={3} className="flex flex-col gap-4 mt-9">
                  {[
                    { icon: <Zap className="w-4 h-4" />, title: "Mission", body: "To accelerate enterprise transformation across MENA through intelligent technology and trusted partnerships." },
                    { icon: <TrendingUp className="w-4 h-4" />, title: "Vision", body: "To be the region's most trusted AI and data partner — known for rigour, innovation, and measurable impact." },
                  ].map((item) => (
                    <div key={item.title} className="card p-5 flex gap-4">
                      <span className="icon-tile shrink-0" style={{ width: "2.25rem", height: "2.25rem" }}>{item.icon}</span>
                      <div>
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>{item.title}</div>
                        <div className="text-sm text-soft mt-1 leading-relaxed">{item.body}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4">
                {VALUES.map((v, i) => (
                  <motion.div key={v.title} variants={fadeUp} custom={i} className="card card-hover p-5">
                    <span className="icon-tile mb-3.5" style={{ width: "2.25rem", height: "2.25rem" }}>{v.icon}</span>
                    <div className="font-semibold" style={{ color: "var(--ink)" }}>{v.title}</div>
                    <div className="text-sm text-soft mt-1 leading-relaxed">{v.body}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ PROCESS ═══════════════════════════════════════════════ */}
        <Section id="how-we-work" className="py-24 bg-paper">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <motion.div variants={fadeUp} custom={0}><span className="eyebrow">Our process</span></motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="display mt-5" style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)" }}>How we work.</motion.h2>
              <motion.p variants={fadeUp} custom={2} className="lead mt-5">
                A structured, transparent engagement model built for enterprise clients who demand clarity and results.
              </motion.p>
            </div>

            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROCESS.map((p, i) => (
                <motion.div key={p.step} variants={fadeUp} custom={i} className="card card-hover p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold" style={{ background: "var(--rose)" }}>{p.step}</span>
                    <div className="rule flex-1" />
                  </div>
                  <div className="text-lg font-bold" style={{ color: "var(--ink)" }}>{p.label}</div>
                  <p className="text-soft text-[15px] mt-2 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="flex flex-wrap gap-3 mt-10">
              <button onClick={() => scrollTo("contact")} className="btn-pill btn-primary">Start your engagement <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => scrollTo("practices")} className="btn-pill btn-secondary">Explore our practices</button>
            </motion.div>
          </div>
        </Section>

        {/* ══ DEPARTMENTS ═══════════════════════════════════════════ */}
        <Section id="team" className="py-24 bg-paper-2">
          <div className="container">
            <div className="max-w-2xl mb-12 text-center mx-auto">
              <motion.div variants={fadeUp} custom={0} className="flex justify-center"><span className="eyebrow">Our departments</span></motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="display mt-5" style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)" }}>Contact our departments.</motion.h2>
              <motion.p variants={fadeUp} custom={2} className="lead mt-5">
                Each practice area has a dedicated specialist team. Reach out directly to the department that matches your needs.
              </motion.p>
            </div>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-5">
              {DEPARTMENTS.map((d, i) => (
                <motion.div key={d.title} variants={fadeUp} custom={i} className="card card-hover overflow-hidden flex flex-col">
                  <div style={{ height: 4, background: d.accent }} />
                  <div className="p-7 flex flex-col flex-1">
                    <span className="tag self-start" style={{ color: d.accent, background: `${d.accent}14` }}>{d.tag}</span>
                    <h3 className="text-xl font-bold mt-4" style={{ color: "var(--ink)" }}>{d.title}</h3>
                    <p className="text-soft text-[15px] mt-2.5 leading-relaxed flex-1">{d.desc}</p>
                    <button onClick={() => scrollTo("contact")} className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold self-start" style={{ color: d.accent }}>
                      Get in touch <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ CTA ═══════════════════════════════════════════════════ */}
        <Section className="py-20 bg-paper">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl px-8 py-16 sm:px-16 text-center" style={{ background: "linear-gradient(135deg, #FFF1F4 0%, #FBFAF7 60%, #F4F2EC 100%)", border: "1px solid var(--line)" }}>
              <div className="absolute pointer-events-none" style={{ top: "-30%", left: "10%", width: 320, height: 320, background: "radial-gradient(circle, rgba(255,30,87,0.10), transparent 70%)" }} />
              <div className="relative z-10">
                <span className="eyebrow justify-center">Ready to transform?</span>
                <h2 className="display mt-5 balance mx-auto max-w-2xl" style={{ fontSize: "clamp(2.1rem, 5vw, 3.6rem)" }}>
                  Let's build something exceptional together.
                </h2>
                <p className="lead mt-5 max-w-xl mx-auto">
                  Whether you're starting an AI strategy or scaling a data platform — our team is ready to help you move faster and further.
                </p>
                <button onClick={() => scrollTo("contact")} className="btn-pill btn-primary mt-8 mx-auto">
                  Start the conversation <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* ══ CONTACT ═══════════════════════════════════════════════ */}
        <Section id="contact" className="py-24 bg-paper-2">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <div>
                <motion.div variants={fadeUp} custom={0}><span className="eyebrow">Get in touch</span></motion.div>
                <motion.h2 variants={fadeUp} custom={1} className="display mt-5" style={{ fontSize: "clamp(2.1rem, 4vw, 3.3rem)" }}>Let's talk enterprise.</motion.h2>
                <motion.p variants={fadeUp} custom={2} className="lead mt-6">
                  Tell us about your challenge. Our team will respond within one business day with a tailored approach.
                </motion.p>
                <motion.div variants={fadeUp} custom={3} className="flex flex-col gap-3 mt-9">
                  {[
                    { icon: <Zap className="w-4 h-4" />, label: "Fast response", val: "Within 1 business day" },
                    { icon: <Shield className="w-4 h-4" />, label: "Confidential", val: "All enquiries are NDA-ready" },
                    { icon: <Globe className="w-4 h-4" />, label: "Location", val: "MENA Region" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <span className="icon-tile" style={{ width: "2.25rem", height: "2.25rem" }}>{item.icon}</span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-faint font-semibold">{item.label}</div>
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.form variants={fadeUp} custom={2} onSubmit={handleSubmit(onSubmit)} className="card p-7 sm:p-8 flex flex-col gap-5" style={{ boxShadow: "var(--shadow-md)" }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-soft">Full Name</Label>
                    <Input {...register("name")} placeholder="Jane Smith" className="rounded-xl text-sm" style={inputStyle} />
                    {errors.name && <span className="text-xs text-rose">{errors.name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-soft">Company</Label>
                    <Input {...register("company")} placeholder="Acme Corp" className="rounded-xl text-sm" style={inputStyle} />
                    {errors.company && <span className="text-xs text-rose">{errors.company.message}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-soft">Email Address</Label>
                  <Input {...register("email")} type="email" placeholder="jane@company.com" className="rounded-xl text-sm" style={inputStyle} />
                  {errors.email && <span className="text-xs text-rose">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-soft">Inquiry Type</Label>
                  <Select onValueChange={val => setValue("inquiryType", val)}>
                    <SelectTrigger className="rounded-xl text-sm" style={inputStyle}><SelectValue placeholder="Select a service area..." /></SelectTrigger>
                    <SelectContent>
                      {["Data Governance & Ataccama One", "AI Consulting & Audits", "Custom AI Solutions & Platform Development", "Banking & Finance Solutions", "General Inquiry"].map(opt => (
                        <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.inquiryType && <span className="text-xs text-rose">{errors.inquiryType.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-soft">Message</Label>
                  <Textarea {...register("message")} placeholder="Tell us about your challenge or project..." rows={4} className="rounded-xl text-sm resize-none" style={inputStyle} />
                  {errors.message && <span className="text-xs text-rose">{errors.message.message}</span>}
                </div>
                <button type="submit" disabled={submitContact.isPending} className="btn-pill btn-primary w-full disabled:opacity-60">
                  {submitContact.isPending ? "Sending..." : <>Send message <ArrowRight className="h-4 w-4" /></>}
                </button>
              </motion.form>
            </div>
          </div>
        </Section>

        {/* ══ FOOTER ════════════════════════════════════════════════ */}
        <footer className="bg-paper" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="container py-16">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2">
                <img src="/alpha-pro-mena-logo-full.png" alt="Alpha Pro MENA" className="h-9 w-auto" />
                <p className="text-soft text-[15px] leading-relaxed max-w-xs mt-4">
                  The region's leading multi-practice AI and data firm. Delivering intelligence, governance, and
                  engineering excellence to enterprises across MENA.
                </p>
                <div className="flex gap-2 mt-5">
                  <span className="tag">Ataccama One Partner</span>
                  <span className="tag">MENA</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-4" style={{ color: "var(--ink)" }}>Services</div>
                <ul className="flex flex-col gap-2.5">
                  {["Data & Governance", "AI Consulting", "Custom AI & Platform", "Banking & Finance"].map(item => (
                    <li key={item}><button onClick={() => scrollTo("practices")} className="text-[15px] text-soft hover:text-rose transition-colors">{item}</button></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold mb-4" style={{ color: "var(--ink)" }}>Company</div>
                <ul className="flex flex-col gap-2.5">
                  {NAV.filter(n => n.id !== "practices").map(item => (
                    <li key={item.id}><button onClick={() => scrollTo(item.id)} className="text-[15px] text-soft hover:text-rose transition-colors">{item.label}</button></li>
                  ))}
                  <li><a href="https://www.ataccama.com/platform" target="_blank" rel="noopener noreferrer" className="text-[15px] text-soft hover:text-rose transition-colors inline-flex items-center gap-1">Ataccama One <ExternalLink className="w-3 h-3" /></a></li>
                </ul>
              </div>
            </div>
            <div className="rule mb-7" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-sm text-faint">© {new Date().getFullYear()} Alpha Pro MENA. All rights reserved.</p>
              <p className="text-sm text-faint">Enterprise AI & Data Solutions · MENA Region</p>
            </div>
          </div>
        </footer>
      </main>

      {/* ══ PARTNERSHIP POPUP ═════════════════════════════════════ */}
      <AnimatePresence>
        {partnerPopupOpen && (
          <motion.div
            key="partner-badge"
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50" style={{ maxWidth: 290 }}
          >
            <div className="card overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
              <button onClick={() => setPartnerPopupOpen(false)} className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center z-10" style={{ background: "var(--paper-2)", color: "var(--ink-soft)" }} aria-label="Dismiss">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="p-5">
                <span className="tag mb-3"><Shield className="w-3 h-3" /> Exclusive MENA Partner</span>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <img src="/alpha-pro-mena-icon.png" alt="Alpha Pro MENA" className="h-5 w-auto" />
                  <span className="text-sm font-bold" style={{ color: "var(--ink)" }}>Alpha Pro MENA</span>
                  <span className="text-faint text-sm">×</span>
                  <span className="text-sm font-bold" style={{ color: "#6C2BD9" }}>Ataccama</span>
                </div>
                <p className="text-sm text-soft leading-relaxed mb-4">
                  Ataccama's only certified Solution Partner across the Middle East and North Africa — enterprise data governance at scale.
                </p>
                <a href="https://www.ataccama.com/partners?search=alpha+pro" target="_blank" rel="noopener noreferrer" onClick={() => setPartnerPopupOpen(false)} className="btn-pill btn-primary w-full" style={{ padding: "0.6rem 1rem", fontSize: "0.82rem" }}>
                  View on Ataccama.com <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
