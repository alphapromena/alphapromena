import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// CVA for card variants — brand-adapted for Alpha Pro MENA
const cardVariants = cva(
  "relative flex flex-col justify-between w-full p-7 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ease-in-out group hover:shadow-xl cursor-pointer",
  {
    variants: {
      variant: {
        // Dark charcoal — default brand card
        default: "text-white",
        // Crimson accent card
        crimson: "text-white",
        // Deep dark card
        dark: "text-white",
        // Mid charcoal
        mid: "text-white",
        // Subtle dark with border
        subtle: "text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Background styles per variant
const variantBg: Record<string, React.CSSProperties> = {
  default: { background: "#141416", border: "1px solid rgba(255,255,255,0.08)" },
  crimson: { background: "linear-gradient(135deg, #FF1E57 0%, #B7274F 100%)", border: "1px solid rgba(255,30,87,0.40)" },
  dark:    { background: "#0d0d0e", border: "1px solid rgba(255,255,255,0.06)" },
  mid:     { background: "#1c1c1f", border: "1px solid rgba(255,255,255,0.07)" },
  subtle:  { background: "rgba(255,30,87,0.06)", border: "1px solid rgba(255,30,87,0.18)" },
};

export interface ServiceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** The main title of the card. */
  title: string;
  /** Short description text shown below the title. */
  description?: string;
  /** The URL the card's "Learn More" link should point to. */
  href?: string;
  /** The source URL for the decorative image / icon illustration. */
  imgSrc?: string;
  /** The alt text for the decorative image. */
  imgAlt?: string;
  /** Optional pill badge text. */
  badge?: string;
  /** Click handler (used instead of href when scrolling within the page). */
  onCardClick?: () => void;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      href,
      imgSrc,
      imgAlt,
      badge,
      onCardClick,
      ...props
    },
    ref
  ) => {
    const cardAnimation = {
      hover: {
        scale: 1.025,
        transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
      },
    };

    const imageAnimation = {
      hover: {
        scale: 1.12,
        rotate: 4,
        x: 8,
        y: -4,
        transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] },
      },
    };

    const arrowAnimation = {
      hover: {
        x: 5,
        transition: {
          duration: 0.3,
          ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    };

    const bg = variantBg[variant ?? "default"] ?? variantBg.default;

    const handleClick = () => {
      if (onCardClick) {
        onCardClick();
      } else if (href && href.startsWith("http")) {
        window.open(href, "_blank", "noopener noreferrer");
      } else if (href) {
        const el = document.getElementById(href.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    return (
      <motion.div
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        variants={cardAnimation}
        whileHover="hover"
        style={bg}
        onClick={handleClick}
      >
        {/* Crimson glow overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            background:
              variant === "crimson"
                ? "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)"
                : "radial-gradient(circle at 70% 30%, rgba(255,30,87,0.10) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full min-h-[160px]">
          {/* Badge */}
          {badge && (
            <span
              className="mb-3 self-start text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{
                background:
                  variant === "crimson"
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,30,87,0.12)",
                color: variant === "crimson" ? "#fff" : "#FF1E57",
                border:
                  variant === "crimson"
                    ? "1px solid rgba(255,255,255,0.25)"
                    : "1px solid rgba(255,30,87,0.25)",
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              {badge}
            </span>
          )}

          {/* Title */}
          <h3
            className="text-xl font-black uppercase leading-tight tracking-tight mb-2"
            style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontWeight: 900 }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              className="text-sm leading-relaxed mb-4 flex-1"
              style={{
                color:
                  variant === "crimson"
                    ? "rgba(255,255,255,0.80)"
                    : "rgba(255,255,255,0.45)",
              }}
            >
              {description}
            </p>
          )}

          {/* Learn more link */}
          <div
            className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest group-hover:underline"
            style={{ color: variant === "crimson" ? "#fff" : "#FF1E57" }}
            aria-label={`Learn more about ${title}`}
          >
            Learn More
            <motion.div variants={arrowAnimation}>
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </motion.div>
          </div>
        </div>

        {/* Decorative image — bottom-right */}
        {imgSrc && (
          <motion.img
            src={imgSrc}
            alt={imgAlt ?? title}
            className="absolute -right-6 -bottom-6 w-36 h-36 object-contain opacity-80 group-hover:opacity-100 pointer-events-none"
            variants={imageAnimation}
          />
        )}
      </motion.div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export { ServiceCard };
