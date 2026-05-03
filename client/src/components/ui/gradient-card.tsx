// components/ui/gradient-card.tsx
import * as React from "react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Send, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl",
  {
    variants: {
      gradient: {
        purple: "bg-gradient-to-br from-violet-100 to-indigo-200/60",
        blue:   "bg-gradient-to-br from-blue-100 to-sky-200/60",
        rose:   "bg-gradient-to-br from-rose-100 to-pink-200/60",
        orange: "bg-gradient-to-br from-orange-100 to-amber-200/50",
        gray:   "bg-gradient-to-br from-slate-100 to-slate-200/50",
        green:  "bg-gradient-to-br from-emerald-100 to-teal-200/50",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  /** Accent colour for hover states and form button */
  accentColor?: string;
  /** Department name passed to the webhook */
  departmentName?: string;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  (
    {
      className,
      gradient,
      badgeText,
      badgeColor,
      title,
      description,
      ctaText,
      ctaHref: _ctaHref,
      imageUrl,
      accentColor = "#6C2BD9",
      departmentName,
      ...props
    },
    ref
  ) => {
    const [showForm, setShowForm] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const submitMutation = trpc.department.contact.useMutation({
      onSuccess: () => {
        setSubmitted(true);
        setFirstName(""); setLastName(""); setEmail("");
        setPhone(""); setCompany(""); setJobTitle(""); setMessage("");
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      submitMutation.mutate({
        department: departmentName || title,
        firstName,
        lastName,
        email,
        phone,
        company,
        jobTitle,
        message,
      });
    };

    const cardAnimation = {
      rest:  { scale: 1, y: 0 },
      hover: { scale: showForm ? 1 : 1.02, y: showForm ? 0 : -5 },
    };

    const imageAnimation = {
      rest:  { scale: 1,   rotate: 0 },
      hover: { scale: 1.1, rotate: 3 },
    };

    const inputClass =
      "w-full rounded-lg px-3 py-2 text-xs bg-white/80 backdrop-blur-sm border border-white/60 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all";

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div className={cn(cardVariants({ gradient }), className)} {...props}>
          {/* Decorative background image */}
          {!showForm && (
            <motion.img
              src={imageUrl}
              alt={`${title} background graphic`}
              variants={imageAnimation}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -right-1/4 -bottom-1/4 w-3/4 opacity-70 pointer-events-none select-none"
            />
          )}

          {/* Card content */}
          <div className="z-10 flex flex-col h-full">
            {/* Badge */}
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm w-fit shadow-sm"
              style={{ backgroundColor: badgeColor }}
            >
              {badgeText}
            </div>

            {/* Title + description */}
            <div className="flex-grow">
              <h3
                className="text-2xl font-black uppercase tracking-tight leading-tight mb-3 text-gray-900"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {title}
              </h3>
              {!showForm && (
                <p className="text-sm leading-relaxed text-gray-600 max-w-xs">{description}</p>
              )}
            </div>

            {/* Mini form or CTA */}
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="mt-5 flex flex-col gap-3"
                >
                  {/* Sales email pill */}
                  <a
                    href="mailto:Sales@Alphapromena.com"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/70 text-gray-700 hover:bg-white transition-colors shadow-sm w-fit"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    Sales@Alphapromena.com
                  </a>

                  {/* CTA button */}
                  <button
                    onClick={() => setShowForm(true)}
                    className="group inline-flex items-center gap-2 text-sm font-bold text-gray-800 mt-1"
                  >
                    {ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </motion.div>
              ) : submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-5 flex flex-col items-center justify-center gap-3 py-6 text-center"
                >
                  <CheckCircle className="w-10 h-10" style={{ color: accentColor }} />
                  <p className="text-sm font-bold text-gray-800">Message sent!</p>
                  <p className="text-xs text-gray-500">Our team will be in touch shortly.</p>
                  <button
                    onClick={() => { setSubmitted(false); setShowForm(false); }}
                    className="text-xs font-semibold underline mt-1"
                    style={{ color: accentColor }}
                  >
                    Back
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="mt-4 flex flex-col gap-2"
                >
                  {/* Row: first + last name */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="First name *"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                      className={cn(inputClass, "flex-1")}
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className={cn(inputClass, "flex-1")}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />

                  {/* Row: phone + job title */}
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className={cn(inputClass, "flex-1")}
                    />
                    <input
                      type="text"
                      placeholder="Job title"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      className={cn(inputClass, "flex-1")}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Company"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className={inputClass}
                  />

                  <textarea
                    placeholder="How can we help? *"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    rows={3}
                    className={cn(inputClass, "resize-none")}
                  />

                  {submitMutation.error && (
                    <p className="text-xs text-red-500">{submitMutation.error.message}</p>
                  )}

                  <div className="flex gap-2 mt-1">
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2 text-xs font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-60"
                      style={{ background: accentColor }}
                    >
                      {submitMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>Send <Send className="w-3 h-3" /></>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-3 rounded-full py-2 text-xs font-semibold bg-white/60 text-gray-600 hover:bg-white/90 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
