"use client";

import type React from "react";

interface AnimatedBlobsProps {
  className?: string;
}

export function AnimatedBlobs({ className = "" }: AnimatedBlobsProps) {
  const blobStyle = {
    "--border-radius": "115% 140% 145% 110% / 125% 140% 110% 125%",
    "--border-width": "5vmin",
    aspectRatio: "1",
    display: "block",
    gridArea: "stack",
    backgroundSize: "calc(100% + var(--border-width) * 2)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    border: "var(--border-width) solid transparent",
    borderRadius: "var(--border-radius)",
    maskImage:
      "linear-gradient(transparent, transparent), linear-gradient(black, white)",
    maskClip: "padding-box, border-box",
    maskComposite: "intersect",
    mixBlendMode: "screen" as const,
    height: "80vmin",
    filter: "blur(1vmin)",
  } as React.CSSProperties;

  // Brand-adapted blob colors: crimson, rose, charcoal-blue, deep-rose
  const blobs = [
    {
      backgroundColor: "#FF1E57",
      backgroundImage: "linear-gradient(#FF1E57, #FF6B8A, #FF1E57)",
      transform: "rotate(30deg) scale(1.03)",
    },
    {
      backgroundColor: "#E92156",
      backgroundImage: "linear-gradient(#E92156, #FF4D6D, #E92156)",
      transform: "rotate(60deg) scale(0.95)",
    },
    {
      backgroundColor: "#B7274F",
      backgroundImage: "linear-gradient(#B7274F, #E92156, #B7274F)",
      transform: "rotate(90deg) scale(0.97)",
    },
    {
      backgroundColor: "#313234",
      backgroundImage: "linear-gradient(#313234, #FF1E57, #313234)",
      transform: "rotate(120deg) scale(1.02)",
    },
  ];

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      <div className="grid" style={{ gridTemplateAreas: "'stack'" }}>
        <div
          className="grid relative blob-spin"
          style={{
            gridTemplateAreas: "'stack'",
            gridArea: "stack",
          }}
        >
          {blobs.map((blob, index) => (
            <span
              key={index}
              style={{
                ...blobStyle,
                ...blob,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
