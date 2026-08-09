import NotFound from "@/pages/NotFound";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import HomeV4 from "./pages/HomeV4";

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
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--ink-deep)" }} />}>
      <Switch>
        <Route path={"/"} component={HomeV4} />
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
      <a href="#main" className="v4-skip">Skip to content</a>
      <ScrollToTop />
      <Router />
    </ErrorBoundary>
  );
}

export default App;
