import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useContent } from "@/content/locale";
import {
  ATTRIBUTIONS,
  CONTACT_EMAIL,
  INQUIRY_VALUES,
  LINKS,
  TRUSTED_BY,
} from "@/content/site.shared";
import {
  BuildRail,
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
  ThreadPanel,
  VideoBand,
  scrollToSection,
} from "@/components/ui-v4";
import { createScrub } from "@/components/ui-v4/scrub";


/**
 * Isolates a Latin run inside RTL text.
 *
 * "Agentic AI." in an RTL paragraph puts the full stop on the left, because a
 * period is direction-neutral and inherits the paragraph. <bdi dir="ltr">
 * scopes the run so its punctuation stays attached where a reader expects it.
 * Arabic-bearing strings pass through untouched.
 */
const HAS_ARABIC = /[؀-ۿ]/;
function Bidi({ text }: { text: string }) {
  if (HAS_ARABIC.test(text)) return <>{text}</>;
  return (
    <bdi dir="ltr" lang="en">
      {text}
    </bdi>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HomeV4 "SIGNAL / LIGHT"

   Light-first page on the official kit. Exactly two sections invert to a
   dark band: the free assessment and the pre-footer CTA. Every directional
   utility here is logical, so the Arabic RTL locale renders from the same
   markup with no mirrored copy of this file.
   ═══════════════════════════════════════════════════════════════════ */
export default function HomeV4() {
  const t = useContent();

  // One published value shared by the canvas and the HUD, so the readout can
  // never land a frame away from the footage it describes.
  const scrub = useRef(createScrub()).current;

  // Built from the locale's messages so validation speaks the page's language,
  // while the values that reach the server stay canonical English.
  const contactSchema = z.object({
    name: z.string().min(2, t.contact.errors.name),
    company: z.string().min(1, t.contact.errors.company),
    email: z.email(t.contact.errors.email),
    inquiryType: z.string().min(1, t.contact.errors.inquiryType),
    message: z.string().min(10, t.contact.errors.message),
  });
  type ContactForm = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const submitContact = trpc.contact.submit.useMutation({ onSuccess: () => reset() });
  const onSubmit = (data: ContactForm) => submitContact.mutate(data);

  /** Sends a reader to the form with their subject already chosen. */
  const enquire = useCallback(
    (value: string) => {
      setValue("inquiryType", value, { shouldValidate: false });
      scrollToSection("contact");
    },
    [setValue],
  );

  const bookAssessment = useCallback(
    () => enquire(INQUIRY_VALUES.freeAssessment),
    [enquire],
  );

  const marqueeTerms = [
    ...t.practices.items.map((p) => p.title),
    t.platform.modules[0].title,
    t.platform.modules[2].title,
    t.platform.modules[5].title,
    t.platform.heading,
    t.why.items[3].title,
    t.services.rows[4].title,
  ];

  return (
    <LenisProvider>
      <div className="v4 min-h-screen">
        <Grain />
        <Cursor />
        <Navbar />
        <Hud scrub={scrub} />

        <main id="main">
          {/* ══ 2. HERO ═══════════════════════════════════════════ */}
          <HeroScrub scrub={scrub}>
            <div className="relative flex h-full items-center">
              <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-10">
                <p className="v4-eyebrow">{t.hero.eyebrow}</p>

                <h1 className="v4-display v4-d1 mt-7">
                  <Bidi text={t.hero.headline[0]} />
                  <br />
                  <Bidi text={t.hero.headline[1]} />
                  <br />
                  <span className="v4-rose">
                    <Bidi text={t.hero.headline[2]} />
                  </span>
                </h1>

                <p className="v4-lead mt-8">{t.hero.sub}</p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <button className="v4-pill" onClick={bookAssessment}>
                    {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="v4-ghost" onClick={() => scrollToSection("practices")}>
                    {t.hero.ctaSecondary}
                  </button>
                </div>
              </div>

              <div
                className="absolute inset-x-0 bottom-8 mx-auto flex max-w-[1300px] items-center gap-3 px-6 lg:px-10"
                aria-hidden="true"
              >
                <span className="v4-eyebrow" style={{ fontSize: "0.62rem" }}>
                  {t.hero.scrollLabel}
                </span>
                <span
                  className="h-px w-16"
                  style={{ background: "linear-gradient(90deg, var(--rose), transparent)" }}
                />
              </div>
            </div>
          </HeroScrub>

          {/* ══ 3. MANIFESTO + CONVICTIONS ════════════════════════ */}
          <KineticManifesto words={t.manifesto} />

          <Section rule={false}>
            <Reveal>
              <h2 className="v4-display v4-d2">
                {t.convictions.heading}
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {t.convictions.items.map((item, i) => (
                <Reveal key={item} delay={i * 70}>
                  <div className="v4-card v4-card-hover h-full p-8">
                    <span className="v4-num text-[2rem] leading-none" style={{ color: "var(--rose)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="v4-body mt-5 text-[1.05rem]" style={{ color: "var(--ink)" }}>
                      {item}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* ══ 4. CONTEXT, FROM CHATBOTS TO AGENTS ═══════════════ */}
          <Section id="context" eyebrow={t.context.eyebrow}>
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <h2 className="v4-display v4-d2">
                    {t.context.heading}
                  </h2>
                  <blockquote className="v4-accent mt-10">
                    <p className="v4-display v4-d3" style={{ lineHeight: 1.3 }}>
                      {t.context.pullQuote}
                    </p>
                  </blockquote>
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <Reveal delay={80}>
                  {t.context.paragraphs.map((para) => (
                    <p key={para.slice(0, 24)} className="v4-body mb-6 text-[1.05rem]">
                      {para}
                    </p>
                  ))}
                </Reveal>
              </div>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {t.context.generations.map((gen, i) => {
                const isAgents = i === 2;
                return (
                  <Reveal key={gen.label} delay={i * 70}>
                    <div
                      className="v4-card v4-card-hover h-full p-8"
                      style={
                        isAgents
                          ? { borderColor: "var(--rose)", background: "var(--accent)" }
                          : undefined
                      }
                    >
                      <p className="v4-eyebrow" style={isAgents ? { color: "var(--rose-deep)" } : undefined}>
                        {gen.label}
                      </p>
                      <h3
                        className="v4-display v4-d3 mt-3"
                        style={isAgents ? { color: "var(--rose-deep)" } : undefined}
                      >
                        {gen.title}
                      </h3>
                      <p className="v4-body mt-3 text-[0.95rem]">{gen.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Section>

          {/* ══ 5. WHAT WE DO ═════════════════════════════════════ */}
          <Section id="practices" eyebrow={t.practices.eyebrow}>
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <Reveal>
                    <h2 className="v4-display v4-d2">
                      {t.practices.heading}
                    </h2>
                    <p className="v4-lead mt-6">{t.practices.intro}</p>
                  </Reveal>
                </div>
              </div>

              <ol className="lg:col-span-8">
                {t.practices.items.map((practice, i) => (
                  <Reveal as="li" key={practice.id} delay={i * 60}>
                    <div className="v4-rule py-12">
                      <div className="flex items-baseline gap-5">
                        <span className="v4-num text-sm" style={{ color: "var(--rose)" }}>
                          {practice.index}
                        </span>
                        <h3
                          className="v4-display v4-d2 flex-1"
                        >
                          {practice.title}
                        </h3>
                      </div>

                      <p className="v4-body mt-6 max-w-2xl">{practice.body}</p>

                      <ul className="mt-7 flex flex-wrap gap-2">
                        {practice.chips.map((chip) => (
                          <li
                            key={chip}
                            className="px-3 py-1.5 text-[0.8rem]"
                            style={{
                              border: "1px solid var(--line)",
                              borderRadius: "999px",
                              color: "var(--ink-soft)",
                              background: "var(--surface)",
                            }}
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8">
                        <button className="v4-link" onClick={() => enquire(practice.formValue)}>
                          {t.practices.enquire} <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Section>

          {/* ══ 6. FLAGSHIP, AGENTIC AI ═══════════════════════════ */}
          <Section id="agentic" eyebrow={t.agentic.eyebrow} className="bg-[var(--surface)]">
            <Reveal>
              <h2 className="v4-display v4-d2">
                {t.agentic.heading}
              </h2>
              <p className="v4-lead mt-6">{t.agentic.lead}</p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {t.agentic.agents.map((agent, i) => (
                <Reveal key={agent.title} delay={i * 50}>
                  <div className="v4-card v4-card-hover h-full p-7">
                    <h3 className="v4-display v4-d4">{agent.title}</h3>
                    <p className="v4-body mt-3 text-[0.95rem]">{agent.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Contained ink card row, deliberately not a full-bleed band. */}
            <Reveal delay={60}>
              <div
                className="mt-14 p-8 lg:p-10"
                style={{
                  background: "linear-gradient(160deg, var(--ink) 0%, var(--ink-deep) 100%)",
                  borderRadius: "var(--radius)",
                }}
              >
                <h3 className="v4-display v4-d3" style={{ color: "var(--band-text)" }}>
                  {t.agentic.safety.heading}
                </h3>
                <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {t.agentic.safety.items.map((item) => (
                    <div key={item.title}>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0" style={{ color: "var(--rose)" }} />
                        <h4 className="text-[0.95rem] font-semibold" style={{ color: "var(--band-text)" }}>
                          {item.title}
                        </h4>
                      </div>
                      <p className="mt-2 text-[0.88rem]" style={{ color: "var(--band-text-soft)" }}>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </Section>

          {/* ══ 7. FREE AI ASSESSMENT ─ DARK BAND ONE ═════════════ */}
          <section id="assessment" className="v4-band relative py-24 sm:py-32 lg:py-40">
            <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-10">
              <Reveal>
                <p className="v4-eyebrow">{t.assessment.eyebrow}</p>
                <h2
                  className="v4-display v4-d2 mt-6"
                >
                  {t.assessment.heading}
                </h2>
                <p className="v4-lead mt-6">{t.assessment.lead}</p>
              </Reveal>

              <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {t.assessment.days.map((day, i) => (
                  <Reveal as="li" key={day.label} delay={i * 60}>
                    <div className="v4-card h-full p-7">
                      <p className="v4-num text-[0.9rem]" style={{ color: "var(--rose)" }}>
                        {day.label}
                      </p>
                      <h3 className="v4-display v4-d3 mt-3">{day.title}</h3>
                      <p className="v4-body mt-3 text-[0.9rem]">{day.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>

              <div className="mt-16 grid gap-12 md:grid-cols-2">
                {[t.assessment.receive, t.assessment.costs].map((block, i) => (
                  <Reveal key={block.heading} delay={i * 70}>
                    <h3 className="v4-display v4-d3">{block.heading}</h3>
                    <ul className="mt-6">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="v4-rule flex items-start gap-3 py-4 text-[0.95rem]"
                          style={{ color: "var(--band-text-soft)" }}
                        >
                          <Check
                            className="mt-1 h-4 w-4 shrink-0"
                            style={{ color: "var(--rose)" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={80}>
                <div className="mt-14">
                  <button className="v4-pill" onClick={bookAssessment}>
                    {t.assessment.cta} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ══ 8. AI SERVICES ════════════════════════════════════ */}
          <Section id="services" eyebrow={t.services.eyebrow}>
            <Reveal>
              <h2 className="v4-display v4-d2">
                {t.services.heading}
              </h2>
              <p className="v4-lead mt-6">{t.services.lead}</p>
            </Reveal>

            <div className="mt-14">
              {t.services.rows.map((row, i) => (
                <Reveal key={row.title} delay={i * 40}>
                  <div className="v4-rule grid gap-3 py-7 md:grid-cols-12 md:gap-8">
                    <h3 className="v4-display text-[1.25rem] md:col-span-4">{row.title}</h3>
                    <p className="v4-body text-[0.98rem] md:col-span-8">{row.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* ══ 9. HOW A BUILD RUNS ═══════════════════════════════ */}
          <BuildRail />

          {/* ══ 10. PLATFORM, ATACCAMA ONE ════════════════════════ */}
          <Section id="platform" eyebrow={t.platform.eyebrow} className="bg-[var(--surface)]">
            <Reveal>
              <h2 className="v4-display v4-d2">
                {t.platform.heading}
              </h2>
              <p className="v4-lead mt-6">{t.platform.lead}</p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.platform.modules.map((module, i) => {
                const highlighted = module.title === t.platform.highlightModule;
                return (
                  <Reveal key={module.title} delay={i * 40}>
                    <div
                      className="v4-card v4-card-hover h-full p-6"
                      style={
                        highlighted
                          ? { background: "var(--accent)", borderColor: "var(--rose)" }
                          : undefined
                      }
                    >
                      <h3
                        className="v4-display v4-d4"
                        style={highlighted ? { color: "var(--rose-deep)" } : undefined}
                      >
                        {module.title}
                      </h3>
                      <p className="v4-body mt-3 text-[0.9rem]">{module.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Section>

          {/* ══ 11. PROOF ─ over the lineage loop ═════════════════ */}
          <VideoBand
            id="proof"
            src="/cinema/lineage.mp4"
            poster="/cinema/hero-still.jpg"
            scrim={0.86}
          >
            <Reveal>
              <p className="v4-eyebrow">{t.proof.eyebrow}</p>
              <h2 className="v4-display v4-d2 mt-6">
                {t.proof.heading}
              </h2>
              <p className="v4-lead mt-6">{t.proof.lead}</p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {t.proof.gartner.map((stat, i) => (
                <Reveal key={stat.value} delay={i * 60}>
                  <div className="v4-card h-full p-7">
                    <p className="v4-num text-[2.6rem] leading-none" style={{ color: "var(--rose)" }}>
                      {stat.value}
                    </p>
                    <p className="v4-body mt-4 text-[0.92rem]">{stat.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 text-[0.76rem]" style={{ color: "var(--ink-faint)" }}>
              {ATTRIBUTIONS.gartner}
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {t.proof.forrester.map((stat, i) => (
                <Reveal key={stat.value} delay={i * 50}>
                  <div className="v4-card h-full p-7">
                    <p className="v4-num text-[2.2rem] leading-none" style={{ color: "var(--rose)" }}>
                      {stat.value}
                    </p>
                    <p className="v4-body mt-3 text-[0.9rem]">{stat.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 text-[0.76rem]" style={{ color: "var(--ink-faint)" }}>
              {ATTRIBUTIONS.forrester}
            </p>

            <Reveal delay={60}>
              <div className="mt-16">
                <p className="v4-eyebrow">{t.proof.trustedHeading}</p>
                {(
                  [
                    [t.proof.rowLabels.middleEast, TRUSTED_BY.middleEast],
                    [t.proof.rowLabels.global, TRUSTED_BY.global],
                  ] as [string, readonly string[]][]
                ).map(([label, names]) => (
                  <div key={label} className="v4-rule mt-6 pt-6">
                    <p className="v4-eyebrow mb-4" style={{ color: "var(--rose-deep)" }}>
                      {label}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {names.map((name) => (
                        <li
                          key={name}
                          lang="en"
                          dir="ltr"
                          className="px-3 py-1.5 text-[0.85rem] font-medium"
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "999px",
                            background: "var(--surface)",
                            color: "var(--ink-soft)",
                          }}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="mt-6 text-[0.76rem]" style={{ color: "var(--ink-faint)" }}>
                  {ATTRIBUTIONS.customers}
                </p>
              </div>
            </Reveal>
          </VideoBand>

          {/* ══ 12. PARTNERSHIPS AND SOVEREIGNTY ══════════════════ */}
          <Section id="partners" eyebrow={t.partners.eyebrow}>
            <Reveal>
              <h2 className="v4-display v4-d2">
                {t.partners.heading}
              </h2>
              <p className="v4-lead mt-6">{t.partners.intro}</p>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {t.partners.items.map((partner, i) => (
                <Reveal key={partner.name} delay={i * 70}>
                  <article className="v4-card v4-card-hover flex h-full flex-col p-8 lg:p-10">
                    <p className="v4-eyebrow" style={{ color: "var(--rose-deep)" }}>
                      {partner.label}
                    </p>
                    <h3 className="v4-display v4-d2 mt-4" lang="en" dir="ltr">
                      {partner.name}
                    </h3>
                    <p className="v4-body mt-4 flex-1 text-[0.95rem]">{partner.body}</p>
                    <a
                      href={i === 0 ? LINKS.ataccama : LINKS.bakerTilly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="v4-link mt-7 self-start"
                    >
                      {partner.name} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={60}>
              <div className="v4-rule mt-16 pt-12">
                <h3 className="v4-display v4-d3">{t.partners.sovereignty.heading}</h3>
                <div className="mt-8 grid gap-10 md:grid-cols-2">
                  {t.partners.sovereignty.columns.map((column) => (
                    <p key={column.slice(0, 24)} className="v4-body text-[0.98rem]">
                      {column}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </Section>

          {/* ══ 13. WHY ALPHA PRO MENA ════════════════════════════ */}
          <Section id="why" eyebrow={t.why.eyebrow} className="bg-[var(--surface)]">
            <Reveal>
              <h2 className="v4-display v4-d2">
                {t.why.heading}
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-x-14 md:grid-cols-2">
              {t.why.items.map((item, i) => (
                <Reveal key={item.index} delay={i * 50}>
                  <div className="v4-rule py-8">
                    <span className="v4-num text-sm" style={{ color: "var(--rose)" }}>
                      {item.index}
                    </span>
                    <h3 className="v4-display v4-d4 mt-3">{item.title}</h3>
                    <p className="v4-body mt-2 text-[0.95rem]">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* ══ 14. CAPABILITY MARQUEE ════════════════════════════ */}
          <Marquee items={marqueeTerms} />

          {/* ══ 15. CONTACT ═══════════════════════════════════════ */}
          <Section id="contact" eyebrow={t.contact.eyebrow} rule={false}>
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <h2 className="v4-display v4-d2">
                    {t.contact.heading}
                  </h2>
                  <p className="v4-lead mt-6">{t.contact.lead}</p>

                  <div className="mt-12 sm:max-w-[20rem]">
                    <p className="v4-eyebrow">{t.contact.officesHeading}</p>
                    <ul className="mt-5">
                      {t.contact.offices.map((office) => (
                        <li
                          key={office.city}
                          className="v4-rule py-3 text-[0.95rem]"
                          style={{
                            color: office.primary ? "var(--rose-deep)" : "var(--ink-soft)",
                            fontWeight: office.primary ? 600 : 400,
                          }}
                        >
                          {office.city}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <Reveal delay={80}>
                  <ThreadPanel>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      className="grid gap-x-10 gap-y-8 sm:grid-cols-2"
                    >
                      <div className="flex flex-col gap-2">
                        <label htmlFor="v4-name" className="v4-eyebrow">
                          {t.contact.labels.name}
                        </label>
                        <input
                          id="v4-name"
                          {...register("name")}
                          className="v4-field"
                          placeholder={t.contact.placeholders.name}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && <span className="v4-error">{errors.name.message}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="v4-company" className="v4-eyebrow">
                          {t.contact.labels.company}
                        </label>
                        <input
                          id="v4-company"
                          {...register("company")}
                          className="v4-field"
                          placeholder={t.contact.placeholders.company}
                          aria-invalid={!!errors.company}
                        />
                        {errors.company && (
                          <span className="v4-error">{errors.company.message}</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="v4-email" className="v4-eyebrow">
                          {t.contact.labels.email}
                        </label>
                        <input
                          id="v4-email"
                          type="email"
                          dir="ltr"
                          {...register("email")}
                          className="v4-field"
                          placeholder={t.contact.placeholders.email}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <span className="v4-error">{errors.email.message}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="v4-inquiry" className="v4-eyebrow">
                          {t.contact.labels.practice}
                        </label>
                        {/* Labels localize; the submitted values stay English. */}
                        <select
                          id="v4-inquiry"
                          {...register("inquiryType")}
                          className="v4-field"
                          defaultValue=""
                          aria-invalid={!!errors.inquiryType}
                        >
                          <option value="" disabled>
                            {t.contact.placeholders.practice}
                          </option>
                          {t.practices.items.map((practice) => (
                            <option key={practice.formValue} value={practice.formValue}>
                              {practice.title}
                            </option>
                          ))}
                          <option value={INQUIRY_VALUES.freeAssessment}>
                            {t.contact.freeAssessmentOption}
                          </option>
                          <option value={INQUIRY_VALUES.general}>{t.contact.generalInquiry}</option>
                        </select>
                        {errors.inquiryType && (
                          <span className="v4-error">{errors.inquiryType.message}</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label htmlFor="v4-message" className="v4-eyebrow">
                          {t.contact.labels.message}
                        </label>
                        <textarea
                          id="v4-message"
                          {...register("message")}
                          rows={4}
                          className="v4-field resize-none"
                          placeholder={t.contact.placeholders.message}
                          aria-invalid={!!errors.message}
                        />
                        {errors.message && (
                          <span className="v4-error">{errors.message.message}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                        <button type="submit" className="v4-pill" disabled={submitContact.isPending}>
                          {submitContact.isPending ? (
                            t.contact.submitting
                          ) : (
                            <>
                              {t.contact.submit} <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        {/* Announced politely rather than as a toast: the result
                            belongs beside the form that produced it. */}
                        <p role="status" aria-live="polite" className="text-[0.9rem]">
                          {submitContact.isSuccess && (
                            <span style={{ color: "var(--ink)" }}>{t.contact.success}</span>
                          )}
                          {submitContact.isError && (
                            <span style={{ color: "var(--rose-deep)" }}>
                              {t.contact.failure}{" "}
                              <a href={`mailto:${CONTACT_EMAIL}`} lang="en" dir="ltr">
                                {CONTACT_EMAIL}
                              </a>
                            </span>
                          )}
                        </p>
                      </div>
                    </form>
                  </ThreadPanel>
                </Reveal>
              </div>
            </div>
          </Section>

          {/* ══ PRE-FOOTER CTA ─ DARK BAND TWO ════════════════════ */}
          <section className="v4-band relative py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-10">
              <Reveal>
                <p className="v4-display v4-band-display">
                  {t.footer.display[0]}
                  <br />
                  <span className="v4-rose">{t.footer.display[1]}</span>
                </p>
                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <button className="v4-pill" onClick={bookAssessment}>
                    {t.footer.emailCta} <ArrowRight className="h-4 w-4" />
                  </button>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="v4-link" lang="en" dir="ltr">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
}

/** Keeps the legal links reachable from the page shell in both locales. */
export function LegalLinks() {
  const t = useContent();
  return (
    <>
      <Link href="/privacy">{t.footer.privacy}</Link>
      <Link href="/terms">{t.footer.terms}</Link>
    </>
  );
}
