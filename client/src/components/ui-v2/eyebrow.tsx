import { cn } from "@/lib/utils";

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Catalog index shown before the label, e.g. "CATALOG / 01". */
  index?: string;
}

/**
 * Mono catalog-entry eyebrow: `CATALOG / 01 · PRACTICES`.
 * The index is optional; numbering appears only where order is real.
 */
export function Eyebrow({ index, className, children, ...rest }: EyebrowProps) {
  return (
    <p className={cn("v2-eyebrow", className)} {...rest}>
      {index && (
        <>
          <span className="v2-eyebrow-index">{index}</span>
          <span className="v2-eyebrow-sep" aria-hidden="true">·</span>
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
