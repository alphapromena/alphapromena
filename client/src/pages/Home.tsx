import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatedBlobs } from "@/components/ui/blobs";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight, X, ChevronRight, ExternalLink,
  Database, Brain, Cpu, Building2, Globe, CheckCircle, ArrowUpRight,
  TrendingUp, Shield, Users, Zap, ChevronDown, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ServiceCard } from "@/components/ui/service-card";
import { ShineBorder } from "@/components/ui/shine-border";
import { GradientCard } from "@/components/ui/gradient-card";
import { AuroraButton } from "@/components/ui/aurora-button";
import { NavbarDropdown } from "@/components/ui/navbar-dropdown";

/* ── Asset URLs ─────────────────────────────────────────────────── */
const HERO_BG    = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/hero-dark-cinematic-V6ChsH2WWVArr5voDyBZy9.webp";
const BANKING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/banking-finance-visual-RHzeNFLAucjXwQSP2VhPcg.webp";
const DATA_IMG   = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/data-governance-visual-bDPCBPBmZbZaGw7DULtTUs.webp";
const DEV_IMG    = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/fullstack-dev-visual-HAc54YqGJnrqHAgCfyzEC.webp";

/* ── Animation Variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ── Spotlight hover (sets --mx/--my on .bento-card) ─────────────── */
function useSpotlight() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
}

/* ── Animated Counter ───────────────────────────────────────────── */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Section Wrapper ────────────────────────────────────────────── */
function Section({ id, children, className = "", style }: { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
}

/* ── Eyebrow heading block ──────────────────────────────────────── */
function Eyebrow({ icon, label, center = false }: { icon?: React.ReactNode; label: string; center?: boolean }) {
  return (
    <motion.div variants={fadeUp} custom={0} className={`mb-5 flex ${center ? "justify-center" : ""}`}>
      <span className="badge-crimson">{icon}{label}</span>
    </motion.div>
  );
}

/* ── Nav Links ──────────────────────────────────────────────────── */
const NAV = [
  { id: "practices", label: "Services" },
  { id: "partnership", label: "Partnership" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/* ── Practice Areas ─────────────────────────────────────────────── */
const PRACTICES = [
  {
    id: "data",
    tab: "Data & Governance",
    headline: "Data Governance & Intelligence",
    sub: "Powered by Ataccama One",
    body: "Alpha Pro MENA is Ataccama's only certified Solution Partner across the Middle East and North Africa. We help enterprises take full control of their data estate — from cataloguing and lineage to quality enforcement and regulatory compliance — by deploying the industry's leading data governance platform at the scale and complexity your organisation demands.",
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
    features: ["AI Strategy & Roadmapping", "AI Readiness Assessments", "Model Audits & Explainability", "Ethical AI Frameworks", "Risk & Compliance Reviews", "Executive AI Workshops"],
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: "ai-implementation",
    tab: "Custom AI & Platforms",
    headline: "Custom AI Solutions & Platform Development",
    sub: "From prototype to production — end-to-end.",
    body: "We design, build, and deploy custom AI and machine learning solutions alongside the full-stack platforms that power them. From NLP pipelines, computer vision, and predictive analytics to cloud-native backends, high-performance APIs, and polished React frontends — our engineering teams deliver production-grade software and AI that scales with your enterprise ambitions.",
    img: DEV_IMG,
    badge: "Engineering Practice",
    link: null,
    linkLabel: null,
    features: ["Custom ML Model Development", "NLP & Conversational AI", "Computer Vision Systems", "MLOps & Model Lifecycle", "Cloud-Native Architecture", "React / Next.js Frontends", "API Design & Development", "DevOps & CI/CD Pipelines"],
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "banking",
    tab: "Banking & Finance",
    headline: "Banking & Financial Services",
    sub: "Precision solutions for regulated industries.",
    body: "Financial institutions face unique pressures: regulatory scrutiny, legacy infrastructure, and the relentless pace of fintech disruption. Our Banking & Finance practice delivers AI-powered risk models, fraud detection systems, regulatory reporting automation, and intelligent customer experience platforms.",
    img: BANKING_IMG,
    badge: "Industry Vertical",
    link: null,
    linkLabel: null,
    features: ["Credit Risk & Scoring Models", "Fraud Detection & AML", "Regulatory Reporting (IFRS9, Basel)", "Core Banking Integration", "Open Banking APIs", "Customer Intelligence Platforms"],
    icon: <Building2 className="w-5 h-5" />,
  },
];

/* ── Trusted Logos ──────────────────────────────────────────────── */
const TRUSTED = [
  "Ataccama One", "Enterprise AI", "Data Governance", "MENA Region",
  "Banking & Finance", "Custom AI Solutions", "Platform Development", "Consulting",
];

/* ── Service Cards ─────────────────────────────────────────────── */
const SERVICE_CARDS = [
  {
    title: "Data Governance & Intelligence",
    description: "Enterprise data cataloguing, quality enforcement, and compliance — powered by Ataccama One.",
    badge: "Ataccama One Partner",
    variant: "crimson" as const,
    practiceIndex: 0,
    imgSrc: DATA_IMG,
  },
  {
    title: "AI Consulting & Audits",
    description: "AI strategy, readiness assessments, model audits, and ethical AI governance for executive teams.",
    badge: "Advisory Practice",
    variant: "mid" as const,
    practiceIndex: 1,
    imgSrc: HERO_BG,
  },
  {
    title: "Custom AI Solutions & Platform Development",
    description: "Custom AI models, NLP, MLOps, cloud-native backends, and polished React frontends — all under one roof.",
    badge: "Engineering Practice",
    variant: "dark" as const,
    practiceIndex: 2,
    imgSrc: DEV_IMG,
  },
  {
    title: "Banking & Financial Services",
    description: "AI-powered risk models, fraud detection, regulatory reporting, and intelligent CX platforms.",
    badge: "Industry Vertical",
    variant: "subtle" as const,
    practiceIndex: 3,
    imgSrc: BANKING_IMG,
  },
];

/* ── Stats ──────────────────────────────────────────────────────── */
const STATS = [
  { value: 50, suffix: "+", label: "Enterprise Clients", sub: "Across MENA" },
  { value: 98, suffix: "%", label: "Client Retention", sub: "Year over year" },
  { value: 1, suffix: "", label: "Certified MENA Partner", sub: "Ataccama One" },
  { value: 24, suffix: "/7", label: "Managed Support", sub: "Post go-live" },
];

/* ── Contact Schema ─────────────────────────────────────────────── */
const contactSchema = z.object({
  name:        z.string().min(2, "Name is required"),
  company:     z.string().min(1, "Company is required"),
  email:       z.email("Valid email required"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message:     z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePractice, setActivePractice] = useState(0);
  const [partnerPopupShown, setPartnerPopupShown] = useState(false);
  const [partnerPopupOpen, setPartnerPopupOpen] = useState(false);
  const spotlight = useSpotlight();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Scroll-triggered partnership popup — fires once when section enters viewport
  useEffect(() => {
    if (partnerPopupShown) return;
    const el = document.getElementById("practices");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { setPartnerPopupOpen(true); setPartnerPopupShown(true); }, 900);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [partnerPopupShown]);

  const scrollTo = useCallback((id: string) => {
    if (id === "partnership") {
      const el = document.getElementById("partnership");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }, []);

  /* Contact form */
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });
  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => { toast.success("Message sent! We'll be in touch shortly."); reset(); },
    onError: () => toast.error("Something went wrong. Please try again."),
  });
  const onSubmit = (data: ContactForm) => submitContact.mutate(data);

  const practice = PRACTICES[activePractice];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* ══ NAVBAR ═══════════════════════════════════════════════════ */}
      <NavbarDropdown isLight={false} onThemeToggle={() => {}} />

      {/* ══ MOBILE MENU ═════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col pt-16"
            style={{ background: "var(--bg)" }}
          >
            <div className="container py-8 flex flex-col gap-2">
              {NAV.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="flex items-center justify-between py-4 text-xl font-bold uppercase tracking-widest border-b"
                  style={{ color: "#fff", borderColor: "var(--hairline)", fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {link.label}
                  <ChevronRight className="h-5 w-5" style={{ color: "#FF1E57" }} />
                </button>
              ))}
              <Button className="mt-6 w-full rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white" onClick={() => scrollTo("contact")}>
                Get in Touch
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">

        {/* ══ HERO ════════════════════════════════════════════════════ */}
        <section
          id="hero"
          ref={heroRef}
          className="relative flex items-center overflow-hidden grain vignette"
          style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "3rem" }}
        >
          {/* Ambient aurora field */}
          <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroFade }}>
            <div className="aurora" style={{ top: "-10%", left: "-5%", width: "46vw", height: "46vw", background: "radial-gradient(circle, rgba(255,30,87,0.30), transparent 70%)" }} />
            <div className="aurora" style={{ bottom: "-15%", right: "-8%", width: "42vw", height: "42vw", background: "radial-gradient(circle, rgba(139,59,214,0.22), transparent 70%)", animationDelay: "-6s" }} />
            <div className="aurora" style={{ top: "30%", right: "20%", width: "26vw", height: "26vw", background: "radial-gradient(circle, rgba(255,90,133,0.18), transparent 70%)", animationDelay: "-11s" }} />
          </motion.div>

          {/* Fine grid */}
          <div className="absolute inset-0 z-0 grid-bg grid-bg-fade" />

          {/* Decorative blobs (right) */}
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0 opacity-40 hidden lg:block">
            <AnimatedBlobs />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left: copy */}
              <div className="lg:col-span-7">
                <motion.div variants={fadeUp} custom={0} className="mb-6">
                  <span className="badge-crimson">
                    <Sparkles className="w-3 h-3" />
                    Enterprise AI & Data Solutions — MENA
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeUp} custom={1}
                  className="display mb-7"
                  style={{ fontSize: "clamp(2.7rem, 7vw, 6rem)", color: "#fff" }}
                >
                  We Build the{" "}
                  <span className="text-gradient">Intelligence</span>
                  <br />
                  Behind Your{" "}
                  <span style={{ color: "rgba(255,255,255,0.22)" }}>Enterprise.</span>
                </motion.h1>

                <motion.p
                  variants={fadeUp} custom={2}
                  className="mb-9 max-w-xl text-base leading-relaxed text-soft"
                >
                  Alpha Pro MENA is the region's leading multi-practice AI and data firm — delivering data
                  governance, AI consulting, custom implementation, banking solutions, and full-stack
                  engineering to enterprises that demand excellence.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => scrollTo("practices")}
                    className="rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white px-8"
                  >
                    Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <AuroraButton onClick={() => scrollTo("contact")} glowClassName="from-[#FF1E57] via-pink-400 to-rose-300">
                    Book Your Free Discovery
                  </AuroraButton>
                </motion.div>

                {/* Trust chips */}
                <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-wrap gap-2.5">
                  {["Ataccama One Partner", "Data Governance", "Banking & Finance", "Custom AI"].map(t => (
                    <span key={t} className="chip">
                      <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#FF1E57" }} />
                      {t}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right: floating glass console */}
              <motion.div
                variants={fadeUp} custom={3}
                className="lg:col-span-5 hidden lg:block"
              >
                <div className="float-y gradient-border p-1.5">
                  <div className="relative rounded-[1.1rem] overflow-hidden" style={{ background: "var(--surface)" }}>
                    <img src={DATA_IMG} alt="" className="w-full h-44 object-cover" style={{ opacity: 0.55 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, var(--surface) 100%)" }} />
                    {/* Window chrome */}
                    <div className="absolute top-3 left-4 flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF1E57" }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                    </div>
                    <div className="relative px-5 pb-5 -mt-8">
                      <div className="badge-crimson mb-3"><Shield className="w-3 h-3" /> Live Platform</div>
                      <div className="text-sm font-bold uppercase tracking-wide text-white mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Data Estate · Health
                      </div>
                      {[
                        { l: "Catalog coverage", v: 96 },
                        { l: "Quality rules passing", v: 92 },
                        { l: "Compliance readiness", v: 99 },
                      ].map(row => (
                        <div key={row.l} className="mb-3">
                          <div className="flex justify-between text-xs mb-1.5 text-soft">
                            <span>{row.l}</span><span className="text-white font-semibold">{row.v}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${row.v}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: "linear-gradient(90deg, #FF1E57, #ff7aa0)" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-faint">Scroll</span>
            <ChevronDown className="w-4 h-4 text-faint" />
          </motion.div>
        </section>

        {/* ══ MARQUEE ═════════════════════════════════════════════════ */}
        <div className="py-6 overflow-hidden marquee-mask" style={{ borderTop: "1px solid var(--hairline-2)", borderBottom: "1px solid var(--hairline-2)", background: "var(--bg-2)" }}>
          <div className="animate-marquee flex gap-12 w-max">
            {[...TRUSTED, ...TRUSTED].map((item, i) => (
              <span key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap text-faint">
                <span className="w-1 h-1 rounded-full" style={{ background: "#FF1E57" }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══ STATS BAND ══════════════════════════════════════════════ */}
        <Section className="py-16" style={{ background: "var(--bg)" }}>
          <div className="container">
            <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div key={s.label} variants={fadeUp} custom={i} onMouseMove={spotlight} className="bento-card p-6">
                  <div className="relative z-10">
                    <div className="display stat-number" style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}>
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-2 text-sm font-bold uppercase tracking-wide text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.label}</div>
                    <div className="text-xs text-faint mt-0.5">{s.sub}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ SERVICE CARDS GRID ════════════════════════════════════ */}
        <Section id="services" className="py-24" style={{ background: "var(--bg)" }}>
          <div className="container">
            <div className="mb-14 max-w-2xl">
              <Eyebrow icon={<Sparkles className="w-3 h-3" />} label="What We Do" />
              <motion.h2 variants={fadeUp} custom={1} className="display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#fff" }}>
                One Firm. <span className="text-gradient">Every Layer.</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-5 text-base text-soft">
                Four deeply specialised practices — from data governance to production engineering — under a single, accountable partner.
              </motion.p>
            </div>

            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICE_CARDS.map((card, i) => (
                <motion.div key={card.title} variants={fadeUp} custom={i} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
                  <ServiceCard
                    title={card.title}
                    description={card.description}
                    badge={card.badge}
                    variant={card.variant}
                    imgSrc={card.imgSrc}
                    imgAlt={card.title}
                    className="min-h-[210px] service-card"
                    onCardClick={() => {
                      setActivePractice(card.practiceIndex);
                      const el = document.getElementById("practices");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ PRACTICE AREAS ══════════════════════════════════════════ */}
        <Section id="practices" className="py-24" style={{ background: "var(--bg-2)" }}>
          <div className="container">
            <div className="mb-12 max-w-2xl">
              <Eyebrow icon={<Sparkles className="w-3 h-3" />} label="Practice Areas" />
              <motion.h2 variants={fadeUp} custom={1} className="display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#fff" }}>
                Our Services.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-5 text-base text-soft">
                From data strategy to production software — we cover every layer of the enterprise technology stack.
              </motion.p>
            </div>

            {/* Tab pills */}
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2.5 mb-10">
              {PRACTICES.map((p, i) => (
                <button key={p.id} className={`practice-tab ${activePractice === i ? "active" : ""}`} onClick={() => setActivePractice(i)}>
                  {p.tab}
                </button>
              ))}
            </motion.div>

            {/* Practice panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePractice}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden gradient-border"
              >
                {/* Left: content */}
                <div className="p-10 lg:p-14 flex flex-col justify-center relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,30,87,0.15)", color: "#FF1E57" }}>
                      {practice.icon}
                    </div>
                    <span className="badge-crimson">{practice.badge}</span>
                  </div>

                  <h3 className="display mb-2" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#fff" }}>
                    {practice.headline}
                  </h3>
                  <p className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: "#FF1E57" }}>
                    {practice.sub}
                  </p>
                  <p className="mb-8 text-base leading-relaxed text-soft">{practice.body}</p>

                  <div className="grid grid-cols-2 gap-2.5 mb-8">
                    {practice.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-soft">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#FF1E57" }} />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => scrollTo("contact")} className="rounded-full font-bold uppercase tracking-widest text-xs shimmer-btn border-0 text-white">
                      Enquire Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                    {practice.link && (
                      <a href={practice.link} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#FF1E57" }}>
                        {practice.linkLabel} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: image */}
                <div className="relative min-h-64 lg:min-h-0 overflow-hidden">
                  <img src={practice.img} alt={practice.headline} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.7 }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--surface) 0%, rgba(18,11,18,0.2) 50%, transparent 100%)" }} />
                  <div className="absolute bottom-6 right-6 text-right">
                    <div className="display" style={{ fontSize: "4rem", color: "rgba(255,255,255,0.08)", lineHeight: 1 }}>
                      0{activePractice + 1}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-soft">Practice Area</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Practice mini-cards row */}
            <motion.div variants={stagger} className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRACTICES.map((p, i) => (
                <motion.button
                  key={p.id}
                  variants={fadeUp}
                  onMouseMove={spotlight}
                  onClick={() => setActivePractice(i)}
                  className="bento-card p-4 text-left"
                  style={activePractice === i ? { borderColor: "rgba(255,30,87,0.4)" } : undefined}
                >
                  <div className="relative z-10">
                    <div className="mb-2 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,30,87,0.12)", color: "#FF1E57" }}>
                      {p.icon}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider leading-tight" style={{ color: activePractice === i ? "#fff" : "var(--ink-soft)", fontFamily: "'Barlow', sans-serif" }}>
                      {p.tab}
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ ATACCAMA PARTNERSHIP ════════════════════════════════════ */}
        <Section id="partnership" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
          <div className="glow-orb" style={{ top: "10%", left: "-5%", width: 420, height: 420 }} />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <Eyebrow icon={<Shield className="w-3 h-3" />} label="Strategic Partnership" />
                <motion.h2 variants={fadeUp} custom={1} className="display" style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)", color: "#fff" }}>
                  The Only Certified<br /><span className="text-gradient">Ataccama Partner</span> in MENA.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="mt-6 text-base leading-relaxed text-soft">
                  Alpha Pro MENA is Ataccama's exclusive certified Solution Partner across the Middle East and North
                  Africa. We bring the industry's leading unified data management platform — governance, quality,
                  catalog, and MDM — to enterprises that can't afford to get their data wrong.
                </motion.p>

                <motion.div variants={stagger} className="mt-8 grid sm:grid-cols-2 gap-3">
                  {[
                    { t: "Unified Governance", d: "One platform for catalog, lineage & policy." },
                    { t: "Data Quality at Scale", d: "Automated rules across every source." },
                    { t: "Master Data Management", d: "A single trusted version of the truth." },
                    { t: "Regulatory Compliance", d: "Audit-ready for MENA & global frameworks." },
                  ].map((b, i) => (
                    <motion.div key={b.t} variants={fadeUp} custom={i} onMouseMove={spotlight} className="bento-card p-5">
                      <div className="relative z-10">
                        <CheckCircle className="w-5 h-5 mb-2" style={{ color: "#FF1E57" }} />
                        <div className="text-sm font-bold uppercase tracking-wide text-white mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{b.t}</div>
                        <div className="text-xs text-soft leading-relaxed">{b.d}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={() => scrollTo("contact")} className="rounded-full font-bold uppercase tracking-widest text-xs shimmer-btn border-0 text-white px-7">
                    Talk to a Specialist <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                  <a href="https://www.ataccama.com/platform" target="_blank" rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#FF1E57" }}>
                    Explore Ataccama One <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              </div>

              {/* Partnership visual card */}
              <motion.div variants={fadeUp} custom={2} className="gradient-border p-1.5">
                <div className="relative rounded-[1.1rem] overflow-hidden" style={{ background: "var(--surface)" }}>
                  <img src={DATA_IMG} alt="Ataccama data governance" className="w-full h-56 object-cover" style={{ opacity: 0.6 }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 20%, var(--surface) 95%)" }} />
                  <div className="relative px-7 pb-7 -mt-10">
                    <div className="flex items-center gap-3 mb-4">
                      <img src="/alpha-pro-mena-icon.png" alt="Alpha Pro MENA" className="h-7 w-auto" />
                      <span className="text-sm font-black uppercase tracking-widest text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Alpha Pro MENA</span>
                      <span className="text-white/30">×</span>
                      <span className="text-sm font-bold" style={{ color: "#a06bff", fontFamily: "'Barlow Condensed', sans-serif" }}>Ataccama</span>
                    </div>
                    <div className="badge-crimson mb-3"><Shield className="w-3 h-3" /> Certified Solution Partner</div>
                    <p className="text-sm text-soft leading-relaxed">
                      Deploying enterprise data governance across banks, insurers, telcos, and public-sector
                      institutions throughout the region.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ ABOUT ════════════════════════════════════════════════════ */}
        <Section id="about" className="py-24" style={{ background: "var(--bg-2)" }}>
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <Eyebrow icon={<Globe className="w-3 h-3" />} label="About Alpha Pro MENA" />
                <motion.h2 variants={fadeUp} custom={1} className="display" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "#fff" }}>
                  Built for the<br /><span className="text-gradient">MENA Enterprise.</span>
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="mt-6 text-base leading-relaxed text-soft">
                  Alpha Pro MENA is a multi-practice technology firm headquartered in the MENA region. We combine deep
                  domain expertise across AI, data, finance, and software engineering to deliver transformative
                  outcomes for enterprise clients.
                </motion.p>
                <motion.p variants={fadeUp} custom={3} className="mt-4 text-base leading-relaxed text-soft">
                  Our team of engineers, data scientists, and AI strategists works at the intersection of
                  cutting-edge technology and real-world business impact — partnering with clients not just as
                  vendors, but as long-term strategic allies.
                </motion.p>

                <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-col gap-4">
                  {[
                    { icon: <Zap className="w-4 h-4" />, title: "Mission", body: "To accelerate enterprise transformation across MENA through intelligent technology and trusted partnerships." },
                    { icon: <TrendingUp className="w-4 h-4" />, title: "Vision", body: "To be the region's most trusted AI and data partner — known for rigour, innovation, and measurable impact." },
                  ].map((item, i) => (
                    <div key={i} className="glass-card rounded-xl p-5 flex gap-4">
                      <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,30,87,0.12)", color: "#FF1E57" }}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold uppercase tracking-wider mb-1 text-white">{item.title}</div>
                        <div className="text-sm text-soft">{item.body}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: "Trust & Integrity", body: "We hold ourselves to the highest standards of transparency and accountability in every engagement." },
                  { icon: <Brain className="w-5 h-5" />, title: "Deep Expertise", body: "Our specialists bring years of domain knowledge across AI, data, finance, and engineering." },
                  { icon: <Zap className="w-5 h-5" />, title: "Execution Speed", body: "We move fast without cutting corners — delivering production-grade outcomes on enterprise timelines." },
                  { icon: <Users className="w-5 h-5" />, title: "Client Partnership", body: "We embed with your teams, align with your goals, and measure success by your outcomes — not our outputs." },
                  { icon: <Globe className="w-5 h-5" />, title: "MENA Focus", body: "Deep regional knowledge, regulatory awareness, and a network built over years in the MENA market." },
                  { icon: <TrendingUp className="w-5 h-5" />, title: "Innovation First", body: "We stay at the frontier of AI and data technology so our clients always have access to what's next." },
                ].map((v, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} onMouseMove={spotlight} className="bento-card p-5">
                    <div className="relative z-10">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "rgba(255,30,87,0.12)", color: "#FF1E57" }}>
                        {v.icon}
                      </div>
                      <div className="text-sm font-bold uppercase tracking-wider mb-1 text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>{v.title}</div>
                      <div className="text-xs leading-relaxed text-soft">{v.body}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ HOW WE WORK — Process Timeline ══════════════════════════ */}
        <Section id="how-we-work" className="py-24" style={{ background: "var(--bg)" }}>
          <div className="container">
            <div className="mb-12 text-center">
              <Eyebrow icon={<Sparkles className="w-3 h-3" />} label="Our Process" center />
              <motion.h2 variants={fadeUp} custom={1} className="display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#fff" }}>
                How We Work.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-xl mx-auto text-base text-soft">
                A structured, transparent engagement model built for enterprise clients who demand clarity and results.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} custom={3} className="max-w-3xl mx-auto">
              <ShineBorder borderWidth={2} borderRadius={24} duration={12} color={["#FF1E57", "#E92156", "#8b3bd6", "#FF7096"]} className="shadow-2xl">
                <div className="w-full px-6 py-8" style={{ background: "var(--surface)", borderRadius: 22 }}>
                  <div className="flex flex-col gap-0">
                    {[
                      { step: "01", label: "Discovery & Scoping", desc: "We start with a structured discovery session to understand your data landscape, AI maturity, and business objectives." },
                      { step: "02", label: "Strategy & Roadmap", desc: "Our consultants deliver a tailored roadmap with clear milestones, technology recommendations, and ROI projections." },
                      { step: "03", label: "Design & Architecture", desc: "We architect the solution — data models, AI pipelines, integration points, and governance frameworks — before a single line of code is written." },
                      { step: "04", label: "Build & Implement", desc: "Our engineering teams build and deploy the solution in sprints, with continuous client visibility and weekly progress reviews." },
                      { step: "05", label: "Validate & Go Live", desc: "Rigorous UAT, performance testing, and a managed go-live ensure your solution is production-ready from day one." },
                      { step: "06", label: "Support & Evolve", desc: "Post-launch, we provide ongoing support, monitoring, and continuous improvement — growing the solution as your business scales." },
                    ].map((item, i, arr) => (
                      <div key={i} className="group relative flex gap-5 py-5" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-2)" : "none" }}>
                        <div className="relative flex flex-col items-center" style={{ minWidth: 40 }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #FF1E57, #B7274F)", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
                            {item.step}
                          </div>
                          {i < arr.length - 1 && <div className="absolute top-10 w-0.5 h-full" style={{ background: "rgba(255,30,87,0.18)" }} />}
                        </div>
                        <div className="pb-2">
                          <div className="text-base font-black uppercase tracking-tight mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#fff", letterSpacing: "0.02em" }}>
                            {item.label}
                          </div>
                          <p className="text-sm leading-relaxed text-soft">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => scrollTo("contact")} className="rounded-full font-bold uppercase tracking-widest text-xs shimmer-btn border-0 text-white px-8 py-5">
                      Start Your Engagement <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" onClick={() => scrollTo("practices")} className="btn-ghost rounded-full font-bold uppercase tracking-widest text-xs px-8 py-5" style={{ color: "#FF1E57" }}>
                      Explore Our Practices
                    </Button>
                  </div>
                </div>
              </ShineBorder>
            </motion.div>
          </div>
        </Section>

        {/* ══ DEPARTMENT CONTACTS ═════════════════════════════════ */}
        <Section id="team" className="py-24" style={{ background: "var(--bg-2)" }}>
          <div className="container">
            <div className="mb-14 text-center">
              <Eyebrow icon={<Building2 className="w-3 h-3" />} label="Our Departments" center />
              <motion.h2 variants={fadeUp} custom={1} className="display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#fff" }}>
                Contact Our Departments.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-xl mx-auto text-base text-soft">
                Each practice area has a dedicated department with its own specialist team. Reach out directly to the department that matches your needs.
              </motion.p>
            </div>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
              {[
                {
                  gradient: "purple" as const, badgeText: "Ataccama One Partner", badgeColor: "#6C2BD9",
                  title: "Data Governance & Intelligence",
                  description: "Govern, understand, and trust your data at scale — deploying Ataccama One to unify metadata, enforce quality, and ensure regulatory compliance.",
                  ctaText: "Get in touch", ctaHref: "#contact", imageUrl: "", accentColor: "#6C2BD9", departmentName: "Data Governance & Intelligence",
                },
                {
                  gradient: "blue" as const, badgeText: "Find Your Solution", badgeColor: "#d4d3d3",
                  title: "Banking, Finance & Partnerships",
                  description: "Specialist advisory for regulated financial institutions — compliance, risk modelling, and digital transformation for banks, insurers, and fintechs across MENA.",
                  ctaText: "Get in touch", ctaHref: "#contact", imageUrl: "", accentColor: "#003087", departmentName: "Banking, Finance & Partnerships",
                },
                {
                  gradient: "rose" as const, badgeText: "Book Your Free Discovery", badgeColor: "#d4d3d3",
                  title: "AI Solutions & Consulting",
                  description: "End-to-end AI services — strategy, custom model development, MLOps, and production deployment for enterprises across the MENA region.",
                  ctaText: "Get in touch", ctaHref: "#contact", imageUrl: "", accentColor: "#FF1E57", departmentName: "AI Solutions & Consulting",
                },
              ].map((dept, i) => (
                <motion.div key={dept.title} variants={fadeUp} custom={i} className="h-full">
                  <GradientCard {...dept} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ CTA BAND ════════════════════════════════════════════ */}
        <section className="py-28 cta-band relative overflow-hidden grain">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="container relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }}>
              <span className="badge-crimson mb-6 inline-flex"><Sparkles className="w-3 h-3" /> Ready to Transform?</span>
              <h2 className="display mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff" }}>
                Let's Build Something<br /><span className="text-gradient">Exceptional Together.</span>
              </h2>
              <p className="mb-10 max-w-xl mx-auto text-base text-soft">
                Whether you're starting an AI strategy or scaling a data platform — our team is ready to help you move faster and further.
              </p>
              <Button size="lg" onClick={() => scrollTo("contact")} className="rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white px-10 py-6 text-sm">
                Start the Conversation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ══ CONTACT ══════════════════════════════════════════════════ */}
        <Section id="contact" className="py-28" style={{ background: "var(--bg)" }}>
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <Eyebrow icon={<ArrowUpRight className="w-3 h-3" />} label="Get in Touch" />
                <motion.h2 variants={fadeUp} custom={1} className="display" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "#fff" }}>
                  Let's Talk<br /><span className="text-gradient">Enterprise.</span>
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="mt-6 text-base leading-relaxed text-soft">
                  Tell us about your challenge. Our team will respond within one business day with a tailored approach.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col gap-4">
                  {[
                    { icon: <Zap className="w-4 h-4" />, label: "Fast Response", val: "Within 1 business day" },
                    { icon: <Shield className="w-4 h-4" />, label: "Confidential", val: "All enquiries are NDA-ready" },
                    { icon: <Globe className="w-4 h-4" />, label: "Location", val: "MENA Region" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,30,87,0.12)", color: "#FF1E57" }}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-faint">{item.label}</div>
                        <div className="text-sm font-semibold text-white">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right: form */}
              <motion.div variants={fadeUp} custom={2} className="gradient-border p-1.5">
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-[1.1rem] p-8 flex flex-col gap-5" style={{ background: "var(--surface)" }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs uppercase tracking-widest text-soft">Full Name</Label>
                      <Input {...register("name")} placeholder="Jane Smith" className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm" style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid var(--hairline)" }} />
                      {errors.name && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.name.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs uppercase tracking-widest text-soft">Company</Label>
                      <Input {...register("company")} placeholder="Acme Corp" className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm" style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid var(--hairline)" }} />
                      {errors.company && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.company.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs uppercase tracking-widest text-soft">Email Address</Label>
                    <Input {...register("email")} type="email" placeholder="jane@company.com" className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm" style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid var(--hairline)" }} />
                    {errors.email && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.email.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs uppercase tracking-widest text-soft">Inquiry Type</Label>
                    <Select onValueChange={val => setValue("inquiryType", val)}>
                      <SelectTrigger className="rounded-xl border-0 text-white text-sm" style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid var(--hairline)" }}>
                        <SelectValue placeholder="Select a service area..." />
                      </SelectTrigger>
                      <SelectContent style={{ background: "#1c1217", border: "1px solid var(--hairline)" }}>
                        {["Data Governance & Ataccama One", "AI Consulting & Audits", "Custom AI Solutions & Platform Development", "Banking & Finance Solutions", "General Inquiry"].map(opt => (
                          <SelectItem key={opt} value={opt} className="text-white text-sm">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.inquiryType && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.inquiryType.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs uppercase tracking-widest text-soft">Message</Label>
                    <Textarea {...register("message")} placeholder="Tell us about your challenge or project..." rows={4} className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm resize-none" style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid var(--hairline)" }} />
                    {errors.message && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.message.message}</span>}
                  </div>

                  <Button type="submit" disabled={submitContact.isPending} className="w-full rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white py-6">
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                    {!submitContact.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ FOOTER ══════════════════════════════════════════════════ */}
        <footer style={{ background: "var(--bg-2)", borderTop: "1px solid var(--hairline)" }}>
          <div className="container py-16">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2">
                <img src="/alpha-pro-mena-logo-full.png" alt="Alpha Pro MENA" className="h-10 w-auto" />
                <p className="mt-4 text-sm leading-relaxed max-w-xs text-soft">
                  Alpha Pro MENA — the region's leading multi-practice AI and data firm. Delivering intelligence,
                  governance, and engineering excellence to enterprises across MENA.
                </p>
                <div className="mt-5 flex gap-2.5">
                  {["Ataccama One Partner", "MENA"].map(t => <span key={t} className="chip text-[11px]">{t}</span>)}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-4 text-white">Services</div>
                <ul className="flex flex-col gap-2">
                  {["Data & Governance", "AI Consulting", "Custom AI & Platform", "Banking & Finance"].map(item => (
                    <li key={item}>
                      <button onClick={() => scrollTo("practices")} className="text-sm transition-colors text-soft hover:text-white">{item}</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-4 text-white">Company</div>
                <ul className="flex flex-col gap-2">
                  {[{ label: "About", id: "about" }, { label: "Partnership", id: "partnership" }, { label: "Contact", id: "contact" }].map(item => (
                    <li key={item.id}>
                      <button onClick={() => scrollTo(item.id)} className="text-sm transition-colors text-soft hover:text-white">{item.label}</button>
                    </li>
                  ))}
                  <li>
                    <a href="https://www.ataccama.com/platform" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1 transition-colors text-soft hover:text-white">
                      Ataccama One <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="divider-gradient mb-8" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-faint">© {new Date().getFullYear()} Alpha Pro MENA. All rights reserved.</p>
              <p className="text-xs text-faint">Enterprise AI & Data Solutions · MENA Region</p>
            </div>
          </div>
        </footer>
      </main>

      {/* ══ PARTNERSHIP POPUP ════════════════════════════════════════ */}
      <AnimatePresence>
        {partnerPopupOpen && (
          <motion.div
            key="partner-badge"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50"
            style={{ maxWidth: 280 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "var(--surface-2)", border: "1px solid rgba(255,30,87,0.22)", boxShadow: "0 8px 32px -4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,30,87,0.08) inset" }}>
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,30,87,0.18)", filter: "blur(24px)" }} />
              <button onClick={() => setPartnerPopupOpen(false)} className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center z-10" style={{ background: "rgba(255,255,255,0.08)", color: "#aaa" }} aria-label="Dismiss">
                <X className="w-3 h-3" />
              </button>
              <div className="relative z-10 px-4 pt-4 pb-3.5">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ background: "rgba(255,30,87,0.12)", color: "#ff5c85", border: "1px solid rgba(255,30,87,0.22)" }}>
                  <Shield className="w-2.5 h-2.5" /> Exclusive MENA Partner
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <img src="/alpha-pro-mena-icon.png" alt="Alpha Pro MENA" className="h-5 w-auto" />
                  <span className="text-xs font-black uppercase tracking-widest text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Alpha Pro MENA</span>
                  <span className="text-xs text-white/30">×</span>
                  <span className="text-xs font-bold" style={{ color: "#a06bff", fontFamily: "'Barlow Condensed', sans-serif" }}>Ataccama</span>
                </div>
                <p className="text-[11px] leading-relaxed mb-3 text-soft">
                  Alpha Pro MENA is Ataccama's only certified Solution Partner across the Middle East and North Africa — delivering enterprise data governance at scale.
                </p>
                <a href="https://www.ataccama.com/partners?search=alpha+pro" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-85"
                  style={{ background: "linear-gradient(135deg, #FF1E57 0%, #B7274F 100%)" }} onClick={() => setPartnerPopupOpen(false)}>
                  View on Ataccama.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
