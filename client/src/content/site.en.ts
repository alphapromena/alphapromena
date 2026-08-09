import type { SiteContent } from "./types";
import { INQUIRY_VALUES } from "./site.shared";

/**
 * English copy, transcribed from the 2026 company profile (pages 02 to 13).
 * This is final approved copy: do not reword, and keep it free of em-dashes.
 */
export const en: SiteContent = {
  locale: "en",
  dir: "ltr",

  meta: {
    title: "Alpha Pro MENA | Agentic AI. Trusted Data. Built to Run.",
    description:
      "Preferred Partner of Ataccama. Alpha Pro MENA assesses, designs, and builds production AI for government and enterprise across MENA, starting with a free AI assessment.",
  },

  nav: {
    links: [
      { id: "practices", label: "What we do" },
      { id: "agentic", label: "Agentic AI" },
      { id: "assessment", label: "Free assessment" },
      { id: "platform", label: "Platform" },
      { id: "proof", label: "Proof" },
    ],
    cta: "Book your free AI assessment",
    languageToggle: "العربية",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    skipToContent: "Skip to content",
    backToTopAria: "Alpha Pro MENA, back to top",
  },

  hero: {
    eyebrow: "AI for government and enterprise · MENA",
    headline: ["Agentic AI.", "Trusted Data.", "Built to Run."],
    sub: "We assess, design, and build production AI for government and enterprise across MENA, starting with a free AI assessment and ending with agents that work in your systems.",
    ctaPrimary: "Book your free AI assessment",
    ctaSecondary: "See what we do",
    scrollLabel: "Scroll",
    hudLabel: "Data quality",
  },

  manifesto: ["Assess.", "Build.", "Run."],

  convictions: {
    heading: "An AI company that builds, not just advises",
    items: [
      "Agents are only as good as the data beneath them.",
      "AI must be Arabic-first and sovereignty-aware.",
      "A pilot that never reaches production is a cost, not a capability.",
    ],
  },

  context: {
    eyebrow: "Context",
    heading: "From chatbots to agents",
    pullQuote:
      "The question has moved from 'can AI answer this?' to 'can AI do this, end to end, safely, in our systems?'",
    paragraphs: [
      "National programs, Saudi Vision 2030 and Oman Vision 2040 foremost among them, are reorganizing entire economies around data, automation, and artificial intelligence. Institutions have run their first AI experiments. Many now hold a portfolio of promising pilots and very little in production.",
      "The shift underway is from assistants that answer to agents that act: systems that read a case file, check it against policy, call the systems of record, take the routine action, and escalate the exception. That step demands governed data, integration into real systems, and an operating model for supervision, precisely the gap Alpha Pro MENA was built to close.",
    ],
    generations: [
      {
        label: "Generation 1",
        title: "Assistants",
        body: "Answer questions from documents. Useful, contained, human-driven.",
      },
      {
        label: "Generation 2",
        title: "Copilots",
        body: "Draft, summarize, and recommend inside an existing workflow.",
      },
      {
        label: "Generation 3",
        title: "Agents",
        body: "Plan, use tools, act on systems of record, and hand off with an audit trail.",
      },
    ],
  },

  practices: {
    eyebrow: "What we do",
    heading: "Four practices, one accountable partner.",
    intro:
      "Four connected practices, delivered end to end by one team: assessment, agents, data, and automation.",
    enquire: "Get in touch",
    items: [
      {
        id: "agentic",
        index: "01",
        title: "Agentic AI",
        body: "Autonomous and semi-autonomous agents that plan, use tools, act on your systems of record, and escalate to people by design, with full traceability.",
        chips: ["Case and service agents", "Document agents", "Compliance agents", "Operations agents"],
        formValue: "Agentic AI",
      },
      {
        id: "services",
        index: "02",
        title: "AI Services and Build",
        body: "Advisory, use-case design, and a full engineering studio that takes AI products from discovery to a live, supported production system.",
        chips: ["AI strategy", "Use-case discovery", "Proof of value", "Managed AI operations"],
        formValue: "AI Services and Build",
      },
      {
        id: "data",
        index: "03",
        title: "Intelligent Data",
        body: "Trustworthy data foundations on Ataccama ONE: governance, quality, catalog, lineage, and master data, the fuel every agent depends on.",
        chips: ["Data quality", "Catalog and lineage", "Master data", "Governance"],
        formValue: "Intelligent Data",
      },
      {
        id: "automation",
        index: "04",
        title: "Enterprise Automation",
        body: "Process automation and system integration that cut cycle times and return capacity to people doing high-value work.",
        chips: ["ERP", "CRM", "Core banking", "Government platforms"],
        formValue: "Enterprise Automation",
      },
    ],
  },

  agentic: {
    eyebrow: "Flagship",
    heading: "Agentic AI",
    lead: "We build agents that do work, not demos. Each one is scoped to a real process, connected to the systems that hold the truth, and bounded by explicit permissions, approvals, and logging.",
    agents: [
      {
        title: "Case and Service Agents",
        body: "Intake, triage, and resolve citizen or customer requests across channels, in Arabic and English.",
      },
      {
        title: "Document Agents",
        body: "Read contracts, claims, invoices, and filings; extract, validate against policy, and route.",
      },
      {
        title: "Compliance Agents",
        body: "Monitor transactions and records against regulation, flag exceptions with evidence.",
      },
      {
        title: "Data Steward Agents",
        body: "Detect quality issues, propose fixes, and maintain golden records continuously.",
      },
      {
        title: "Knowledge Agents",
        body: "Answer from your own governed corpus with citations. No hallucinated policy.",
      },
      {
        title: "Operations Agents",
        body: "Reconcile, schedule, and close the loop between ERP, CRM, and back-office systems.",
      },
    ],
    safety: {
      heading: "How we keep agents safe",
      items: [
        { title: "Bounded autonomy", body: "Explicit tool permissions and action limits per agent." },
        { title: "Human in the loop", body: "Approval gates on anything irreversible or high-value." },
        { title: "Full audit trail", body: "Every step, source, and decision logged and reviewable." },
        { title: "Evaluation before scale", body: "Measured accuracy on your data before an agent goes live." },
      ],
    },
  },

  assessment: {
    eyebrow: "No cost, no obligation",
    heading: "Free AI Assessment",
    lead: "A structured, no-cost, one-week engagement that tells your leadership exactly where AI will pay in your organization, what your data can support today, and what it will take to build it. You keep the findings whether or not you work with us.",
    days: [
      {
        label: "Day 1-2",
        title: "Discover",
        body: "Interviews with business and IT leaders; map priority processes, systems, and pain.",
      },
      {
        label: "Day 2-3",
        title: "Diagnose",
        body: "Data readiness, quality, and governance check; integration and infrastructure review.",
      },
      {
        label: "Day 4",
        title: "Prioritize",
        body: "Score candidate use cases on value, feasibility, and risk; agree the first agent.",
      },
      {
        label: "Day 5",
        title: "Report",
        body: "Executive readout: roadmap, effort, cost, and expected return, yours to keep.",
      },
    ],
    receive: {
      heading: "What you receive",
      items: [
        "AI readiness score across data, systems, skills, and governance",
        "A ranked shortlist of use cases with value and effort estimates",
        "A 12-month roadmap with a defined first build",
        "Data and compliance risks, named and prioritized",
      ],
    },
    costs: {
      heading: "What it costs you",
      items: [
        "No fee, no obligation, no procurement process",
        "Roughly six to eight hours of your team's time",
        "Conducted under NDA; nothing leaves your environment",
        "Delivered on site in Muscat, Amman, or Riyadh, or remotely",
      ],
    },
    cta: "Book your free AI assessment",
  },

  services: {
    eyebrow: "AI services",
    heading: "Engagements sized to where you are.",
    lead: "Engagements sized to where you are, from a first strategy through running a live AI estate.",
    rows: [
      {
        title: "AI Strategy and Roadmap",
        body: "Executive-level direction: where AI creates value, what to sequence, what it costs, and how success is measured.",
      },
      {
        title: "Use-Case Discovery",
        body: "Structured workshops that turn departmental ambition into scoped, buildable agent specifications.",
      },
      {
        title: "AI Governance and Policy",
        body: "Acceptable-use policy, model and agent risk frameworks, review boards, and audit readiness aligned to national regulation.",
      },
      {
        title: "Data Readiness",
        body: "Assess and remediate the data an AI programme depends on, using Ataccama ONE as the working platform.",
      },
      {
        title: "Proof of Value",
        body: "A four-to-six week build against a real process with measured results, designed from day one to be productionizable.",
      },
      {
        title: "Managed AI Operations",
        body: "Run, monitor, evaluate, and improve deployed agents: accuracy tracking, cost control, and model updates.",
      },
      {
        title: "Enablement and Training",
        body: "Bring your own teams up the curve: executive briefings, practitioner training, and hands-on pairing with our engineers.",
      },
    ],
  },

  build: {
    eyebrow: "How a build runs",
    heading: "AI build, engineering that ships",
    intro:
      "What sets Alpha Pro MENA apart is not a slide deck, it is a working engineering practice. Our Amman-based team builds and deploys real systems: agent platforms, data pipelines, integrations, and applications that go live and stay live.",
    stops: [
      { index: "01", title: "Scope", body: "Process, data, success metric, and guardrails agreed in writing." },
      { index: "02", title: "Ground", body: "Connect and clean the data the agent will reason over." },
      { index: "03", title: "Build", body: "Agent logic, tools, integrations, and interface in two-week increments." },
      { index: "04", title: "Evaluate", body: "Measured accuracy and safety against a labelled set from your data." },
      { index: "05", title: "Operate", body: "Deploy, monitor, and improve, with handover or managed service." },
    ],
    pillars: {
      heading: "What we build on",
      items: [
        {
          title: "Models",
          body: "Frontier and open-weight models, deployed in cloud or on sovereign infrastructure.",
        },
        {
          title: "Data",
          body: "Ataccama ONE for governance, quality, catalog, lineage, and master data.",
        },
        {
          title: "Integration",
          body: "APIs into ERP, CRM, core banking, and government platforms of record.",
        },
      ],
    },
  },

  platform: {
    eyebrow: "Platform",
    heading: "Ataccama ONE",
    lead: "Agents inherit the quality of the data they read. As Preferred Partner of Ataccama, we implement a unified data trust platform that brings every discipline of data management into a single architecture, so AI has something dependable to stand on.",
    highlightModule: "ONE AI Agent",
    modules: [
      {
        title: "Data Quality",
        body: "Profiling, rules, and enforcement at scale: finding and fixing errors, gaps, and duplicates.",
      },
      {
        title: "Data Catalog",
        body: "Discover, classify, and understand every data asset across the organization.",
      },
      {
        title: "Data Lineage",
        body: "End-to-end, field-level traceability for defensible audits and reporting.",
      },
      {
        title: "Data Observability",
        body: "Detect anomalies and data issues before they spread downstream.",
      },
      {
        title: "Governance",
        body: "Policies, ownership, and compliance: clear accountability for every dataset.",
      },
      {
        title: "Master Data Management",
        body: "One trusted, golden record per entity, reconciled across systems.",
      },
      {
        title: "Reference Data",
        body: "Consistent, shared definitions and lookup values across the enterprise.",
      },
      {
        title: "ONE AI Agent",
        body: "A digital data steward that automates trust with built-in ML and generative AI.",
      },
    ],
  },

  proof: {
    eyebrow: "Proof",
    heading: "Analyst-recognized, enterprise-proven.",
    lead: "Ataccama is trusted by leading enterprises across the region and worldwide, the same platform foundation Alpha Pro MENA delivers locally.",
    gartner: [
      {
        value: "5x",
        body: "Named a Leader in the 2026 Gartner Magic Quadrant for Augmented Data Quality, the fifth consecutive year.",
      },
      {
        value: "#1",
        body: "Positioned furthest for Completeness of Vision among all evaluated vendors in the 2026 Magic Quadrant.",
      },
      {
        value: "3/5",
        body: "Highest scores overall across three of five use cases in the 2026 Gartner Critical Capabilities report.",
      },
    ],
    forrester: [
      { value: "30-50%", body: "Productivity increase across data management teams" },
      { value: "10-55%", body: "Lower technology spend on data management tools" },
      { value: "2-4x", body: "Lower risk of penalties, fraud, and breaches" },
      { value: "2-8%", body: "Revenue increase from better-governed data" },
    ],
    trustedHeading: "Trusted by",
    rowLabels: { middleEast: "Middle East", global: "Global" },
  },

  partners: {
    eyebrow: "Partnerships",
    heading: "Sovereign and compliant by design.",
    intro:
      "Two strategic relationships give clients a best-in-class technology foundation and the assurance of a global professional-services network.",
    items: [
      {
        name: "Ataccama",
        label: "Preferred partner",
        body: "A recognized global leader in data management, data quality, and governance. The partnership pairs Ataccama's enterprise platform with our regional delivery capability, giving clients across MENA a best-in-class data foundation, implemented by a team that knows the ground.",
      },
      {
        name: "Baker Tilly Saudi Arabia",
        label: "Strategic alliance",
        body: "Alpha Pro MENA serves as the technology and AI delivery arm of a strategic alliance with Baker Tilly Saudi Arabia, extending our reach into enterprise and government programs with the assurance, governance, and advisory depth of a global professional-services network.",
      },
    ],
    sovereignty: {
      heading: "Sovereign and compliant by design",
      columns: [
        "Systems serving the institutions of this region must respect where data lives and the rules that govern it. We design for data sovereignty and regulatory alignment from the outset, including Oman's Personal Data Protection Law, Saudi Arabia's PDPL, and the data-residency expectations of public-sector and regulated clients.",
        "Our agents and platforms can run inside national boundaries, on approved infrastructure, with governance that stands up to scrutiny. This is not a constraint we work around; it is a foundation we build on.",
      ],
    },
  },

  why: {
    eyebrow: "Why Alpha Pro MENA",
    heading: "Six reasons institutions choose us.",
    items: [
      {
        index: "01",
        title: "We start by giving, not selling",
        body: "A free AI assessment puts a credible, evidence-based plan in your hands before any commitment.",
      },
      {
        index: "02",
        title: "Agents that reach production",
        body: "We build for deployment from day one: evaluated, integrated, supervised, and supported.",
      },
      {
        index: "03",
        title: "A trusted data foundation",
        body: "Ataccama Preferred Partner, with an analyst-recognized platform behind every AI engagement.",
      },
      {
        index: "04",
        title: "Arabic-first, sovereignty-aware",
        body: "Solutions built for the region's languages and regulations from the first line of code.",
      },
      {
        index: "05",
        title: "Strategy and execution under one roof",
        body: "Advisory and engineering in the same organization, so plans become working systems.",
      },
      {
        index: "06",
        title: "Present in the Gulf and the Levant",
        body: "Muscat, Riyadh, and Amman, on the ground with clients, not flown in for milestones.",
      },
    ],
  },

  contact: {
    eyebrow: "Get in touch",
    heading: "Let's talk.",
    lead: "One week, no cost, no obligation, and a roadmap you keep either way. If your organization is building toward an AI-driven future and needs a partner who can deliver, we would welcome the conversation.",
    officesHeading: "Offices",
    offices: [
      { city: "Muscat, Oman", primary: true },
      { city: "Amman, Jordan" },
      { city: "Riyadh, Saudi Arabia" },
      { city: "Washington State, USA" },
    ],
    directHeading: "Direct",
    directRole: "Chief Executive Officer",
    labels: {
      name: "Full name",
      company: "Company",
      email: "Email address",
      practice: "Practice",
      message: "Message",
      emailChannel: "Email",
      phoneChannel: "Phone",
      webChannel: "Web",
    },
    placeholders: {
      name: "Jane Smith",
      company: "Acme Corp",
      email: "jane@company.com",
      practice: "Select a practice...",
      message: "Tell us about your challenge or project...",
    },
    errors: {
      name: "Name is required",
      company: "Company is required",
      email: "Valid email required",
      inquiryType: "Select a practice",
      message: "Message must be at least 10 characters",
    },
    submit: "Send message",
    submitting: "Sending...",
    success: "Message sent. We'll be in touch shortly.",
    failure: "Something went wrong. Please try again, or email",
    generalInquiry: INQUIRY_VALUES.general,
    freeAssessmentOption: INQUIRY_VALUES.freeAssessment,
  },

  footer: {
    display: ["Ready to see", "what AI can do here?"],
    emailCta: "Book your free AI assessment",
    locationsLabel: "Muscat · Amman · Riyadh · Washington State",
    tagline: "Agentic AI · AI Services & Build · Intelligent Data",
    privacy: "Privacy",
    terms: "Terms",
    legalLanguageNote: "",
    backToTop: "Back to top",
    rights: "All rights reserved.",
  },
};
