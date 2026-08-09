import type { ReactNode } from "react";

/**
 * White panel behind the contact form, with a static rose-thread motif in the
 * trailing corner. This replaces the office loop that was generated for this
 * section: on a light theme a scrim washes that footage without calming it,
 * and its screens glow the same rose as the CTA and focus rings, so a form
 * laid over it competed with its own accent colour.
 *
 * The motif is inline SVG rather than an asset: it costs no request, and it
 * mirrors with the layout because it is anchored to the inline-end edge.
 */
export function ThreadPanel({ children }: { children: ReactNode }) {
  return (
    <div className="v4-card relative overflow-hidden p-8 lg:p-10">
      <svg
        className="pointer-events-none absolute"
        style={{ insetBlockStart: 0, insetInlineEnd: 0, width: "22rem", height: "22rem", opacity: 0.5 }}
        viewBox="0 0 320 320"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="var(--rose)" strokeWidth="0.75" opacity="0.35">
          <path d="M320 40 L232 84 L144 52 L56 96" />
          <path d="M320 104 L232 84 L232 168 L144 196" />
          <path d="M320 168 L232 168 L160 232 L72 212" />
          <path d="M144 52 L144 196 L160 232" />
          <path d="M56 96 L72 212" />
        </g>
        {[
          [232, 84],
          [144, 52],
          [56, 96],
          [232, 168],
          [144, 196],
          [160, 232],
          [72, 212],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="var(--rose)" opacity="0.55" />
        ))}
      </svg>

      <div className="relative">{children}</div>
    </div>
  );
}
