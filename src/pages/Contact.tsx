/**
 * Contact Page — Get in touch
 * Design: "Forged Monolith" — warm amber accent, neumorphic form cards
 * Content: Personal portfolio voice for Patrick Anderson
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import Photo from "@/components/Photo";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const contactLinks = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "ptander01@gmail.com",
    href: "mailto:ptander01@gmail.com",
  },
  {
    icon: Github,
    label: "GITHUB",
    value: "Ptander01",
    href: "https://github.com/Ptander01",
  },
  {
    icon: Linkedin,
    label: "LINKEDIN",
    value: "patrick-anderson-gis",
    href: "https://www.linkedin.com/in/patrick-anderson-gis/",
  },
  {
    icon: MapPin,
    label: "LOCATION",
    value: "Clemson, South Carolina",
    href: null,
  },
];

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent! I'll be in touch soon.", {
      description: "Thank you for reaching out.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageTransition>
      {/* ═══════ CONTACT HERO ═══════ */}
      <section
        className="relative min-h-[50vh] flex items-end overflow-hidden noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,179,71,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,179,71,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, var(--page-bg) 0%, transparent 70%)",
          }}
        />

        <div className="container relative z-10 pt-40 pb-20">
          <FadeIn delay={0.2} duration={0.8}>
            <span
              className="label-mono inline-block mb-4"
              style={{ color: "var(--amber)", fontSize: "0.7rem" }}
            >
              GET IN TOUCH
            </span>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="heading-xl mb-4" style={{ color: "var(--heading-color)" }}>
              Let&rsquo;s build
              <br />
              <span
                className="text-glow-amber"
                style={{ color: "var(--amber)" }}
              >
                something great.
              </span>
            </h1>
          </FadeIn>
          {/* Patrick's own guest-book text from the previous site, restored
              verbatim 2026-07-30. A version written for him sat here first and
              he did not recognise the voice — his words, not an approximation
              of them. Do not "improve" this copy. */}
          <div className="guest-book">
            <FadeIn delay={0.7} duration={0.8}>
              <Photo
                src="/images/me/journal.jpg"
                alt="An open journal beside a candle at a window"
                className="journal-photo"
              />
            </FadeIn>
            <FadeIn delay={0.6} duration={0.8}>
              <div className="guest-book-note">
                <span
                  className="label-mono block mb-3"
                  style={{ color: "var(--amber)", fontSize: "0.65rem" }}
                >
                  THE GUEST BOOK
                </span>
                <p>
                  Thank you so much for stopping by! I am thrilled that you took
                  the time for a brief glance into my life and work. I welcome
                  all personal or business correspondence. Sign my guest book to
                  let me know that you visited, ask any questions, or even
                  provide feedback. I look forward to hearing from you!
                </p>
                <p className="guest-book-sign">&mdash; Patrick</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT CONTENT ═══════ */}
      <section
        className="relative py-32 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Links */}
            <div className="lg:col-span-2">
              <FadeIn direction="left" duration={0.7}>
                <div className="space-y-4">
                  {contactLinks.map((link) => (
                    <div key={link.label} className="neu-raised rounded-xl p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="neu-concave rounded-lg p-3 flex items-center justify-center"
                          style={{ minWidth: 44, minHeight: 44 }}
                        >
                          <link.icon
                            size={18}
                            style={{ color: "var(--cyan)" }}
                          />
                        </div>
                        <div>
                          <div
                            className="label-mono mb-1"
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.55rem",
                            }}
                          >
                            {link.label}
                          </div>
                          {link.href ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-display text-sm font-medium hover:underline"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {link.value}
                            </a>
                          ) : (
                            <span
                              className="font-display text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {link.value}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resume Download CTA */}
                <div className="mt-6">
                  <a
                    /* Was /Patrick_Anderson_Resume.pdf — underscores and no
                       directory, which does not exist. Because vercel.json
                       rewrites misses to /index.html, the download silently
                       handed over an HTML file named .pdf rather than 404ing. */
                    href="/resume/Patrick-Anderson-Resume.pdf"
                    download
                    className="neu-raised w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-semibold text-sm transition-all"
                    style={{ color: "var(--cyan)" }}
                  >
                    <Download size={16} />
                    Download Resume
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeIn direction="right" duration={0.7} delay={0.2}>
                <form
                  onSubmit={handleSubmit}
                  className="neu-raised rounded-2xl p-8"
                >
                  <div
                    className="label-mono mb-8"
                    style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
                  >
                    SEND A MESSAGE
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="label-mono block mb-2"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.6rem",
                          }}
                        >
                          NAME
                        </label>
                        <input
                          type="text"
                          required
                          className="neu-concave w-full rounded-lg px-4 py-3 font-display text-sm outline-none focus:ring-1"
                          style={{
                            color: "var(--text-secondary)",
                            borderColor: "transparent",
                          }}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          className="label-mono block mb-2"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.6rem",
                          }}
                        >
                          EMAIL
                        </label>
                        <input
                          type="email"
                          required
                          className="neu-concave w-full rounded-lg px-4 py-3 font-display text-sm outline-none focus:ring-1"
                          style={{
                            color: "var(--text-secondary)",
                            borderColor: "transparent",
                          }}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="label-mono block mb-2"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.6rem",
                        }}
                      >
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        required
                        className="neu-concave w-full rounded-lg px-4 py-3 font-display text-sm outline-none focus:ring-1"
                        style={{
                          color: "var(--text-secondary)",
                          borderColor: "transparent",
                        }}
                        placeholder="Project inquiry"
                      />
                    </div>

                    <div>
                      <label
                        className="label-mono block mb-2"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.6rem",
                        }}
                      >
                        MESSAGE
                      </label>
                      <textarea
                        required
                        rows={5}
                        className="neu-concave w-full rounded-lg px-4 py-3 font-display text-sm outline-none focus:ring-1 resize-none"
                        style={{
                          color: "var(--text-secondary)",
                          borderColor: "transparent",
                        }}
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-display font-semibold text-sm transition-all"
                      style={{
                        color: "var(--primary-foreground)",
                        background: "var(--amber)",
                        boxShadow:
                          "0 4px 12px rgba(255, 179, 71, 0.3), 0 0 20px rgba(255, 179, 71, 0.1)",
                      }}
                    >
                      SEND MESSAGE
                    </button>
                  </div>
                </form>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
