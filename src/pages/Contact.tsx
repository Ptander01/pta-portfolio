/**
 * Contact Page — Get in touch
 * Design: "Forged Monolith" — warm amber accent, neumorphic form cards
 * Content: Personal portfolio voice for Patrick Anderson
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const contactLinks = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "patrick.t.anderson1@gmail.com",
    href: "mailto:patrick.t.anderson1@gmail.com",
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

        <div className="container relative z-10 pt-32 pb-12">
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
          <FadeIn delay={0.6} duration={0.8}>
            <p
              className="body-lg max-w-xl"
              style={{ color: "var(--text-muted)" }}
            >
              Interested in collaborating or have questions about my work?
              I&rsquo;d love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ CONTACT CONTENT ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
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
