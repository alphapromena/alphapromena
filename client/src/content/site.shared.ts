/**
 * Facts that must be identical in every locale.
 *
 * Analyst attributions and the customers disclaimer are contractual strings
 * that ship in English on the Arabic site too, and third-party organisation
 * names stay Latin text. Keeping them here rather than in the locale modules
 * makes it impossible to translate them by accident.
 */

export const LINKS = {
  ataccama: "https://www.ataccama.com/platform",
  bakerTilly: "https://www.bakertilly.com",
} as const;

export const SOCIALS: Record<string, string | null> = {
  linkedin: "https://www.linkedin.com/company/alpha-pro-consulting",
};

/**
 * The one published contact address. The named CEO block — personal email,
 * phone, and web line — was removed by request, so the site now publishes the
 * company inbox only. This is the same address the policy documents give.
 */
export const CONTACT_EMAIL = "info@alphapromena.com";

/** Reproduced verbatim, in English, on both locales. Do not edit or translate. */
export const ATTRIBUTIONS = {
  gartner:
    "Gartner, Magic Quadrant for Augmented Data Quality Solutions, 11 February 2026. Gartner does not endorse any vendor depicted in its publications.",
  forrester:
    "Source: The Total Economic Impact of Ataccama ONE, Forrester Consulting (2024). Based on a composite of interviewed Ataccama customers.",
  customers:
    "Organizations shown are customers of Ataccama, Alpha Pro MENA's data-platform partner.",
} as const;

/** Latin text chips in both locales. Never fetch or embed third-party logos. */
export const TRUSTED_BY = {
  middleEast: ["Digital Dubai", "Commercial Bank of Qatar", "Salama Insurance", "stc", "Bahri"],
  global: [
    "T-Mobile",
    "Lloyds",
    "Fifth Third",
    "Truist",
    "Prudential",
    "MetLife",
    "Allianz",
    "Blue Cross",
    "Vodafone",
    "Amgen",
    "Nissan",
    "Mondelez",
  ],
} as const;

/** Canonical inquiry values submitted to the contact router, English always. */
export const INQUIRY_VALUES = {
  freeAssessment: "Free AI assessment",
  general: "General inquiry",
} as const;

export const ROUTES = { en: "/", ar: "/ar" } as const;
