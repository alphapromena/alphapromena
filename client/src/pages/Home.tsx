import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight, X, ExternalLink, Check, Plus, Minus,
  Database, Brain, Cpu, Building2, Globe,
  TrendingUp, Shield, Users, Zap, Phone, Mail, MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NavbarDropdown } from "@/components/ui/navbar-dropdown";
import { SiteFooter } from "@/components/ui/site-footer";

const HeroCanvas = lazy(() => import("@/components/hero-canvas"));

/* ── Assets ─────────────────────────────────────────────────────── */
const HERO_BG     = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/hero-dark-cinematic-V6ChsH2WWVArr5voDyBZy9.webp";
const BANKING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/banking-finance-visual-RHzeNFLAucjXwQSP2VhPcg.webp";
const DATA_IMG    = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/data-governance-visual-bDPCBPBmZbZaGw7DULtTUs.webp";
const DEV_IMG     = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/fullstack-dev-visual-HAc54YqGJnrqHAgCfyzEC.webp";

/* ── Motion ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now(); const dur = 1400; let raf = 0;
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
const PRACTICES = [
  {
    id: "data",
    title: "Data Governance & Intelligence",
    sub: "Powered by Ataccama One",
    body: "Alpha Pro MENA is Ataccama's only certified Solution Partner across the Middle East and North Africa. We help enterprises take full control of their data estate — from cataloguing and lineage to quality enforcement and regulatory compliance — by deploying the industry's leading data governance platform.",
    img: DATA_IMG,
    link: "https://www.ataccama.com/platform", linkLabel: "Explore Ataccama One",
    features: ["Data Catalog & Lineage", "Data Quality Rules", "Master Data Management", "Regulatory Compliance", "Data Mesh Architecture", "Metadata Management"],
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "ai-consulting",
    title: "AI Consulting & Audits",
    sub: "Strategy. Readiness. Accountability.",
    body: "Before you build, you need clarity. Our AI consulting practice delivers executive-level strategy, AI readiness assessments, model audits, and ethical AI governance frameworks — so your AI investments are grounded, defensible, and aligned with business outcomes.",
    img: HERO_BG, link: null, linkLabel: null,
    features: ["AI Strategy & Roadmapping", "Readiness Assessments", "Model Audits & Explainability", "Ethical AI Frameworks", "Risk & Compliance Reviews", "Executive Workshops"],
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: "ai-implementation",
    title: "Custom AI Solutions & Platform Development",
    sub: "From prototype to production — end to end.",
    body: "We design, build, and deploy custom AI and machine learning solutions alongside the full-stack platforms that power them. From NLP pipelines and computer vision to cloud-native backends, high-performance APIs, and polished React frontends — production-grade software that scales.",
    img: DEV_IMG, link: null, linkLabel: null,
    features: ["Custom ML Development", "NLP & Conversational AI", "Computer Vision", "MLOps & Lifecycle", "Cloud-Native Architecture", "React / Next.js Frontends"],
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "banking",
    title: "Banking & Financial Services",
    sub: "Precision solutions for regulated industries.",
    body: "Financial institutions face unique pressures: regulatory scrutiny, legacy infrastructure, and the relentless pace of fintech disruption. We deliver AI-powered risk models, fraud detection systems, regulatory reporting automation, and intelligent customer-experience platforms.",
    img: BANKING_IMG, link: null, linkLabel: null,
    features: ["Credit Risk & Scoring", "Fraud Detection & AML", "Regulatory Reporting", "Core Banking Integration", "Open Banking APIs", "Customer Intelligence"],
    icon: <Building2 className="w-5 h-5" />,
  },
];

const STATS = [
  { value: 50, suffix: "+", label: "Enterprise clients" },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 1, prefix: "#", suffix: "", label: "Ataccama partner, MENA" },
  { value: 24, suffix: "/7", label: "Managed support" },
];

const VALUES = [
  { icon: <Shield className="w-5 h-5" />, title: "Trust & Integrity", body: "The highest standards of transparency and accountability in every engagement." },
  { icon: <Brain className="w-5 h-5" />, title: "Deep Expertise", body: "Years of domain knowledge across AI, data, finance, and engineering." },
  { icon: <Zap className="w-5 h-5" />, title: "Execution Speed", body: "Fast without cutting corners — production outcomes on enterprise timelines." },
  { icon: <Users className="w-5 h-5" />, title: "Client Partnership", body: "We embed with your teams and measure success by your outcomes." },
  { icon: <Globe className="w-5 h-5" />, title: "MENA Focus", body: "Regional knowledge, regulatory awareness, and a network built over years." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Innovation First", body: "At the frontier of AI and data — so clients always have what's next." },
];

const PROCESS = [
  { step: "01", label: "Discovery & Scoping", desc: "A structured session to understand your data landscape, AI maturity, and objectives." },
  { step: "02", label: "Strategy & Roadmap", desc: "A tailored roadmap with milestones, technology recommendations, and ROI projections." },
  { step: "03", label: "Design & Architecture", desc: "We architect data models, AI pipelines, integrations, and governance up front." },
  { step: "04", label: "Build & Implement", desc: "Engineering teams ship in sprints, with continuous visibility and weekly reviews." },
  { step: "05", label: "Validate & Go Live", desc: "Rigorous UAT, performance testing, and a managed go-live ensure readiness." },
  { step: "06", label: "Support & Evolve", desc: "Ongoing support, monitoring, and continuous improvement as you scale." },
];

const DEPARTMENTS = [
  { accent: "#6C2BD9", tag: "Ataccama One Partner", title: "Data Governance & Intelligence", desc: "Govern, understand, and trust your data at scale — unifying metadata, enforcing quality, ensuring compliance." },
  { accent: "#0B5FFF", tag: "Find your solution", title: "Banking, Finance & Partnerships", desc: "Specialist advisory for regulated institutions — compliance, risk modelling, and digital transformation." },
  { accent: "#FF1E57", tag: "Free discovery", title: "AI Solutions & Consulting", desc: "End-to-end AI — strategy, custom model development, MLOps, and production deployment for the enterprise." },
];

const PARTNERS = [
  {
    name: "Ataccama",
    accent: "#6C2BD9",
    role: "Data & Governance",
    positioning: "Only certified Solution Partner in MENA",
    desc: "We deploy Ataccama One — the industry's leading unified data management platform — for governance, quality, catalog, and master data management across the region's most demanding enterprises.",
    highlights: ["Unified governance & catalog", "Automated data quality at scale", "Audit-ready compliance"],
    link: "https://www.ataccama.com/platform", linkLabel: "Explore Ataccama One",
  },
  {
    name: "Baker Tilly",
    accent: "#0E8A8A",
    role: "Audit, Tax & Advisory",
    positioning: "Strategic alliance across MENA",
    desc: "In alliance with Baker Tilly — one of the world's leading networks of independent audit, tax, and advisory firms — we pair our AI and data engineering with deep assurance and financial advisory expertise for regulated institutions.",
    highlights: ["Audit & assurance depth", "Tax & regulatory advisory", "Financial transformation"],
    link: "https://www.bakertilly.com", linkLabel: "Explore Baker Tilly",
  },
];

const CAPS = ["Data Governance", "AI Strategy & Audits", "Machine Learning", "MLOps", "Fraud Detection", "Regulatory Reporting", "Data Quality", "Master Data Management", "Cloud-Native Platforms"];

const contactSchema = z.object({
  name:        z.string().min(2, "Name is required"),
  company:     z.string().min(1, "Company is required"),
  email:       z.email("Valid email required"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message:     z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [openPractice, setOpenPractice] = useState(0);
  const [partnerShown, setPartnerShown] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  // Defer the heavy WebGL hero until after the hero text has revealed, so
  // parsing/initialising three.js can't stall the entrance animation.
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setShow3D(true), 1000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (partnerShown) return;
    const el = document.getElementById("practices");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => { setPartnerOpen(true); setPartnerShown(true); }, 900);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [partnerShown]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });
  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => { toast.success("Message sent! We'll be in touch shortly."); reset(); },
    onError: () => toast.error("Something went wrong. Please try again."),
  });
  const onSubmit = (data: ContactForm) => submitContact.mutate(data);

  return (
    <div className="min-h-screen flex flex-col bg-paper" style={{ color: "var(--ink)" }}>
      <NavbarDropdown />

      <main className="flex-1">
        {/* ══ HERO ─ dark, WebGL core ═══════════════════════════════ */}
        <section id="hero" className="hero-dark relative flex flex-col justify-center" style={{ minHeight: "100svh", paddingTop: "6.5rem", paddingBottom: "3rem" }}>
          {/* engineering grid */}
          <div className="absolute inset-0 grid-lines pointer-events-none" />
          {/* CSS glow fallback (always behind the canvas) */}
          <div className="absolute pointer-events-none core-glow" style={{ right: "-6%", top: "42%", width: "56%", aspectRatio: "1", transform: "translateY(-50%)", opacity: 0.75 }} />
          {/* WebGL sphere (deferred so it can't stall the hero reveal) */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: show3D ? 1 : 0, transition: "opacity 1.2s ease" }}>
            {show3D && <Suspense fallback={null}><HeroCanvas /></Suspense>}
          </div>
          {/* readability scrim */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(12,11,17,0.9) 0%, rgba(12,11,17,0.62) 44%, rgba(12,11,17,0.12) 74%, transparent 100%)" }} />

          <div className="container container-wide relative w-full" style={{ zIndex: 1 }}>
            <div className="hero-in flex flex-wrap items-center gap-2.5 mb-7" style={{ animationDelay: "0ms" }}>
              <span className="chip-dark"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--rose)" }} /> Enterprise AI · Data · Advisory</span>
              <span className="chip-dark">MENA Region</span>
            </div>

            <h1 className="display balance hero-in" style={{ fontSize: "clamp(2.7rem, 6.6vw, 5.4rem)", maxWidth: "16ch", color: "#ffffff", animationDelay: "80ms" }}>
              We build the <span className="text-rose">intelligence</span> behind your enterprise.
            </h1>

            <p className="lead mt-7 max-w-xl hero-in" style={{ color: "rgba(244,242,247,0.68)", animationDelay: "160ms" }}>
              The region's leading multi-practice AI and data firm — data governance, AI consulting, custom
              implementation, and banking solutions for enterprises that demand excellence.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 hero-in" style={{ animationDelay: "240ms" }}>
              <button onClick={() => scrollTo("practices")} className="btn-pill btn-primary">Explore our services <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => scrollTo("contact")} className="btn-pill btn-ghost-light">Book a free discovery</button>
            </div>

            <div className="mt-11 flex items-center gap-4 flex-wrap hero-in" style={{ animationDelay: "320ms" }}>
              <span className="spec on-dark-faint">Trusted platforms</span>
              <span className="h-4 w-px" style={{ background: "rgba(255,255,255,0.16)" }} />
              <span className="text-[15px] font-semibold on-dark">Ataccama One</span>
              <span className="on-dark-faint">·</span>
              <span className="text-[15px] font-semibold on-dark">Baker Tilly</span>
            </div>
          </div>

          {/* seam into the light content */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "7rem", background: "linear-gradient(180deg, transparent, var(--paper))" }} />
        </section>

        {/* ══ CAPABILITY STRIP ══════════════════════════════════════ */}
        <div style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="container py-5 flex items-center gap-6">
            <span className="spec text-faint shrink-0 hidden sm:inline">Capabilities</span>
            <div className="overflow-hidden marquee-mask flex-1">
              <div className="animate-marquee flex gap-10 w-max">
                {[...CAPS, ...CAPS].map((t, i) => <span key={i} className="text-sm font-medium whitespace-nowrap text-soft">{t}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* ══ STATS ─ horizontal band ═══════════════════════════════ */}
        <Section className="bg-paper-2" style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="container">
            <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 vrules py-12">
              {STATS.map((s, i) => (
                <motion.div key={s.label} variants={fadeUp} custom={i} className="px-0 md:px-8 py-4 first:pl-0 md:first:pl-0">
                  <div className="mono" style={{ fontSize: "clamp(2.3rem, 5vw, 3.4rem)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)" }}>
                    <Counter to={s.value} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="text-[14px] text-soft mt-2">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ PRACTICES ─ accordion ═════════════════════════════════ */}
        <Section id="practices" className="py-24 bg-paper" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <motion.div variants={fadeUp} custom={0}><span className="kicker">What we do</span></motion.div>
                  <motion.h2 variants={fadeUp} custom={1} className="display mt-5 balance" style={{ fontSize: "clamp(2.1rem, 4vw, 3.2rem)" }}>
                    Four practices, one accountable partner.
                  </motion.h2>
                  <motion.p variants={fadeUp} custom={2} className="lead mt-5">
                    From data strategy to production software — select a practice to explore how we deliver.
                  </motion.p>
                </div>
              </div>

              <motion.div variants={stagger} className="lg:col-span-8">
                {PRACTICES.map((p, i) => {
                  const open = openPractice === i;
                  return (
                    <motion.div key={p.id} variants={fadeUp} custom={i} className="list-row">
                      <button className="list-row-head" onClick={() => setOpenPractice(open ? -1 : i)} aria-expanded={open}>
                        <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-md transition-colors" style={{ background: open ? "var(--rose)" : "var(--rose-soft)", color: open ? "#fff" : "var(--rose-ink)" }}>
                          {p.icon}
                        </span>
                        <span className="flex-1">
                          <span className="row-title block text-[1.35rem] sm:text-[1.6rem] font-bold leading-tight" style={{ color: open ? "var(--rose-ink)" : "var(--ink)" }}>{p.title}</span>
                          <span className="block text-sm text-faint mt-1">{p.sub}</span>
                        </span>
                        <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md" style={{ border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
                          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}
                          >
                            <div className="grid md:grid-cols-2 gap-8 pb-9 pt-1">
                              <div>
                                <p className="text-soft leading-relaxed">{p.body}</p>
                                <div className="grid grid-cols-2 gap-2.5 mt-6">
                                  {p.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2.5 text-[14px] text-soft">
                                      <Check className="w-4 h-4 shrink-0" style={{ color: "var(--rose-ink)" }} /> {f}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-wrap gap-3 mt-7">
                                  <button onClick={() => scrollTo("contact")} className="btn-pill btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}>Enquire now <ArrowRight className="h-4 w-4" /></button>
                                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-pill btn-secondary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}>{p.linkLabel} <ExternalLink className="w-3.5 h-3.5" /></a>}
                                </div>
                              </div>
                              <div className="relative rounded-md overflow-hidden min-h-52 framed">
                                <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ PARTNERSHIPS ══════════════════════════════════════════ */}
        <Section id="partnership" className="py-24 bg-paper-2">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <motion.div variants={fadeUp} custom={0}><span className="kicker">Strategic alliances</span></motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="display mt-5 balance" style={{ fontSize: "clamp(2.1rem, 4vw, 3.3rem)" }}>
                Partnerships that raise the bar.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="lead mt-5">
                We combine best-in-class platforms with world-class advisory — so enterprises get governed data and
                trusted financial expertise from a single partner.
              </motion.p>
            </div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6">
              {PARTNERS.map((p, i) => (
                <motion.div key={p.name} variants={fadeUp} custom={i} className="panel panel-hover p-8 lg:p-10 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-2 spec" style={{ color: p.accent }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: p.accent }} /> {p.role}
                    </span>
                  </div>
                  <div className="text-[2rem] font-extrabold tracking-tight leading-none" style={{ color: "var(--ink)" }}>{p.name}</div>
                  <div className="text-rose font-semibold mt-2 text-[15px]">{p.positioning}</div>
                  <p className="text-soft mt-4 leading-relaxed text-[15px]">{p.desc}</p>
                  <div className="mt-6">
                    {p.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-3 py-3 text-[14px] text-soft" style={{ borderTop: "1px solid var(--line)" }}>
                        <Check className="w-4 h-4 shrink-0" style={{ color: p.accent }} /> {h}
                      </div>
                    ))}
                  </div>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="link-row inline-flex items-center gap-1.5 mt-6 text-sm font-semibold self-start" style={{ color: "var(--ink)" }}>
                    {p.linkLabel} <ArrowRight className="w-4 h-4 row-arrow" />
                  </a>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="text-[15px] text-soft">Interested in partnering with Alpha Pro MENA?</span>
              <button onClick={() => scrollTo("contact")} className="link-row inline-flex items-center gap-1.5 text-sm font-semibold text-rose">
                Become a partner <ArrowRight className="w-4 h-4 row-arrow" />
              </button>
            </motion.div>
          </div>
        </Section>

        {/* ══ ABOUT + VALUES ════════════════════════════════════════ */}
        <Section id="about" className="py-24 bg-tint-rose">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <motion.div variants={fadeUp} custom={0}><span className="kicker">About</span></motion.div>
                <motion.h2 variants={fadeUp} custom={1} className="display mt-5 balance" style={{ fontSize: "clamp(2.1rem, 4vw, 3.3rem)" }}>
                  Built for the MENA enterprise.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="lead mt-6">
                  A multi-practice technology firm headquartered in the MENA region, combining deep expertise across
                  AI, data, finance, and software engineering to deliver transformative outcomes.
                </motion.p>
                <motion.div variants={fadeUp} custom={3} className="mt-8">
                  {[
                    { title: "Our mission", body: "To accelerate enterprise transformation across MENA through intelligent technology and trusted partnerships." },
                    { title: "Our vision", body: "To be the region's most trusted AI and data partner — known for rigour, innovation, and measurable impact." },
                  ].map((m) => (
                    <div key={m.title} className="py-5" style={{ borderTop: "1px solid var(--line)" }}>
                      <div className="font-semibold" style={{ color: "var(--ink)" }}>{m.title}</div>
                      <p className="text-soft mt-1.5 leading-relaxed text-[15px]">{m.body}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div variants={stagger} className="lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-9 lg:pl-6">
                {VALUES.map((v, i) => (
                  <motion.div key={v.title} variants={fadeUp} custom={i}>
                    <span className="icon-tile">{v.icon}</span>
                    <div className="font-semibold mt-3.5" style={{ color: "var(--ink)" }}>{v.title}</div>
                    <p className="text-soft text-[15px] mt-1.5 leading-relaxed">{v.body}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ PROCESS ─ real numbered sequence ══════════════════════ */}
        <Section id="how-we-work" className="py-24 bg-paper-2">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <motion.div variants={fadeUp} custom={0}><span className="kicker">How we work</span></motion.div>
                  <motion.h2 variants={fadeUp} custom={1} className="display mt-5" style={{ fontSize: "clamp(2.1rem, 4vw, 3.2rem)" }}>A structured engagement.</motion.h2>
                  <motion.p variants={fadeUp} custom={2} className="lead mt-5">
                    A transparent, six-stage model built for enterprise clients who demand clarity at every step.
                  </motion.p>
                  <motion.div variants={fadeUp} custom={3} className="mt-7">
                    <button onClick={() => scrollTo("contact")} className="btn-pill btn-primary">Start your engagement <ArrowRight className="h-4 w-4" /></button>
                  </motion.div>
                </div>
              </div>
              <motion.div variants={stagger} className="lg:col-span-8">
                {PROCESS.map((p, i) => (
                  <motion.div key={p.step} variants={fadeUp} custom={i} className="flex gap-6 py-6" style={{ borderTop: "1px solid var(--line)" }}>
                    <span className="seq-num shrink-0" style={{ fontSize: "1.6rem", width: "2.4rem" }}>{p.step}</span>
                    <div>
                      <div className="text-lg font-bold" style={{ color: "var(--ink)" }}>{p.label}</div>
                      <p className="text-soft text-[15px] mt-1.5 leading-relaxed max-w-lg">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ DEPARTMENTS ═══════════════════════════════════════════ */}
        <Section id="team" className="py-24 bg-paper">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <motion.div variants={fadeUp} custom={0}><span className="kicker">Departments</span></motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="display mt-5" style={{ fontSize: "clamp(2.1rem, 4vw, 3.2rem)" }}>Reach the right team.</motion.h2>
              <motion.p variants={fadeUp} custom={2} className="lead mt-5">Each practice area has a dedicated specialist team — contact the one that matches your needs.</motion.p>
            </div>
            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
              {DEPARTMENTS.map((d, i) => (
                <motion.div key={d.title} variants={fadeUp} custom={i} className="panel panel-hover p-8 flex flex-col">
                  <span className="inline-flex items-center gap-2 spec" style={{ color: d.accent }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: d.accent }} /> {d.tag}
                  </span>
                  <h3 className="text-xl font-bold mt-4" style={{ color: "var(--ink)" }}>{d.title}</h3>
                  <p className="text-soft text-[15px] mt-2.5 leading-relaxed flex-1">{d.desc}</p>
                  <button onClick={() => scrollTo("contact")} className="link-row inline-flex items-center gap-1.5 mt-6 text-sm font-semibold self-start" style={{ color: d.accent }}>
                    Get in touch <ArrowRight className="w-4 h-4 row-arrow" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ CTA ═══════════════════════════════════════════════════ */}
        <Section className="band-rose">
          <div className="container py-20 sm:py-24 relative" style={{ zIndex: 1 }}>
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <motion.h2 variants={fadeUp} custom={0} className="display lg:col-span-8 balance text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
                Let's build something exceptional together.
              </motion.h2>
              <motion.div variants={fadeUp} custom={1} className="lg:col-span-4 lg:text-right">
                <p className="text-white/85 mb-6 lg:max-w-xs lg:ml-auto leading-relaxed">
                  Starting an AI strategy or scaling a data platform — we'll help you move faster and further.
                </p>
                <button onClick={() => scrollTo("contact")} className="btn-pill mx-0 lg:ml-auto" style={{ background: "#fff", color: "var(--rose-ink)" }}>
                  Start the conversation <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ CONTACT ═══════════════════════════════════════════════ */}
        <Section id="contact" className="py-24 bg-paper">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5">
                <motion.div variants={fadeUp} custom={0}><span className="kicker">Get in touch</span></motion.div>
                <motion.h2 variants={fadeUp} custom={1} className="display mt-5" style={{ fontSize: "clamp(2.1rem, 4vw, 3.3rem)" }}>Let's talk enterprise.</motion.h2>
                <motion.p variants={fadeUp} custom={2} className="lead mt-6">
                  Tell us about your challenge. Our team responds within one business day with a tailored approach.
                </motion.p>
                <motion.div variants={fadeUp} custom={3} className="mt-9">
                  {[
                    { icon: <Phone className="w-4 h-4" />, label: "Phone", val: "+962 79 186 4006", href: "tel:+962791864006" },
                    { icon: <Mail className="w-4 h-4" />, label: "Email", val: "info@alphapromena.com", href: "mailto:info@alphapromena.com" },
                    { icon: <MapPin className="w-4 h-4" />, label: "Location", val: "Amman, Jordan · Saudi Arabia", href: null },
                    { icon: <Zap className="w-4 h-4" />, label: "Response", val: "Within 1 business day", href: null },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 py-4" style={{ borderTop: "1px solid var(--line)" }}>
                      <span style={{ color: "var(--rose-ink)" }}>{item.icon}</span>
                      <div className="flex-1 flex items-baseline justify-between gap-3">
                        <span className="spec text-faint">{item.label}</span>
                        {item.href
                          ? <a href={item.href} className="link-row font-semibold text-right" style={{ color: "var(--ink)" }}>{item.val}</a>
                          : <span className="font-semibold text-right" style={{ color: "var(--ink)" }}>{item.val}</span>}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.form variants={fadeUp} custom={2} onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 panel p-8 lg:p-10 grid sm:grid-cols-2 gap-x-8 gap-y-7">
                <div className="flex flex-col gap-2">
                  <Label className="spec text-faint">Full Name</Label>
                  <Input {...register("name")} placeholder="Jane Smith" className="field-underline h-11 text-[15px]" />
                  {errors.name && <span className="text-xs text-rose">{errors.name.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="spec text-faint">Company</Label>
                  <Input {...register("company")} placeholder="Acme Corp" className="field-underline h-11 text-[15px]" />
                  {errors.company && <span className="text-xs text-rose">{errors.company.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="spec text-faint">Email Address</Label>
                  <Input {...register("email")} type="email" placeholder="jane@company.com" className="field-underline h-11 text-[15px]" />
                  {errors.email && <span className="text-xs text-rose">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="spec text-faint">Inquiry Type</Label>
                  <Select onValueChange={val => setValue("inquiryType", val)}>
                    <SelectTrigger className="field-underline h-11 text-[15px]"><SelectValue placeholder="Select a service area..." /></SelectTrigger>
                    <SelectContent>
                      {["Data Governance & Ataccama One", "AI Consulting & Audits", "Custom AI Solutions & Platform Development", "Banking & Finance Solutions", "General Inquiry"].map(opt => (
                        <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.inquiryType && <span className="text-xs text-rose">{errors.inquiryType.message}</span>}
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label className="spec text-faint">Message</Label>
                  <Textarea {...register("message")} placeholder="Tell us about your challenge or project..." rows={3} className="field-underline text-[15px] resize-none" />
                  {errors.message && <span className="text-xs text-rose">{errors.message.message}</span>}
                </div>
                <div className="sm:col-span-2 mt-2">
                  <button type="submit" disabled={submitContact.isPending} className="btn-pill btn-primary disabled:opacity-60">
                    {submitContact.isPending ? "Sending..." : <>Send message <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </div>
              </motion.form>
            </div>
          </div>
        </Section>

      </main>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <SiteFooter />

      {/* ══ PARTNERSHIP POPUP ═════════════════════════════════════ */}
      <AnimatePresence>
        {partnerOpen && (
          <motion.div
            key="partner-badge" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed bottom-6 right-6" style={{ maxWidth: 300, zIndex: "var(--z-overlay)" as unknown as number }}
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--line)", boxShadow: "var(--shadow-lg)" }}>
              <button onClick={() => setPartnerOpen(false)} className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center z-10" style={{ background: "var(--paper-2)", color: "var(--ink-soft)" }} aria-label="Dismiss">
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
                <a href="https://www.ataccama.com/partners?search=alpha+pro" target="_blank" rel="noopener noreferrer" onClick={() => setPartnerOpen(false)} className="btn-pill btn-primary w-full" style={{ padding: "0.6rem 1rem", fontSize: "0.82rem" }}>
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
