/**
 * Infinite capability strip. The track is duplicated so the CSS translation
 * can loop at exactly -50% with no visible seam; the copy is hidden from
 * assistive tech so the list is announced once. Pauses on hover, and holds
 * still under reduced motion.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const track = (
    <ul className="flex items-center gap-12 pe-12">
      {items.map((item) => (
        <li key={item} className="flex shrink-0 items-center gap-12">
          <span className="whitespace-nowrap text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
            {item}
          </span>
          <span
            aria-hidden="true"
            className="h-1 w-1 shrink-0 rounded-full"
            style={{ background: "var(--rose)" }}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="v4-marquee-wrap v4-marquee-mask overflow-hidden py-6"
      style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
    >
      <div className="v4-marquee">
        {track}
        <div aria-hidden="true" className="flex">
          {track}
        </div>
      </div>
    </div>
  );
}
