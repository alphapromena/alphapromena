import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "brass" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
}

/**
 * Lineage button. Brass is the single accent and is spent sparingly:
 * if a section already carries the thread, its buttons go ghost.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "brass", className, type = "button", ...rest }, ref) => (
    <button ref={ref} type={type} className={cn("v2-btn", `v2-btn--${variant}`, className)} {...rest} />
  ),
);
Button.displayName = "ButtonV2";

/** Anchor styled as a Lineage button, for external/document links. */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ variant = "brass", className, ...rest }, ref) => (
    <a ref={ref} className={cn("v2-btn", `v2-btn--${variant}`, className)} {...rest} />
  ),
);
ButtonLink.displayName = "ButtonLinkV2";
