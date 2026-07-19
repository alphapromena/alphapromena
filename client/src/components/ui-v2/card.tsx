import { cn } from "@/lib/utils";

interface CardV2Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable the 2px hover lift + brass glow (for interactive records). */
  interactive?: boolean;
}

/**
 * Interlock card: white surface, soft shadow, 18px radius. Interactive
 * cards lift 2px on hover.
 */
export function CardV2({ interactive = false, className, ...rest }: CardV2Props) {
  return <div className={cn("v2-card", interactive && "v2-card--hover", className)} {...rest} />;
}
