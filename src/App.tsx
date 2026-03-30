import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Journey from "./pages/Journey";
import ProjectDetail from "./pages/ProjectDetail";
import Work from "./pages/Work";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={Home} />
        <Route path="/work" component={Work} />
        <Route path="/work/:slug" component={ProjectDetail} />
        <Route path="/about" component={About} />
        <Route path="/journey" component={Journey} />
        <Route path="/contact" component={Contact} />
        {/* Legacy route redirect */}
        <Route path="/projects">
          {() => {
            window.location.replace("/work");
            return null;
          }}
        </Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
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
            {!isHomepage && <Navbar />}
            <main className="flex-1">
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
