/**
 * The shape every locale module must satisfy.
 *
 * Both site.en.ts and site.ar.ts are typed as SiteContent, so a key that is
 * translated in one locale and forgotten in the other fails `pnpm check`
 * rather than shipping a blank section.
 *
 * Locale-invariant facts (URLs, office cities, the CEO's contact channels, and
 * the analyst attribution lines that must stay English everywhere) live in
 * site.shared.ts instead, so they cannot drift between locales.
 */

export type NavLink = { id: string; label: string };

export type Generation = {
  /** "Generation 1" and friends. */
  label: string;
  title: string;
  body: string;
};

export type Practice = {
  id: string;
  index: string;
  title: string;
  body: string;
  chips: string[];
  /**
   * Submitted verbatim as the contact form's inquiryType. Canonical English in
   * every locale so notifications and any CRM stay consistent.
   */
  formValue: string;
};

export type TitledItem = { title: string; body: string };

export type IndexedItem = { index: string; title: string; body: string };

export type AssessmentDay = {
  /** "Day 1-2" in English, "اليوم 1-2" in Arabic. Western digits in both. */
  label: string;
  title: string;
  body: string;
};

export type StatItem = {
  /** Rendered at display size: "5x", "#1", "30-50%". Western digits. */
  value: string;
  body: string;
};

export type PartnerItem = {
  name: string;
  /** PREFERRED PARTNER / STRATEGIC ALLIANCE. */
  label: string;
  body: string;
};

export type SiteContent = {
  /** BCP-47 tag used for <html lang> and hreflang. */
  locale: "en" | "ar";
  dir: "ltr" | "rtl";

  meta: {
    title: string;
    description: string;
  };

  nav: {
    links: NavLink[];
    cta: string;
    /** Label for the link to the *other* locale. */
    languageToggle: string;
    menuOpen: string;
    menuClose: string;
    skipToContent: string;
    backToTopAria: string;
  };

  hero: {
    eyebrow: string;
    /** Three stacked display lines; the third renders in rose. */
    headline: [string, string, string];
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollLabel: string;
    hudLabel: string;
  };

  /** Three viewport-filling word slams; the middle one renders in rose. */
  manifesto: [string, string, string];

  convictions: {
    heading: string;
    items: string[];
  };

  context: {
    eyebrow: string;
    heading: string;
    pullQuote: string;
    paragraphs: [string, string];
    generations: [Generation, Generation, Generation];
  };

  practices: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Practice[];
    enquire: string;
  };

  agentic: {
    eyebrow: string;
    heading: string;
    lead: string;
    agents: TitledItem[];
    safety: {
      heading: string;
      items: TitledItem[];
    };
  };

  assessment: {
    eyebrow: string;
    heading: string;
    lead: string;
    days: AssessmentDay[];
    receive: { heading: string; items: string[] };
    costs: { heading: string; items: string[] };
    cta: string;
  };

  services: {
    eyebrow: string;
    heading: string;
    lead: string;
    rows: TitledItem[];
  };

  build: {
    eyebrow: string;
    heading: string;
    intro: string;
    stops: IndexedItem[];
    pillars: { heading: string; items: TitledItem[] };
  };

  platform: {
    eyebrow: string;
    heading: string;
    lead: string;
    modules: TitledItem[];
    /** Title of the module that carries the rose-tint highlight. */
    highlightModule: string;
  };

  proof: {
    eyebrow: string;
    heading: string;
    lead: string;
    gartner: StatItem[];
    forrester: StatItem[];
    trustedHeading: string;
    rowLabels: { middleEast: string; global: string };
  };

  partners: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: PartnerItem[];
    sovereignty: {
      heading: string;
      columns: [string, string];
    };
  };

  why: {
    eyebrow: string;
    heading: string;
    items: IndexedItem[];
  };

  contact: {
    eyebrow: string;
    heading: string;
    lead: string;
    officesHeading: string;
    /** Muscat leads and carries the rose highlight. */
    offices: { city: string; primary?: boolean }[];
    labels: {
      name: string;
      company: string;
      email: string;
      practice: string;
      message: string;
    };
    placeholders: {
      name: string;
      company: string;
      email: string;
      practice: string;
      message: string;
    };
    /** Client-side zod messages. Values submitted stay English regardless. */
    errors: {
      name: string;
      company: string;
      email: string;
      inquiryType: string;
      message: string;
    };
    submit: string;
    submitting: string;
    success: string;
    failure: string;
    /** Appended to the four practice formValues in the select. */
    generalInquiry: string;
    freeAssessmentOption: string;
  };

  footer: {
    display: [string, string];
    emailCta: string;
    locationsLabel: string;
    tagline: string;
    privacy: string;
    terms: string;
    /** Suffix marking the legal pages as English-only from the Arabic site. */
    legalLanguageNote: string;
    backToTop: string;
    rights: string;
  };
};
