export const AlphaProLogo = ({ className = "h-10 w-auto" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pink/Crimson rounded square (left) */}
      <rect
        x="30"
        y="50"
        width="80"
        height="80"
        rx="20"
        fill="#FF1744"
      />

      {/* Dark/Black rounded square (right, overlapping) */}
      <rect
        x="90"
        y="50"
        width="80"
        height="80"
        rx="20"
        fill="#2A2A2A"
      />

      {/* White inner square on pink side */}
      <rect
        x="45"
        y="65"
        width="50"
        height="50"
        rx="8"
        fill="white"
      />

      {/* Pink triangle/arrow inside white square */}
      <polygon
        points="75,75 85,90 65,90"
        fill="#FF1744"
      />

      {/* White inner square on dark side */}
      <rect
        x="105"
        y="65"
        width="50"
        height="50"
        rx="8"
        fill="white"
      />

      {/* Dark triangle/arrow inside white square on dark side */}
      <polygon
        points="135,75 145,90 125,90"
        fill="#2A2A2A"
      />
    </svg>
  );
};
