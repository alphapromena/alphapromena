/**
 * Site-wide film grain. A single tiling SVG noise texture at ~3.5% opacity,
 * inlined in CSS so it costs no request and cannot flash in late.
 */
export function Grain() {
  return <div className="v4-grain" aria-hidden="true" />;
}
