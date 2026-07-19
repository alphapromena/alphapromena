import { cn } from "@/lib/utils";

interface LineageNodeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Active nodes fill with brass and pulse once. Once active, stay active. */
  active?: boolean;
}

/**
 * A 12px node on the lineage thread. Idle: hairline stroke. Active:
 * brass fill with a single pulse (suppressed under prefers-reduced-motion,
 * handled in CSS).
 */
export function LineageNode({ active = false, className, ...rest }: LineageNodeProps) {
  return <span aria-hidden="true" className={cn("v2-node", active && "v2-node--active", className)} {...rest} />;
}
