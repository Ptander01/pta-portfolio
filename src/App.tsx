import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

/* Home and NotFound stay eager: Home is the landing page, so deferring it
   would only put a fallback in front of the first paint, and NotFound is
   small enough that a separate request costs more than it saves. Everything
   else is a route the visitor reaches by a deliberate click, which is time
   enough to fetch a chunk. */
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PieceDetail = lazy(() => import("@/pages/PieceDetail"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Projects = lazy(() => import("./pages/Projects"));
const Resume = lazy(() => import("./pages/Resume"));

/** Reserves the viewport while a route chunk arrives.
 *  Deliberately static and empty — a spinner here would reintroduce the
 *  autoplay motion this design system cut, and on a warm cache the chunk
 *  resolves fast enough that anything visible reads as a flash. */
function RouteFallback() {
  return <div style={{ minHeight: "70vh" }} aria-busy="true" />;
}

/** Canonical URL, set per route rather than baked into index.html.
 *  This is an SPA with no SSR: one static <link rel="canonical"> in the HTML
 *  is served for EVERY route, which would tell a crawler that all 48 piece
 *  pages are duplicates of the homepage. That is materially worse than having
 *  no canonical at all, so it is written from the current location instead.
 *  Query strings are dropped deliberately — /projects?industry=environmental
 *  is a filtered view of /projects, not its own document. */
function useCanonical() {
  const [location] = useLocation();
  useEffect(() => {
    const href = `https://pta-portfolio.vercel.app${location === "/404" ? "/" : location}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [location]);
}

function Router() {
  const [location] = useLocation();
  useCanonical();

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <Switch key={location}>
          <Route path="/" component={Home} />
          {/* Case studies survive; the /work index and /journey galleries were
              retired into /projects, which supersedes both. Redirect rather than
              404 so existing links and any shared URLs still land somewhere. */}
          <Route path="/work/:slug" component={ProjectDetail} />
          <Route path="/work">{() => <Redirect to="/projects" />}</Route>
          <Route path="/journey">{() => <Redirect to="/projects" />}</Route>
          <Route path="/projects/:id" component={PieceDetail} />
          <Route path="/projects" component={Projects} />
          <Route path="/about" component={About} />
          <Route path="/resume" component={Resume} />
          <Route path="/contact" component={Contact} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  const [location] = useLocation();
  const isHomepage = location === "/";

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            toastOptions={{
              style: {
                background: "var(--neu-bg-raised)",
                border: "1px solid var(--glass-border)",
                color: "var(--glass-text)",
              },
            }}
          />
          <div className="min-h-screen flex flex-col">
            {/* Keyboard users otherwise tab the whole nav on every page before
                reaching anything. Visually hidden until focused — see
                .skip-link in index.css; it must not be `display: none`, which
                would take it out of the tab order and defeat the point. */}
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            {!isHomepage && <Navbar />}
            <main id="main" className="flex-1">
              <Router />
            </main>
            {!isHomepage && <Footer />}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
