import { useState } from "react";
import { Button, ButtonLink, CardV2, Eyebrow, LineageNode, Section } from "@/components/ui-v2";

/**
 * Temporary design-review route for the Lineage foundation (Phase 1).
 * Renders every token and primitive for browser review. Deleted in Phase 6.
 */

const COLORS = [
  { token: "--ink-950", hex: "#070A10", use: "Page background" },
  { token: "--ink-900", hex: "#0A0E16", use: "Base surfaces" },
  { token: "--ink-800", hex: "#101622", use: "Raised cards, inputs" },
  { token: "--line", hex: "#1C2432", use: "Hairlines, borders" },
  { token: "--sand-100", hex: "#EDE6D6", use: "Primary text" },
  { token: "--sand-400", hex: "#A9A08C", use: "Secondary text" },
  { token: "--brass-500", hex: "#C8A24A", use: "Accent: thread, CTAs, active nodes" },
  { token: "--brass-400", hex: "#D4B36A", use: "Accent hover" },
  { token: "--brass-glow", hex: "rgba(200,162,74,0.16)", use: "Glows, focus rings" },
];

const SPACING = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];

const MOTION = [
  { token: "--dur-fast", value: "150ms", use: "Hover, focus" },
  { token: "--dur-med", value: "300ms", use: "Panel swaps, card lift" },
  { token: "--dur-slow", value: "700ms", use: "Thread draw, node pulse" },
  { token: "--ease", value: "cubic-bezier(0.22, 1, 0.36, 1)", use: "Everything" },
];

function Swatch({ token, hex, use }: { token: string; hex: string; use: string }) {
  return (
    <CardV2 className="overflow-hidden">
      <div className="h-20" style={{ background: `var(${token})` }} />
      <div className="p-4" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="mono text-[13px]" style={{ color: "var(--sand-100)" }}>{token}</div>
        <div className="mono text-[12px] mt-1" style={{ color: "var(--brass-500)" }}>{hex}</div>
        <div className="v2-small mt-1">{use}</div>
      </div>
    </CardV2>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-16 first:mt-0">
      <div className="mono text-[12px] uppercase tracking-[0.08em] pb-3 mb-8" style={{ color: "var(--sand-400)", borderBottom: "1px solid var(--line)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function DevTokens() {
  const [pulseKey, setPulseKey] = useState(0);

  return (
    <div className="min-h-screen" style={{ background: "var(--ink-950)" }}>
      <Section>
        <Eyebrow index="DEV / 00">Lineage foundation review</Eyebrow>
        <h1 className="v2-display mt-6" style={{ maxWidth: "18ch" }}>Tokens and primitives.</h1>
        <p className="v2-body mt-6" style={{ maxWidth: "52ch" }}>
          Temporary route for reviewing the Phase 1 design foundation in the browser.
          This page is deleted in Phase 6.
        </p>

        <Block title="Palette — 9 tokens">
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {COLORS.map((c) => <Swatch key={c.token} {...c} />)}
          </div>
          <div className="v2-small mt-6">
            Contrast: brass-500 on ink-900 ≈ 7.5:1 · sand-100 on ink-900 &gt; AAA · sand-400 on ink-900 &gt; AA.
          </div>
        </Block>

        <Block title="Type scale — Archivo display, IBM Plex Sans body, IBM Plex Mono utility">
          <div className="flex flex-col gap-10">
            <div>
              <div className="mono text-[12px] mb-2" style={{ color: "var(--sand-400)" }}>--text-display · Archivo Variable · wdth 122 · wght 750</div>
              <div className="v2-display">Data you can govern.</div>
            </div>
            <div>
              <div className="mono text-[12px] mb-2" style={{ color: "var(--sand-400)" }}>--text-h2 · Archivo Variable · wdth 122 · wght 720</div>
              <div className="v2-h2">Partnerships that raise the bar.</div>
            </div>
            <div>
              <div className="mono text-[12px] mb-2" style={{ color: "var(--sand-400)" }}>--text-h3 · Archivo Variable · wdth 118 · wght 650</div>
              <div className="v2-h3">Discovery and scoping</div>
            </div>
            <div>
              <div className="mono text-[12px] mb-2" style={{ color: "var(--sand-400)" }}>--text-body · IBM Plex Sans 400 · 1.0625rem</div>
              <p className="v2-body" style={{ maxWidth: "62ch" }}>
                Alpha Pro MENA helps enterprises across the GCC catalogue, govern, and activate their data.
                Certified Ataccama Solution Partner. Trusted by banks, insurers, and government.
              </p>
            </div>
            <div>
              <div className="mono text-[12px] mb-2" style={{ color: "var(--sand-400)" }}>--text-small · IBM Plex Sans 400 · 0.875rem</div>
              <p className="v2-small" style={{ maxWidth: "62ch" }}>We reply within one business day.</p>
            </div>
            <div>
              <div className="mono text-[12px] mb-2" style={{ color: "var(--sand-400)" }}>--text-mono · IBM Plex Mono 500 · 0.8125rem · tracking 0.08em</div>
              <Eyebrow index="CATALOG / 01">Practices</Eyebrow>
            </div>
          </div>
        </Block>

        <Block title="Spacing — 4px base">
          <div className="flex flex-col gap-2">
            {SPACING.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="mono text-[12px] w-24 shrink-0" style={{ color: "var(--sand-400)" }}>--space-{s}</span>
                <span className="h-4" style={{ width: `var(--space-${s})`, background: "var(--brass-500)" }} />
                <span className="mono text-[12px]" style={{ color: "var(--sand-400)" }}>{s * 4}px</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Motion">
          <div className="flex flex-col gap-2">
            {MOTION.map((m) => (
              <div key={m.token} className="flex items-baseline gap-4">
                <span className="mono text-[12px] w-24 shrink-0" style={{ color: "var(--sand-400)" }}>{m.token}</span>
                <span className="mono text-[13px]" style={{ color: "var(--sand-100)" }}>{m.value}</span>
                <span className="v2-small">{m.use}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Eyebrow">
          <div className="flex flex-col gap-4">
            <Eyebrow index="CATALOG / 01">Practices</Eyebrow>
            <Eyebrow index="LINEAGE / STEP 03">Architecture</Eyebrow>
            <Eyebrow index="REGISTRY">Partnerships</Eyebrow>
            <Eyebrow>Open a record</Eyebrow>
          </div>
        </Block>

        <Block title="Button — brass, ghost, disabled, link">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="brass">Book a discovery call</Button>
            <Button variant="ghost">Explore practices</Button>
            <Button variant="brass" disabled>Sending…</Button>
            <Button variant="ghost" disabled>Disabled ghost</Button>
            <ButtonLink variant="ghost" href="https://www.ataccama.com/platform" target="_blank" rel="noopener noreferrer">
              Anchor as button
            </ButtonLink>
          </div>
          <div className="v2-small mt-4">Tab onto a button to check the brass focus ring.</div>
        </Block>

        <Block title="CardV2 — static and interactive">
          <div className="grid gap-4 md:grid-cols-2" style={{ maxWidth: "720px" }}>
            <CardV2 className="p-6">
              <div className="mono text-[12px] uppercase tracking-[0.08em]" style={{ color: "var(--brass-500)" }}>Static</div>
              <div className="v2-h3 mt-3">Certification record</div>
              <p className="v2-small mt-2">1px hairline border, 8px radius, no drop shadow. Nothing moves.</p>
            </CardV2>
            <CardV2 interactive className="p-6">
              <div className="mono text-[12px] uppercase tracking-[0.08em]" style={{ color: "var(--brass-500)" }}>Interactive</div>
              <div className="v2-h3 mt-3">Hover me</div>
              <p className="v2-small mt-2">Lifts 2px with a brass glow. Lift suppressed under reduced motion.</p>
            </CardV2>
          </div>
        </Block>

        <Block title="LineageNode — idle, active, pulse replay">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <LineageNode />
              <span className="v2-small">Idle</span>
            </div>
            <div className="flex items-center gap-3">
              <LineageNode active key={pulseKey} />
              <span className="v2-small">Active</span>
            </div>
            <Button variant="ghost" onClick={() => setPulseKey((k) => k + 1)}>Replay pulse</Button>
          </div>
          <div className="mt-10 flex flex-col items-start" style={{ paddingLeft: "5px" }}>
            <LineageNode active key={`t-${pulseKey}`} style={{ marginLeft: "-5.5px" }} />
            <span className="block" style={{ width: "1px", height: "72px", background: "linear-gradient(180deg, var(--brass-500), var(--line))" }} />
            <LineageNode style={{ marginLeft: "-5.5px" }} />
            <span className="block" style={{ width: "1px", height: "72px", background: "var(--line)" }} />
            <LineageNode style={{ marginLeft: "-5.5px" }} />
            <span className="v2-small mt-4" style={{ marginLeft: "12px" }}>Thread mock: active head, idle downstream nodes.</span>
          </div>
        </Block>
      </Section>
    </div>
  );
}
