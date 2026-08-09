import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomeV4 from "./pages/HomeV4";

// The policy pages pull in a full markdown renderer with syntax highlighting
// and diagram support. Splitting them out keeps roughly a megabyte of that
// out of the landing page's entry chunk.
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
    <Suspense fallback={<div style={{ minHeight: "100svh", background: "#1A1C1E" }} />}>
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
      <ThemeProvider defaultTheme="light" switchable={false}>
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
