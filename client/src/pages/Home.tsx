import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { AnimatedBlobs } from "@/components/ui/blobs";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight, Menu, X, ChevronRight, ExternalLink,
  Database, Brain, Code2, BarChart3, Shield, Zap,
  Building2, Cpu, Globe, CheckCircle, Star, ArrowUpRight,
  Layers, TrendingUp, Lock, Search, Settings, Users,
  ChevronDown, Play, Sparkles, Network, FileSearch,
  Sun, Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ServiceCard } from "@/components/ui/service-card";
import { ShineBorder } from "@/components/ui/shine-border";
import { DepartmentContactCard, type DepartmentContact } from "@/components/ui/department-contact-card";
import { GradientCard } from "@/components/ui/gradient-card";
import { AuroraButton } from "@/components/ui/aurora-button";
import { NavbarDropdown } from "@/components/ui/navbar-dropdown";

/* ── Asset URLs ─────────────────────────────────────────────────── */
const HERO_BG    = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/hero-dark-cinematic-V6ChsH2WWVArr5voDyBZy9.webp";
const BANKING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/banking-finance-visual-RHzeNFLAucjXwQSP2VhPcg.webp";
const DATA_IMG   = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/data-governance-visual-bDPCBPBmZbZaGw7DULtTUs.webp";
const DEV_IMG    = "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/fullstack-dev-visual-HAc54YqGJnrqHAgCfyzEC.webp";

/* ── Logo ───────────────────────────────────────────────────────── */
function AlphaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size * 1.9} height={size * 0.7} viewBox="0 0 76 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="34" height="28" rx="7" fill="#FF1E57"/>
      <rect x="42" y="0" width="34" height="28" rx="7" fill="#313234"/>
      <text x="17" y="19" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Barlow Condensed, Barlow, sans-serif" letterSpacing="0.5">α</text>
      <text x="59" y="19" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Barlow Condensed, Barlow, sans-serif" letterSpacing="0.5">PM</text>
    </svg>
  );
}

/* ── Animation Variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.10 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeIn  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };

/* ── Animated Counter ───────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(start);
    }, 18);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
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
    accent: "#FF1E57",
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
    accent: "#FF1E57",
  },
  {
    id: "ai-implementation",
    tab: "Custom AI Solutions & Platform Development",
    headline: "Custom AI Solutions & Platform Development",
    sub: "From prototype to production — end-to-end.",
    body: "We design, build, and deploy custom AI and machine learning solutions alongside the full-stack platforms that power them. From NLP pipelines, computer vision, and predictive analytics to cloud-native backends, high-performance APIs, and polished React frontends — our engineering teams deliver production-grade software and AI that scales with your enterprise ambitions.",
    img: DEV_IMG,
    badge: "Engineering Practice",
    link: null,
    linkLabel: null,
    features: ["Custom ML Model Development", "NLP & Conversational AI", "Computer Vision Systems", "MLOps & Model Lifecycle", "Cloud-Native Architecture", "React / Next.js Frontends", "API Design & Development", "DevOps & CI/CD Pipelines"],
    icon: <Cpu className="w-5 h-5" />,
    accent: "#FF1E57",
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
    accent: "#FF1E57",
  },
];

/* ── Trusted Logos ──────────────────────────────────────────────── */
const TRUSTED = [
  "Ataccama One", "Enterprise AI", "Data Governance", "MENA Region",
  "Banking & Finance", "Custom AI Solutions", "Platform Development", "Consulting",
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
    imgSrc: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/data-governance-visual-bDPCBPBmZbZaGw7DULtTUs.webp",
  },
  {
    title: "AI Consulting & Audits",
    description: "AI strategy, readiness assessments, model audits, and ethical AI governance for executive teams.",
    badge: "Advisory Practice",
    variant: "mid" as const,
    practiceIndex: 1,
    imgSrc: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/hero-dark-cinematic-V6ChsH2WWVArr5voDyBZy9.webp",
  },
  {
    title: "Custom AI Solutions & Platform Development",
    description: "Custom AI models, NLP, MLOps, cloud-native backends, and polished React frontends — all under one roof.",
    badge: "Engineering Practice",
    variant: "dark" as const,
    practiceIndex: 2,
    imgSrc: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/fullstack-dev-visual-HAc54YqGJnrqHAgCfyzEC.webp",
  },
  {
    title: "Banking & Financial Services",
    description: "AI-powered risk models, fraud detection, regulatory reporting, and intelligent CX platforms.",
    badge: "Industry Vertical",
    variant: "subtle" as const,
    practiceIndex: 3,
    imgSrc: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453434320/SdwMsFUUv95cDxwRJ6Hwjt/banking-finance-visual-RHzeNFLAucjXwQSP2VhPcg.webp",
  },
];

/* ── Stats ──────────────────────────────────────────────────────── */
const STATS = [
  { value: 50,  suffix: "+", label: "Enterprise Clients" },
  { value: 98,  suffix: "%", label: "Client Retention" },
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
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activePractice, setActivePractice] = useState(0);
  const [partnerPopupShown, setPartnerPopupShown] = useState(false);
  const [partnerPopupOpen, setPartnerPopupOpen] = useState(false);
  const partnershipRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scroll-triggered partnership popup — fires once when section enters viewport
  useEffect(() => {
    if (partnerPopupShown) return;
    // Watch the practices section (which contains the Data & Governance / Ataccama tab)
    const el = document.getElementById("practices");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setPartnerPopupOpen(true);
            setPartnerPopupShown(true);
          }, 800);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [partnerPopupShown]);

  const scrollTo = useCallback((id: string) => {
    // Partnership nav link → scroll to practices section and activate Data & Governance tab
    if (id === "partnership") {
      setActivePractice(0);
      const el = document.getElementById("practices");
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
    <div className="min-h-screen flex flex-col" style={{ background: isLight ? "#f5f5f7" : "#0d0d0e", color: isLight ? "#1a1a1a" : "#fff", transition: "background 0.3s ease, color 0.3s ease" }}>

      {/* ══ NEW NAVBAR WITH DROPDOWNS ════════════════════════════════ */}
      <NavbarDropdown isLight={isLight} onThemeToggle={toggleTheme} />

      {/* ══ MOBILE MENU ═════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col pt-16"
            style={{ background: isLight ? "#ffffff" : "#0d0d0e" }}
          >
            <div className="container py-8 flex flex-col gap-2">
              {NAV.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="flex items-center justify-between py-4 text-xl font-bold uppercase tracking-widest border-b"
                  style={{ color: isLight ? "#1a1a1a" : "#fff", borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)", fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {link.label}
                  <ChevronRight className="h-5 w-5 text-crimson" style={{ color: "#FF1E57" }} />
                </button>
              ))}
              <Button
                className="mt-6 w-full rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white"
                onClick={() => scrollTo("contact")}
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">

        {/* ══ HERO ════════════════════════════════════════════════════ */}
        <section id="hero" ref={heroRef} className="relative flex items-center overflow-hidden" style={{ background: "#f7f7f9", minHeight: "100vh", paddingTop: "5rem", paddingBottom: "1rem" }}>
          {/* Background image with parallax */}
          <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
            <img src={HERO_BG} alt="" className="w-full h-full object-cover" style={{ opacity: 0.18 }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #f7f7f9 30%, rgba(247,247,249,0.5) 70%, #f7f7f9 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, #f7f7f9 100%)" }} />
          </motion.div>

          {/* Animated blobs — right side decorative */}
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0 opacity-50 hidden lg:block">
            <AnimatedBlobs />
          </div>
          {/* Crimson glow orb */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: "radial-gradient(circle, rgba(255,30,87,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

          <div className="container relative z-10">
            <div className="max-w-4xl">
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <span className="badge-crimson">
                  <Sparkles className="w-3 h-3" />
                  Enterprise AI & Data Solutions — MENA
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp} custom={1}
                className="mb-6 leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem, 6vw, 5.5rem)", textTransform: "uppercase", color: "#1a1a1a", lineHeight: 1.0 }}
              >
                We Build the{" "}
                <span className="text-gradient">Intelligence</span>
                <br />
                Behind Your{" "}
                <span style={{ color: "rgba(0,0,0,0.25)" }}>Enterprise.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp} custom={2}
                className="mb-6 max-w-2xl text-base leading-relaxed"
                style={{ color: "rgba(0,0,0,0.55)", fontWeight: 400 }}
              >
                Alpha Pro MENA is the region's leading multi-practice AI and data firm — delivering data governance, AI consulting, custom implementation, banking solutions, and full-stack engineering to enterprises that demand excellence.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => scrollTo("practices")}
                  className="rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white px-8"
                >
                  Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <AuroraButton
                  onClick={() => scrollTo("contact")}
                  glowClassName="from-[#FF1E57] via-pink-400 to-rose-300"
                >
                  Book Your Free Discovery
                </AuroraButton>
              </motion.div>


            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(0,0,0,0.45)" }}>Scroll</span>
            <ChevronDown className="w-4 h-4" style={{ color: "rgba(0,0,0,0.45)" }} />
          </motion.div>
        </section>

        {/* ══ MARQUEE ═════════════════════════════════════════════════ */}
        <div className="py-5 overflow-hidden" style={{ borderTop: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)", borderBottom: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)", background: isLight ? "#ebebed" : "#111113" }}>
          <div className="animate-marquee flex gap-12 w-max">
            {TRUSTED.map((item, i) => (
              <span key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest whitespace-nowrap" style={{ color: isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.30)" }}>
                <span className="w-1 h-1 rounded-full" style={{ background: "#FF1E57" }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══ SERVICE CARDS GRID ════════════════════════════════════ */}
        <Section id="services" className="py-24" style={{ background: "#0d0d0e" }}>
          <div className="container">
            <div className="mb-14">
              <motion.div variants={fadeUp} custom={0} className="mb-4">
                <span className="badge-crimson"><Sparkles className="w-3 h-3" /> What We Do</span>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#fff" }}>
                Our Services.
              </motion.h2>
            </div>

            {/* 2-col grid: first card spans 2 cols on large screens */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICE_CARDS.map((card, i) => (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  custom={i}
                  className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
                >
                  <ServiceCard
                    title={card.title}
                    description={card.description}
                    badge={card.badge}
                    variant={card.variant}
                    imgSrc={card.imgSrc}
                    imgAlt={card.title}
                    className="min-h-[200px]"
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
        <Section id="practices" className="py-28" style={{ background: "#0d0d0e" }}>
          <div className="container">
            {/* Header */}
            <div className="mb-16">
              <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-xl text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
                From data strategy to production software — we cover every layer of the enterprise technology stack.
              </motion.p>
            </div>

            {/* Tab pills */}
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2 mb-12">
              {PRACTICES.map((p, i) => (
                <button
                  key={p.id}
                  className={`practice-tab ${activePractice === i ? "active" : ""}`}
                  onClick={() => setActivePractice(i)}
                  style={{ background: activePractice === i ? "#FF1E57" : "rgba(255,30,87,0.12)", color: "#ffffff", borderColor: activePractice === i ? "#FF1E57" : "rgba(255,30,87,0.30)" }}
                >
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
                  className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#141416", color: "#fff" }}
              >
                {/* Left: content */}
                <div className="p-10 lg:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,30,87,0.15)", color: "#FF1E57" }}>
                      {practice.icon}
                    </div>
                    <span className="badge-crimson">{practice.badge}</span>
                  </div>

                  <h3 className="mb-2 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                    {practice.headline}
                  </h3>
                  <p className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: "#FF1E57" }}>
                    {practice.sub}
                  </p>
                  <p className="mb-8 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {practice.body}
                  </p>

                  {/* Feature list */}
                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {practice.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#FF1E57" }} />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => scrollTo("contact")}
                      className="rounded-full font-bold uppercase tracking-widest text-xs shimmer-btn border-0 text-white"
                    >
                      Enquire Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                    {practice.link && (
                      <a
                        href={practice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all"
                        style={{ border: "1px solid rgba(255,30,87,0.35)", color: "#FF1E57", background: "transparent" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,30,87,0.10)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {practice.linkLabel} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: image */}
                <div className="relative min-h-64 lg:min-h-0 overflow-hidden">
                  <img
                    src={practice.img}
                    alt={practice.headline}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: 0.7 }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #141416 0%, rgba(20,20,22,0.2) 50%, transparent 100%)" }} />
                  {/* Practice number */}
                  <div className="absolute bottom-6 right-6 text-right">
                    <div className="text-6xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "rgba(255,255,255,0.06)", lineHeight: 1 }}>
                      0{activePractice + 1}
                    </div>
                    <div className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.85)" }}>Practice Area</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Practice mini-cards row */}
            <motion.div variants={stagger} className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
              {PRACTICES.map((p, i) => (
                <motion.button
                  key={p.id}
                  variants={fadeUp}
                  onClick={() => setActivePractice(i)}
                  className="bento-card p-4 text-left group"
                  style={{ background: activePractice === i ? "rgba(255,30,87,0.08)" : "#141416", borderColor: activePractice === i ? "rgba(255,30,87,0.35)" : "rgba(255,255,255,0.07)" }}
                >
                  <div className="mb-2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,30,87,0.12)", color: "#FF1E57" }}>
                    {p.icon}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider leading-tight" style={{ color: activePractice === i ? "#fff" : "rgba(255,255,255,0.55)", fontFamily: "'Barlow', sans-serif" }}>
                    {p.tab}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ══ ATACCAMA PARTNERSHIP — scroll anchor ═══ */}
        <div id="partnership" style={{ position: "absolute", pointerEvents: "none", height: 0 }} />

        {/* ══ ABOUT ════════════════════════════════════════════════════ */}
        <Section id="about" className="py-16" style={{ background: isLight ? "#ffffff" : "#111113" }}>
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <motion.div variants={fadeUp} custom={0} className="mb-4">
                  <span className="badge-crimson"><Globe className="w-3 h-3" /> About Alpha Pro MENA</span>
                </motion.div>
                <motion.h2 variants={fadeUp} custom={1}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}>
                  Built for the<br />
                  <span className="text-gradient">MENA Enterprise.</span>
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="mt-6 text-base leading-relaxed" style={{ color: isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.85)" }}>
                  Alpha Pro MENA is a multi-practice technology firm headquartered in the MENA region. We combine deep domain expertise across AI, data, finance, and software engineering to deliver transformative outcomes for enterprise clients.
                </motion.p>
                <motion.p variants={fadeUp} custom={3} className="mt-4 text-base leading-relaxed" style={{ color: isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.85)" }}>
                  Our team of engineers, data scientists, and AI strategists works at the intersection of cutting-edge technology and real-world business impact — partnering with clients not just as vendors, but as long-term strategic allies.
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
                        <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: isLight ? "#1a1a1a" : "#fff" }}>{item.title}</div>
                        <div className="text-sm" style={{ color: isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.45)" }}>{item.body}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Values grid */}
              <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: "Trust & Integrity", body: "We hold ourselves to the highest standards of transparency and accountability in every engagement." },
                  { icon: <Brain className="w-5 h-5" />, title: "Deep Expertise", body: "Our specialists bring years of domain knowledge across AI, data, finance, and engineering." },
                  { icon: <Zap className="w-5 h-5" />, title: "Execution Speed", body: "We move fast without cutting corners — delivering production-grade outcomes on enterprise timelines." },
                  { icon: <Users className="w-5 h-5" />, title: "Client Partnership", body: "We embed with your teams, align with your goals, and measure success by your outcomes — not our outputs." },
                  { icon: <Globe className="w-5 h-5" />, title: "MENA Focus", body: "Deep regional knowledge, regulatory awareness, and a network built over years in the MENA market." },
                  { icon: <TrendingUp className="w-5 h-5" />, title: "Innovation First", body: "We stay at the frontier of AI and data technology so our clients always have access to what's next." },
                ].map((v, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="bento-card p-5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "rgba(255,30,87,0.12)", color: "#FF1E57" }}>
                      {v.icon}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ fontFamily: "'Barlow', sans-serif", color: isLight ? "#1a1a1a" : "#fff" }}>{v.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.80)" }}>{v.body}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Section>



        {/* ══ HOW WE WORK — ShineBorder Timeline ═══════════════════════ */}
        <Section id="how-we-work" className="py-14" style={{ background: "#ffffff" }}>
          <div className="container">
            <div className="mb-12 text-center">
              <motion.div variants={fadeUp} custom={0} className="mb-4 flex justify-center">
                <span className="badge-crimson"><Sparkles className="w-3 h-3" /> Our Process</span>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#1a1a1a" }}>
                How We Work.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-xl mx-auto text-base" style={{ color: "rgba(0,0,0,0.80)" }}>
                A structured, transparent engagement model built for enterprise clients who demand clarity and results.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} custom={3} className="max-w-3xl mx-auto">
              <ShineBorder
                borderWidth={2}
                borderRadius={24}
                duration={12}
                color={["#FF1E57", "#E92156", "#B7274F", "#FF7096"]}
                className="shadow-xl"
              >
                <div className="w-full px-6 py-8">
                  <div className="flex flex-col gap-0">
                    {[
                      { step: "01", label: "Discovery & Scoping", desc: "We start with a structured discovery session to understand your data landscape, AI maturity, and business objectives.", color: "#FF1E57" },
                      { step: "02", label: "Strategy & Roadmap", desc: "Our consultants deliver a tailored roadmap with clear milestones, technology recommendations, and ROI projections.", color: "#E92156" },
                      { step: "03", label: "Design & Architecture", desc: "We architect the solution — data models, AI pipelines, integration points, and governance frameworks — before a single line of code is written.", color: "#B7274F" },
                      { step: "04", label: "Build & Implement", desc: "Our engineering teams build and deploy the solution in sprints, with continuous client visibility and weekly progress reviews.", color: "#FF1E57" },
                      { step: "05", label: "Validate & Go Live", desc: "Rigorous UAT, performance testing, and a managed go-live ensure your solution is production-ready from day one.", color: "#E92156" },
                      { step: "06", label: "Support & Evolve", desc: "Post-launch, we provide ongoing support, monitoring, and continuous improvement — growing the solution as your business scales.", color: "#B7274F" },
                    ].map((item, i, arr) => (
                      <div key={i} className="group relative flex gap-5 py-5" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
                        {/* Step number + connector line */}
                        <div className="relative flex flex-col items-center" style={{ minWidth: 40 }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                            style={{ background: item.color, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
                            {item.step}
                          </div>
                          {i < arr.length - 1 && (
                            <div className="absolute top-10 w-0.5 h-full" style={{ background: "rgba(255,30,87,0.15)" }} />
                          )}
                        </div>
                        {/* Content */}
                        <div className="pb-2">
                          <div className="text-base font-black uppercase tracking-tight mb-1"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1a1a1a", letterSpacing: "0.02em" }}>
                            {item.label}
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.80)" }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => scrollTo("contact")}
                      className="rounded-full font-bold uppercase tracking-widest text-xs shimmer-btn border-0 text-white px-8 py-5"
                    >
                      Start Your Engagement <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => scrollTo("practices")}
                      className="rounded-full font-bold uppercase tracking-widest text-xs px-8 py-5"
                      style={{ borderColor: "rgba(255,30,87,0.30)", color: "#FF1E57", background: "transparent" }}
                    >
                      Explore Our Practices
                    </Button>
                  </div>
                </div>
              </ShineBorder>
            </motion.div>
          </div>
        </Section>



        {/* ══ DEPARTMENT CONTACTS ═════════════════════════════════ */}
        <Section id="team" className="py-14" style={{ background: "#f5f5f7" }}>
          <div className="container">
            <div className="mb-14 text-center">
              <motion.div variants={fadeUp} custom={0} className="mb-4 flex justify-center">
                <span className="badge-crimson"><Building2 className="w-3 h-3" /> Our Departments</span>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#1a1a1a" }}>
                Contact Our Departments.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-xl mx-auto text-base" style={{ color: "rgba(0,0,0,0.75)" }}>
                Each practice area has a dedicated department with its own specialist team. Reach out directly to the department that matches your needs.
              </motion.p>
            </div>

            {/* Department cards grid — GradientCard style */}
            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  gradient: "purple" as const,
                  badgeText: "Ataccama One Partner",
                  badgeColor: "#6C2BD9",
                  title: "Data Governance & Intelligence",
                  description: "Govern, understand, and trust your data at scale — deploying Ataccama One to unify metadata, enforce quality, and ensure regulatory compliance.",
                  ctaText: "Get in touch",
                  ctaHref: "#",
                  imageUrl: "",
                  accentColor: "#6C2BD9",
                  departmentName: "Data Governance & Intelligence",
                },
                {
                  gradient: "blue" as const,
                  badgeText: "Find Your Solution",
                  badgeColor: "#d4d3d3",
                  title: "Banking, Finance & Partnerships",
                  description: "Specialist advisory for regulated financial institutions — compliance, risk modelling, and digital transformation for banks, insurers, and fintechs across MENA.",
                  ctaText: "Get in touch",
                  ctaHref: "#",
                  imageUrl: "",
                  accentColor: "#003087",
                  departmentName: "Banking, Finance & Partnerships",
                },
                {
                  gradient: "rose" as const,
                  badgeText: "Book Your Free Discovery",
                  badgeColor: "#d4d3d3",
                  title: "AI Solutions & Consulting",
                  description: "End-to-end AI services — strategy, custom model development, MLOps, and production deployment for enterprises across the MENA region.",
                  ctaText: "Get in touch",
                  ctaHref: "#",
                  imageUrl: "",
                  accentColor: "#FF1E57",
                  departmentName: "AI Solutions & Consulting",
                },
              ].map((dept, i) => (
                <motion.div key={dept.title} variants={fadeUp} custom={i} className="h-full">
                  <GradientCard
                    gradient={dept.gradient}
                    badgeText={dept.badgeText}
                    badgeColor={dept.badgeColor}
                    title={dept.title}
                    description={dept.description}
                    ctaText={dept.ctaText}
                    ctaHref={dept.ctaHref}
                    imageUrl={dept.imageUrl}
                    accentColor={dept.accentColor}
                    departmentName={dept.departmentName}
                  />
                </motion.div>
              ))}
            </motion.div>

          </div>
        </Section>

        {/* ══ CTA BAND ════════════════════════════════════════════ */}
        <section className="py-24 cta-band relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,30,87,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="badge-crimson mb-6 inline-flex"><Sparkles className="w-3 h-3" /> Ready to Transform?</span>
              <h2 className="mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fcf7f7" }}>
                Let's Build Something<br />
                <span className="text-gradient">Exceptional Together.</span>
              </h2>
              <p className="mb-10 max-w-xl mx-auto text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
                Whether you're starting an AI strategy or scaling a data platform — our team is ready to help you move faster and further.
              </p>
              <Button
                size="lg"
                onClick={() => scrollTo("contact")}
                className="rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white px-10 py-6 text-sm"
              >
                Start the Conversation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ══ CONTACT ══════════════════════════════════════════════════ */}
        <Section id="contact" className="py-28" style={{ background: "#0d0d0e" }}>
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left */}
              <div>
                <motion.div variants={fadeUp} custom={0} className="mb-4">
                  <span className="badge-crimson"><ArrowUpRight className="w-3 h-3" /> Get in Touch</span>
                </motion.div>
                <motion.h2 variants={fadeUp} custom={1}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}>
                  Let's Talk<br />
                  <span className="text-gradient">Enterprise.</span>
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="mt-6 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
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
                        <div className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.75)" }}>{item.label}</div>
                        <div className="text-sm font-semibold" style={{ color: "#fff" }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right: form */}
              <motion.div variants={fadeUp} custom={2}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl p-8 flex flex-col gap-5" style={{ background: "#141416", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.80)" }}>Full Name</Label>
                      <Input
                        {...register("name")}
                        placeholder="Jane Smith"
                        className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid rgba(255,255,255,0.08)" }}
                      />
                      {errors.name && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.name.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.80)" }}>Company</Label>
                      <Input
                        {...register("company")}
                        placeholder="Acme Corp"
                        className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid rgba(255,255,255,0.08)" }}
                      />
                      {errors.company && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.company.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.80)" }}>Email Address</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="jane@company.com"
                      className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm"
                      style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid rgba(255,255,255,0.08)" }}
                    />
                    {errors.email && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.email.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.80)" }}>Inquiry Type</Label>
                    <Select onValueChange={val => setValue("inquiryType", val)}>
                      <SelectTrigger className="rounded-xl border-0 text-white text-sm" style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid rgba(255,255,255,0.08)" }}>
                        <SelectValue placeholder="Select a service area..." />
                      </SelectTrigger>
                      <SelectContent style={{ background: "#1c1c1f", border: "1px solid rgba(255,255,255,0.10)" }}>
                        {["Data Governance & Ataccama One", "AI Consulting & Audits", "Custom AI Solutions & Platform Development", "Banking & Finance Solutions", "General Inquiry"].map(opt => (
                          <SelectItem key={opt} value={opt} className="text-white text-sm">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.inquiryType && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.inquiryType.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.80)" }}>Message</Label>
                    <Textarea
                      {...register("message")}
                      placeholder="Tell us about your challenge or project..."
                      rows={4}
                      className="rounded-xl border-0 text-white placeholder:text-white/20 text-sm resize-none"
                      style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid rgba(255,255,255,0.08)" }}
                    />
                    {errors.message && <span className="text-xs" style={{ color: "#FF1E57" }}>{errors.message.message}</span>}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="w-full rounded-full font-bold uppercase tracking-widest shimmer-btn border-0 text-white py-6"
                  >
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                    {!submitContact.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ══ FOOTER ══════════════════════════════════════════════════ */}
        <footer style={{ background: "#313234", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="container py-16">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <AlphaLogo size={28} />
                <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.80)" }}>
                  Alpha Pro MENA — the region's leading multi-practice AI and data firm. Delivering intelligence, governance, and engineering excellence to enterprises across MENA.
                </p>

              </div>

              {/* Services */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-4 text-white">Services</div>
                <ul className="flex flex-col gap-2">
                  {["Data & Governance", "AI Consulting", "Custom AI & Platform", "Banking & Finance"].map(item => (
                    <li key={item}>
                      <button onClick={() => scrollTo("practices")} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.80)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#FF1E57")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.90)")}
                      >{item}</button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-4 text-white">Company</div>
                <ul className="flex flex-col gap-2">
                  {[{ label: "About", id: "about" }, { label: "Partnership", id: "partnership" }, { label: "Contact", id: "contact" }].map(item => (
                    <li key={item.id}>
                      <button onClick={() => scrollTo(item.id)} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.80)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#FF1E57")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.90)")}
                      >{item.label}</button>
                    </li>
                  ))}
                  <li>
                    <a href="https://www.ataccama.com/platform" target="_blank" rel="noopener noreferrer"
                      className="text-sm flex items-center gap-1 transition-colors" style={{ color: "rgba(255,255,255,0.80)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#FF1E57")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.90)")}
                    >Ataccama One <ExternalLink className="w-3 h-3" /></a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="divider-gradient mb-8" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                © {new Date().getFullYear()} Alpha Pro MENA. All rights reserved.
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                Enterprise AI & Data Solutions · MENA Region
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ══ PARTNERSHIP POPUP — small bottom-right corner widget ══════ */}
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
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(233,33,86,0.18)",
                boxShadow: "0 8px 32px -4px rgba(0,0,0,0.22), 0 0 0 1px rgba(233,33,86,0.08) inset",
              }}
            >
              {/* Subtle pink glow top-right */}
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                style={{ background: "rgba(233,33,86,0.12)", filter: "blur(24px)" }} />

              {/* Close button */}
              <button
                onClick={() => setPartnerPopupOpen(false)}
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors z-10"
                style={{ background: "rgba(0,0,0,0.06)", color: "#888" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(233,33,86,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
                aria-label="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="relative z-10 px-4 pt-4 pb-3.5">
                {/* Badge pill */}
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                  style={{ background: "rgba(233,33,86,0.10)", color: "#E92156", border: "1px solid rgba(233,33,86,0.18)" }}>
                  <Shield className="w-2.5 h-2.5" /> Exclusive MENA Partner
                </div>

                {/* Logos row */}
                <div className="flex items-center gap-2 mb-3">
                  <AlphaLogo size={20} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#1a1a1a", fontFamily: "'Barlow Condensed', sans-serif" }}>Alpha Pro MENA</span>
                  <span className="text-xs" style={{ color: "#ccc" }}>×</span>
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="#6C2BD9"/>
                    <path d="M16 7L24 25H8L16 7Z" fill="white" fillOpacity="0.9"/>
                    <circle cx="16" cy="19" r="3" fill="#6C2BD9"/>
                  </svg>
                  <span className="text-xs font-bold" style={{ color: "#6C2BD9", fontFamily: "'Barlow Condensed', sans-serif" }}>Ataccama</span>
                </div>

                {/* Short description */}
                <p className="text-[11px] leading-relaxed mb-3" style={{ color: "#666" }}>
                  Alpha Pro MENA is Ataccama's only certified Solution Partner across the Middle East and North Africa — delivering enterprise data governance at scale.
                </p>

                {/* CTA */}
                <a
                  href="https://www.ataccama.com/partners?search=alpha+pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-85"
                  style={{ background: "linear-gradient(135deg, #FF1E57 0%, #E92156 100%)" }}
                  onClick={() => setPartnerPopupOpen(false)}
                >
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
