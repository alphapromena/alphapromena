"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  glowClassName?: string;
}

export function AuroraButton({
  className,
  children,
  glowClassName,
  ...props
}: AuroraButtonProps) {
  return (
    <div className="relative group">
      {/* Gradient glow border */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-full bg-gradient-to-r from-purple-500 via-cyan-300 to-emerald-400 opacity-70 blur-lg transition-all duration-300",
          "group-hover:opacity-100 group-hover:blur-xl",
          glowClassName
        )}
      />

      {/* Button */}
      <button
        className={cn(
          "relative rounded-full bg-slate-950/90 px-6 py-2.5",
          "text-slate-100 font-bold uppercase tracking-widest text-sm shadow-xl",
          "transition-all hover:bg-slate-950/70",
          "border border-slate-800",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
