import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { en } from "./site.en";
import { ar } from "./site.ar";
import type { SiteContent } from "./types";

export type Locale = "en" | "ar";

const MODULES: Record<Locale, SiteContent> = { en, ar };

/** Path each locale lives at. English keeps "/" so launched SEO is untouched. */
export const LOCALE_PATH: Record<Locale, string> = { en: "/", ar: "/ar" };

export const OTHER_LOCALE: Record<Locale, Locale> = { en: "ar", ar: "en" };

const ContentContext = createContext<SiteContent>(en);

/** Active locale's copy. Every section reads its strings from here. */
export function useContent(): SiteContent {
  return useContext(ContentContext);
}

/**
 * Supplies the locale's copy and keeps the document in sync with it.
 *
 * lang and dir live on <html> rather than a wrapper so that form controls,
 * scrollbars, and the browser's own text handling pick up the direction, and
 * so `:lang(ar)` selectors in the stylesheet match everywhere.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const content = useMemo(() => MODULES[locale], [locale]);

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;
    root.lang = content.locale;
    root.dir = content.dir;
    return () => {
      root.lang = previousLang;
      root.dir = previousDir;
    };
  }, [content.locale, content.dir]);

  // Title and description are per-locale; hreflang alternates are emitted for
  // both so each version points at the other and at the x-default.
  useEffect(() => {
    document.title = content.meta.title;

    const setMeta = (name: string, value: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = value;
    };
    setMeta("description", content.meta.description);

    const origin = window.location.origin;
    const alternates: [string, string][] = [
      ["en", `${origin}/`],
      ["ar", `${origin}/ar`],
      ["x-default", `${origin}/`],
    ];
    document
      .querySelectorAll('link[rel="alternate"][data-locale-alt]')
      .forEach((node) => node.remove());
    for (const [hreflang, href] of alternates) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = hreflang;
      link.href = href;
      link.dataset.localeAlt = "true";
      document.head.appendChild(link);
    }
  }, [content.meta.title, content.meta.description]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
