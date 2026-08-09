import { z } from "zod";

/**
 * Single source of truth for the marketing site's copy, lifted verbatim from
 * the v3 Home page so the v4 layout and the contact router agree on wording.
 * The copy was proofread before launch; do not reword it here.
 */

export type Practice = {
  id: string;
  index: string;
  title: string;
  sub: string;
  body: string;
  chips: string[];
  /** Value submitted for this practice in the contact form's select. */
  formValue: string;
};

export const PRACTICES: Practice[] = [
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

export const PARTNERS = [
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

export const PROCESS = [
  { step: "STEP 01", label: "Discovery", desc: "A structured session to understand your data landscape, AI maturity, and objectives." },
  { step: "STEP 02", label: "Roadmap", desc: "A tailored roadmap with milestones, technology recommendations, and ROI projections." },
  { step: "STEP 03", label: "Architecture", desc: "Data models, AI pipelines, integrations, and governance designed up front." },
  { step: "STEP 04", label: "Sprints", desc: "Engineering ships in sprints with continuous visibility and weekly reviews." },
  { step: "STEP 05", label: "UAT & go-live", desc: "Rigorous testing and a managed go-live ensure production readiness." },
  { step: "STEP 06", label: "Support", desc: "Ongoing support, monitoring, and continuous improvement as you scale." },
];

export const VALUES = [
  { title: "Trust and integrity", line: "The highest standards of transparency and accountability in every engagement." },
  { title: "Deep expertise", line: "Years of domain knowledge across AI, data, finance, and engineering." },
  { title: "Execution speed", line: "Fast without cutting corners. Production outcomes on enterprise timelines." },
  { title: "Client partnership", line: "We embed with your teams and measure success by your outcomes." },
  { title: "MENA focus", line: "Regional knowledge, regulatory awareness, and a network built over years." },
  { title: "Innovation first", line: "At the frontier of AI and data, so clients always have what is next." },
];

/** Shortcuts that drop the reader into the form with a practice preselected. */
export const ROUTING = [
  { label: "Data governance", practice: "Data Governance & Intelligence" },
  { label: "Banking & finance", practice: "Banking & Finance Advisory" },
  { label: "Enterprise AI", practice: "Enterprise AI & Platform Development" },
];

export const PRACTICE_OPTIONS = [...PRACTICES.map((p) => p.formValue), "General inquiry"];

export const CAPS = [
  "Data Governance",
  "Data Quality",
  "Master Data Management",
  "AI Strategy",
  "MLOps",
  "Fraud Detection",
  "Regulatory Reporting",
  "Cloud-Native Platforms",
];

export const CONTACT = {
  email: "info@alphapromena.com",
  location: "Amman, Jordan",
  response: "We reply within one business day.",
};

/**
 * External profiles rendered in the footer. Each entry renders only when it
 * holds a URL, so adding a network later is a one-line change here. The
 * LinkedIn page is the same one the v3 footer linked and that index.html
 * declares as the organisation's sameAs.
 */
export const SOCIALS: Record<string, string | null> = {
  linkedin: "https://www.linkedin.com/company/alpha-pro-consulting",
};

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.email("Valid email required"),
  inquiryType: z.string().min(1, "Select a practice"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactForm = z.infer<typeof contactSchema>;
