import PageTransition from "@/components/animations/PageTransition";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <PageTransition>
      <section
        className="min-h-screen flex items-center justify-center noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="text-center">
          <div
            className="font-display text-8xl font-bold mb-4 text-glow-cyan"
            style={{ color: "var(--cyan)" }}
          >
            404
          </div>
          <p
            className="label-mono mb-8"
            style={{ color: "var(--glass-text-muted)", fontSize: "0.7rem" }}
          >
            PAGE NOT FOUND
          </p>
          <Link href="/">
            <span
              className="neu-raised inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm"
              style={{ color: "#e2e8f0" }}
            >
              <ArrowLeft size={16} />
              BACK TO HOME
            </span>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
