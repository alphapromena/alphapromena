import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Skip the inner max-width container (full-bleed content). */
  bleed?: boolean;
  /** Class applied to the inner container (ignored when bleed). */
  containerClassName?: string;
}

/**
 * Lineage section: owns vertical rhythm (clamp(96px, 12vw, 160px)) and
 * the 1200px content container. Sections stay quiet; content provides
 * the hierarchy.
 */
export function Section({ bleed = false, containerClassName, className, children, ...rest }: SectionProps) {
  return (
    <section className={cn("v2-section", className)} {...rest}>
      {bleed ? children : <div className={cn("v2-container", containerClassName)}>{children}</div>}
    </section>
  );
}
