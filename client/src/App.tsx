import NotFound from "@/pages/NotFound";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import HomeV4 from "./pages/HomeV4";
import { LocaleProvider, useContent, type Locale } from "./content/locale";

/* Route-split: the legal pages carry their pre-rendered HTML documents,
   which almost no visitor loads, so keep them out of the main chunk. */
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

/**
 * Reset scroll to the top on client-side route changes (e.g. clicking a
 * footer link from the bottom of the page). Skipped when the URL carries
 * a hash so in-page "#section" anchors still scroll to their target.
 */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}

/** Skip link needs the active locale's wording, so it lives inside the provider. */
function SkipLink() {
  const t = useContent();
  return (
    <a href="#main" className="v4-skip">
      {t.nav.skipToContent}
    </a>
  );
}

/**
 * Wraps a page in its locale. The path is the only source of truth: there is
 * no redirect on browser language, so a shared link always lands where it says.
 */
function Localized({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleProvider locale={locale}>
      <SkipLink />
      {children}
    </LocaleProvider>
  );
}

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--paper)" }} />}>
      <Switch>
        <Route path="/">
          <Localized locale="en">
            <HomeV4 />
          </Localized>
        </Route>
        <Route path="/ar">
          <Localized locale="ar">
            <HomeV4 />
          </Localized>
        </Route>
        {/* Legal documents stay English in both locales. */}
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Router />
    </ErrorBoundary>
  );
}

export default App;
