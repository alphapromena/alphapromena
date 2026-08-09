import {
  Database,
  Brain,
  Cpu,
  Building2,
  Globe,
  TrendingUp,
  Shield,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { z } from "zod";

/**
 * Single source of truth for the marketing site's copy.
 *
 * Lifted verbatim out of the original Home page so the v4 layout and the
 * contact router agree on wording. House style forbids em-dashes in shipped
 * copy, so the few that existed were resolved into commas or full stops
 * without changing any wording.
 */

export type Practice = {
  id: string;
  title: string;
  sub: string;
  body: string;
  link: string | null;
  linkLabel: string | null;
  features: string[];
  icon: LucideIcon;
};

export const PRACTICES: Practice[] = [
  {
    id: "data",
    title: "Data Governance & Intelligence",
    sub: "Powered by Ataccama One",
    body: "Alpha Pro MENA is Ataccama's only certified Solution Partner across the Middle East and North Africa. We help enterprises take full control of their data estate, from cataloguing and lineage to quality enforcement and regulatory compliance, by deploying the industry's leading data governance platform.",
    link: "https://www.ataccama.com/platform",
    linkLabel: "Explore Ataccama One",
    features: [
      "Data Catalog & Lineage",
      "Data Quality Rules",
      "Master Data Management",
      "Regulatory Compliance",
      "Data Mesh Architecture",
      "Metadata Management",
    ],
    icon: Database,
  },
  {
    id: "ai-consulting",
    title: "AI Consulting & Audits",
    sub: "Strategy. Readiness. Accountability.",
    body: "Before you build, you need clarity. Our AI consulting practice delivers executive-level strategy, AI readiness assessments, model audits, and ethical AI governance frameworks, so your AI investments are grounded, defensible, and aligned with business outcomes.",
    link: null,
    linkLabel: null,
    features: [
      "AI Strategy & Roadmapping",
      "Readiness Assessments",
      "Model Audits & Explainability",
      "Ethical AI Frameworks",
      "Risk & Compliance Reviews",
      "Executive Workshops",
    ],
    icon: Brain,
  },
  {
    id: "ai-implementation",
    title: "Custom AI Solutions & Platform Development",
    sub: "From prototype to production, end to end.",
    body: "We design, build, and deploy custom AI and machine learning solutions alongside the full-stack platforms that power them. From NLP pipelines and computer vision to cloud-native backends, high-performance APIs, and polished React frontends. Production-grade software that scales.",
    link: null,
    linkLabel: null,
    features: [
      "Custom ML Development",
      "NLP & Conversational AI",
      "Computer Vision",
      "MLOps & Lifecycle",
      "Cloud-Native Architecture",
      "React / Next.js Frontends",
    ],
    icon: Cpu,
  },
  {
    id: "banking",
    title: "Banking & Financial Services",
    sub: "Precision solutions for regulated industries.",
    body: "Financial institutions face unique pressures: regulatory scrutiny, legacy infrastructure, and the relentless pace of fintech disruption. We deliver AI-powered risk models, fraud detection systems, regulatory reporting automation, and intelligent customer-experience platforms.",
    link: null,
    linkLabel: null,
    features: [
      "Credit Risk & Scoring",
      "Fraud Detection & AML",
      "Regulatory Reporting",
      "Core Banking Integration",
      "Open Banking APIs",
      "Customer Intelligence",
    ],
    icon: Building2,
  },
];

export const PARTNERS = [
  {
    name: "Ataccama",
    role: "Data & Governance",
    positioning: "Only certified Solution Partner in MENA",
    desc: "We deploy Ataccama One, the industry's leading unified data management platform, for governance, quality, catalog, and master data management across the region's most demanding enterprises.",
    highlights: [
      "Unified governance & catalog",
      "Automated data quality at scale",
      "Audit-ready compliance",
    ],
    link: "https://www.ataccama.com/platform",
    linkLabel: "Explore Ataccama One",
  },
  {
    name: "Baker Tilly",
    role: "Audit, Tax & Advisory",
    positioning: "Strategic alliance across MENA",
    desc: "In alliance with Baker Tilly, one of the world's leading networks of independent audit, tax, and advisory firms, we pair our AI and data engineering with deep assurance and financial advisory expertise for regulated institutions.",
    highlights: [
      "Audit & assurance depth",
      "Tax & regulatory advisory",
      "Financial transformation",
    ],
    link: "https://www.bakertilly.com",
    linkLabel: "Explore Baker Tilly",
  },
];

export const PROCESS = [
  { step: "01", label: "Discovery & Scoping", desc: "A structured session to understand your data landscape, AI maturity, and objectives." },
  { step: "02", label: "Strategy & Roadmap", desc: "A tailored roadmap with milestones, technology recommendations, and ROI projections." },
  { step: "03", label: "Design & Architecture", desc: "We architect data models, AI pipelines, integrations, and governance up front." },
  { step: "04", label: "Build & Implement", desc: "Engineering teams ship in sprints, with continuous visibility and weekly reviews." },
  { step: "05", label: "Validate & Go Live", desc: "Rigorous UAT, performance testing, and a managed go-live ensure readiness." },
  { step: "06", label: "Support & Evolve", desc: "Ongoing support, monitoring, and continuous improvement as you scale." },
];

export const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Shield, title: "Trust & Integrity", body: "The highest standards of transparency and accountability in every engagement." },
  { icon: Brain, title: "Deep Expertise", body: "Years of domain knowledge across AI, data, finance, and engineering." },
  { icon: Zap, title: "Execution Speed", body: "Fast without cutting corners. Production outcomes on enterprise timelines." },
  { icon: Users, title: "Client Partnership", body: "We embed with your teams and measure success by your outcomes." },
  { icon: Globe, title: "MENA Focus", body: "Regional knowledge, regulatory awareness, and a network built over years." },
  { icon: TrendingUp, title: "Innovation First", body: "At the frontier of AI and data, so clients always have what's next." },
];

export const CAPS = [
  "Data Governance",
  "AI Strategy & Audits",
  "Machine Learning",
  "MLOps",
  "Fraud Detection",
  "Regulatory Reporting",
  "Data Quality",
  "Master Data Management",
  "Cloud-Native Platforms",
];

/** Department routing cards: which team a given enquiry should reach. */
export const ROUTING = [
  {
    tag: "Ataccama One Partner",
    title: "Data Governance & Intelligence",
    desc: "Govern, understand, and trust your data at scale, unifying metadata, enforcing quality, ensuring compliance.",
  },
  {
    tag: "Find your solution",
    title: "Banking, Finance & Partnerships",
    desc: "Specialist advisory for regulated institutions. Compliance, risk modelling, and digital transformation.",
  },
  {
    tag: "Free discovery",
    title: "AI Solutions & Consulting",
    desc: "End-to-end AI. Strategy, custom model development, MLOps, and production deployment for the enterprise.",
  },
];

/**
 * Options offered by the contact form's inquiry selector. Order and wording
 * match what the contact router has always received.
 */
export const PRACTICE_OPTIONS = [
  "Data Governance & Ataccama One",
  "AI Consulting & Audits",
  "Custom AI Solutions & Platform Development",
  "Banking & Finance Solutions",
  "General Inquiry",
] as const;

/** Maps a practice row to the inquiry option it should preselect. */
export const PRACTICE_TO_INQUIRY: Record<string, string> = {
  data: "Data Governance & Ataccama One",
  "ai-consulting": "AI Consulting & Audits",
  "ai-implementation": "Custom AI Solutions & Platform Development",
  banking: "Banking & Finance Solutions",
};

export const CONTACT_DETAILS = [
  { label: "Phone", val: "+962 79 186 4006", href: "tel:+962791864006" },
  { label: "Email", val: "info@alphapromena.com", href: "mailto:info@alphapromena.com" },
  { label: "Location", val: "Amman, Jordan · Saudi Arabia", href: null },
  { label: "Response", val: "Within 1 business day", href: null },
];

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.email("Valid email required"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactForm = z.infer<typeof contactSchema>;
