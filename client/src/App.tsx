import NotFound from "@/pages/NotFound";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

/* Route-split: the legal pages carry their pre-rendered HTML documents,
   which almost no visitor loads — keep them out of the main chunk. */
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

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--ink-950)" }} />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/terms"} component={Terms} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <a href="#main" className="v2-skip">Skip to content</a>
      <ScrollToTop />
      <Router />
      {/* Film grain (asset A6) — tiled at 4%; paints nothing until the
          texture is committed to /assets/v2/grain-512.png. */}
      <div className="v2-grain" aria-hidden="true" />
    </ErrorBoundary>
  );
}

export default App;
