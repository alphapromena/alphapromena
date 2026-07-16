import { cn } from "@/lib/utils";

interface CardV2Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable the 2px hover lift + brass glow (for interactive records). */
  interactive?: boolean;
}

/**
 * Lineage card: raised ink-800 surface, 1px hairline border, 8px radius,
 * no drop shadows. Brass glow appears only on hover of interactive cards.
 */
export function CardV2({ interactive = false, className, ...rest }: CardV2Props) {
  return <div className={cn("v2-card", interactive && "v2-card--hover", className)} {...rest} />;
}
