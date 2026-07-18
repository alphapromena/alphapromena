import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "rose" | "ink" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
}

/**
 * Interlock button: fully rounded pill. Rose is the primary CTA (white
 * text, rose-mid hover, rose-deep pressed); ink and outline carry
 * secondary actions on light surfaces.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "rose", className, type = "button", ...rest }, ref) => (
    <button ref={ref} type={type} className={cn("v2-btn", `v2-btn--${variant}`, className)} {...rest} />
  ),
);
Button.displayName = "ButtonV2";

/** Anchor styled as an Interlock pill, for external/document links. */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ variant = "rose", className, ...rest }, ref) => (
    <a ref={ref} className={cn("v2-btn", `v2-btn--${variant}`, className)} {...rest} />
  ),
);
ButtonLink.displayName = "ButtonLinkV2";
