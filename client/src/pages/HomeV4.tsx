import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  CAPS,
  CONTACT_DETAILS,
  PARTNERS,
  PRACTICES,
  PRACTICE_OPTIONS,
  PRACTICE_TO_INQUIRY,
  ROUTING,
  VALUES,
  contactSchema,
  type ContactForm,
} from "@/content/site";
import {
  Cursor,
  Footer,
  Grain,
  HeroScrub,
  Hud,
  KineticManifesto,
  LenisProvider,
  Marquee,
  Navbar,
  Reveal,
  Section,
  VideoBand,
  scrollToSection,
} from "@/components/ui-v4";
import { ProcessRail } from "@/components/ui-v4/process-rail";

/* ═══════════════════════════════════════════════════════════════════
   HomeV4 "SIGNAL"

   Raw enterprise data is noise; the work turns it into signal. The hero
   performs that literally: scrolling assembles a particle storm into a
   governed lattice while the readout climbs to 99.9.
   ═══════════════════════════════════════════════════════════════════ */
export default function HomeV4() {
  // Written by the hero scrub every frame, read by the HUD. Deliberately a
  // ref, not state: this value changes on every animation frame.
  const heroProgress = useRef(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent. We'll be in touch shortly.");
      reset();
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const onSubmit = (data: ContactForm) => submitContact.mutate(data);

  /** Sends a practice row's reader to the form with their subject filled in. */
  const enquire = useCallback(
    (practiceId: string) => {
      const option = PRACTICE_TO_INQUIRY[practiceId];
      if (option) setValue("inquiryType", option, { shouldValidate: false });
      scrollToSection("contact");
    },
    [setValue],
  );

  return (
    <LenisProvider>
      <div className="v4 min-h-screen">
        <a href="#main" className="v4-skip">
          Skip to content
        </a>

        <Grain />
        <Cursor />
        <Navbar />
        <Hud progressRef={heroProgress} />

        <main id="main">
          {/* ══ HERO ─ pinned scrub, noise to signal ═══════════════ */}
          <HeroScrub progressRef={heroProgress}>
            <div className="relative flex h-full items-center">
              <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-10">
                <p className="v4-eyebrow">Data governance. Enterprise AI. MENA.</p>

                <h1
                  className="v4-display mt-7"
                  style={{ fontSize: "clamp(3.2rem, 11vw, 10.5rem)" }}
                >
                  From noise
                  <br />
                  to <span className="v4-rose">signal</span>
                </h1>

                <p className="v4-lead mt-8">
                  Alpha Pro MENA turns raw enterprise data into governed, intelligent systems.
                  Ataccama's only certified Solution Partner across the region.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <button className="v4-pill" onClick={() => scrollToSection("contact")}>
                    Start a project <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="v4-ghost" onClick={() => scrollToSection("practices")}>
                    See the practices
                  </button>
                </div>
              </div>

              <div
                className="absolute inset-x-0 bottom-8 mx-auto flex max-w-[1300px] items-center gap-3 px-6 lg:px-10"
                aria-hidden="true"
              >
                <span className="v4-eyebrow" style={{ fontSize: "0.62rem" }}>
                  Scroll
                </span>
                <span
                  className="h-px w-16"
                  style={{ background: "linear-gradient(90deg, var(--rose), transparent)" }}
                />
              </div>
            </div>
          </HeroScrub>

          {/* ══ MANIFESTO ═════════════════════════════════════════ */}
          <KineticManifesto />

          {/* ══ PRACTICES ═════════════════════════════════════════ */}
          <Section id="practices">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <Reveal>
                    <p className="v4-eyebrow">What we do</p>
                    <h2
                      className="v4-display mt-6"
                      style={{ fontSize: "clamp(2.4rem, 4.4vw, 3.8rem)" }}
                    >
                      Four practices,
                      <br />
                      one accountable <span className="v4-rose">partner.</span>
                    </h2>
                    <p className="v4-lead mt-6">
                      From data strategy to production software, delivered by one team that stays
                      accountable for the outcome.
                    </p>
                  </Reveal>
                </div>
              </div>

              <ol className="lg:col-span-8">
                {PRACTICES.map((practice, i) => {
                  const Icon = practice.icon;
                  return (
                    <Reveal as="li" key={practice.id} delay={i * 60}>
                      <div className="py-12" style={{ borderTop: "1px solid var(--line)" }}>
                        <div className="flex items-baseline gap-5">
                          <span
                            className="v4-num text-sm"
                            style={{ color: "var(--rose)" }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <h3
                              className="v4-display"
                              style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)" }}
                            >
                              {practice.title}
                            </h3>
                            <p className="v4-eyebrow mt-2">{practice.sub}</p>
                          </div>
                          <Icon
                            className="hidden h-5 w-5 shrink-0 sm:block"
                            style={{ color: "rgba(243,242,241,0.4)" }}
                            aria-hidden="true"
                          />
                        </div>

                        <p className="v4-body mt-6 max-w-2xl">{practice.body}</p>

                        <ul className="mt-7 flex flex-wrap gap-2">
                          {practice.features.map((feature) => (
                            <li
                              key={feature}
                              className="px-3 py-1.5 text-[0.78rem]"
                              style={{
                                border: "1px solid var(--line)",
                                color: "rgba(243,242,241,0.62)",
                              }}
                            >
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-8 flex flex-wrap items-center gap-6">
                          <button className="v4-link" onClick={() => enquire(practice.id)}>
                            Get in touch <ArrowRight className="h-4 w-4" />
                          </button>
                          {practice.link && (
                            <a
                              href={practice.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="v4-link"
                            >
                              {practice.linkLabel} <ArrowUpRight className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </ol>
            </div>
          </Section>

          {/* ══ PARTNERS ─ over the lineage loop ══════════════════ */}
          <VideoBand
            id="partners"
            src="/cinema/lineage.mp4"
            poster="/cinema/hero-still.jpg"
            scrim={0.74}
          >
            <Reveal>
              <p className="v4-eyebrow">Strategic alliances</p>
              <h2
                className="v4-display mt-6 max-w-[18ch]"
                style={{ fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)" }}
              >
                Lineage you can trust. Quality you can <span className="v4-rose">prove.</span>
              </h2>
            </Reveal>

            <div className="mt-16 grid gap-px lg:grid-cols-2" style={{ background: "var(--line)" }}>
              {PARTNERS.map((partner, i) => (
                <Reveal key={partner.name} delay={i * 80}>
                  <article
                    className="flex h-full flex-col p-8 lg:p-10"
                    style={{ background: "rgba(11,12,13,0.55)" }}
                  >
                    <p className="v4-eyebrow">{partner.role}</p>
                    <h3 className="v4-display mt-5" style={{ fontSize: "clamp(2rem, 3.4vw, 2.8rem)" }}>
                      {partner.name}
                    </h3>
                    <p className="mt-2 text-[0.95rem] font-semibold" style={{ color: "var(--rose)" }}>
                      {partner.positioning}
                    </p>
                    <p className="v4-body mt-5 flex-1 text-[0.95rem]">{partner.desc}</p>

                    <ul className="mt-7">
                      {partner.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-3 py-3 text-[0.9rem]"
                          style={{
                            borderTop: "1px solid var(--line)",
                            color: "rgba(243,242,241,0.68)",
                          }}
                        >
                          <Check className="h-4 w-4 shrink-0" style={{ color: "var(--rose)" }} />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="v4-link mt-8 self-start"
                    >
                      {partner.linkLabel} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </VideoBand>

          {/* ══ PROCESS ═══════════════════════════════════════════ */}
          <ProcessRail />

          {/* ══ VALUES ════════════════════════════════════════════ */}
          <Section id="values" eyebrow="What we hold to">
            <div className="grid gap-x-16 gap-y-0 md:grid-cols-2">
              {VALUES.map((value, i) => {
                const Icon = value.icon;
                return (
                  <Reveal key={value.title} delay={i * 50}>
                    <div className="py-9" style={{ borderTop: "1px solid var(--line)" }}>
                      <Icon
                        className="h-4 w-4"
                        style={{ color: "var(--rose)" }}
                        aria-hidden="true"
                      />
                      <h3 className="v4-display mt-4 text-[1.35rem]">{value.title}</h3>
                      <p className="v4-body mt-2 text-[0.95rem]">{value.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Section>

          {/* ══ CAPABILITY MARQUEE ════════════════════════════════ */}
          <Marquee items={CAPS} />

          {/* ══ CONTACT ─ over the team loop ══════════════════════ */}
          <VideoBand
            id="contact"
            src="/cinema/team.mp4"
            poster="/cinema/hero-still.jpg"
            scrim={0.82}
          >
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="v4-eyebrow">Get in touch</p>
                  <h2
                    className="v4-display mt-6"
                    style={{ fontSize: "clamp(2.4rem, 4.6vw, 4rem)" }}
                  >
                    Let's talk <span className="v4-rose">enterprise.</span>
                  </h2>
                  <p className="v4-lead mt-6">
                    Tell us about your challenge. Our team responds within one business day with a
                    tailored approach.
                  </p>

                  <dl className="mt-10">
                    {CONTACT_DETAILS.map((detail) => (
                      <div
                        key={detail.label}
                        className="flex items-baseline justify-between gap-4 py-4"
                        style={{ borderTop: "1px solid var(--line)" }}
                      >
                        <dt className="v4-eyebrow">{detail.label}</dt>
                        <dd className="text-right text-[0.95rem] font-medium">
                          {detail.href ? (
                            <a href={detail.href} className="v4-link">
                              {detail.val}
                            </a>
                          ) : (
                            detail.val
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-12">
                    <p className="v4-eyebrow mb-5">Reach the right team</p>
                    <ul>
                      {ROUTING.map((route) => (
                        <li
                          key={route.title}
                          className="py-4"
                          style={{ borderTop: "1px solid var(--line)" }}
                        >
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--rose)" }}>
                            {route.tag}
                          </p>
                          <p className="mt-1.5 text-[0.95rem] font-semibold">{route.title}</p>
                          <p className="v4-body mt-1 text-[0.88rem]">{route.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <Reveal delay={80}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="grid gap-x-10 gap-y-8 p-8 sm:grid-cols-2 lg:p-10"
                    style={{
                      border: "1px solid var(--line)",
                      background: "rgba(11,12,13,0.55)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <label htmlFor="v4-name" className="v4-eyebrow">
                        Full name
                      </label>
                      <input
                        id="v4-name"
                        {...register("name")}
                        className="v4-field"
                        placeholder="Jane Smith"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <span className="v4-error">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="v4-company" className="v4-eyebrow">
                        Company
                      </label>
                      <input
                        id="v4-company"
                        {...register("company")}
                        className="v4-field"
                        placeholder="Acme Corp"
                        aria-invalid={!!errors.company}
                      />
                      {errors.company && <span className="v4-error">{errors.company.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="v4-email" className="v4-eyebrow">
                        Email address
                      </label>
                      <input
                        id="v4-email"
                        type="email"
                        {...register("email")}
                        className="v4-field"
                        placeholder="jane@company.com"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <span className="v4-error">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="v4-inquiry" className="v4-eyebrow">
                        Inquiry type
                      </label>
                      <select
                        id="v4-inquiry"
                        {...register("inquiryType")}
                        className="v4-field"
                        defaultValue=""
                        aria-invalid={!!errors.inquiryType}
                      >
                        <option value="" disabled>
                          Select a service area...
                        </option>
                        {PRACTICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.inquiryType && (
                        <span className="v4-error">{errors.inquiryType.message}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label htmlFor="v4-message" className="v4-eyebrow">
                        Message
                      </label>
                      <textarea
                        id="v4-message"
                        {...register("message")}
                        rows={4}
                        className="v4-field resize-none"
                        placeholder="Tell us about your challenge or project..."
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && <span className="v4-error">{errors.message.message}</span>}
                    </div>

                    <div className="sm:col-span-2">
                      <button type="submit" className="v4-pill" disabled={submitContact.isPending}>
                        {submitContact.isPending ? (
                          "Sending..."
                        ) : (
                          <>
                            Send message <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </Reveal>
              </div>
            </div>
          </VideoBand>
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
}
