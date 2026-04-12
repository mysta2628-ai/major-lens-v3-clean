export default function Logo({ size = 28, color = "#21352d" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Major Lens logo"
    >
      {/*
        Serif M — two outer verticals with tapered serifs,
        two inner diagonals meeting at the base centre.
        The small circle sits in the negative space at the
        top of the right inner diagonal, echoing a lens.
      */}

      {/* Left vertical stroke */}
      <path
        d="M2 26 L2 6 Q2 5 3 5 L4.5 5 Q5.5 5 5.5 6 L5.5 26"
        fill={color}
      />
      {/* Left serif top */}
      <rect x="1" y="5" width="5.5" height="1.6" rx="0.4" fill={color} />
      {/* Left serif bottom */}
      <rect x="1" y="24.8" width="5.5" height="1.6" rx="0.4" fill={color} />

      {/* Right vertical stroke */}
      <path
        d="M22.5 26 L22.5 6 Q22.5 5 23.5 5 L25 5 Q26 5 26 6 L26 26"
        fill={color}
      />
      {/* Right serif top */}
      <rect x="21.5" y="5" width="5.5" height="1.6" rx="0.4" fill={color} />
      {/* Right serif bottom */}
      <rect x="21.5" y="24.8" width="5.5" height="1.6" rx="0.4" fill={color} />

      {/* Left diagonal (top-left down to centre-bottom) */}
      <polygon
        points="4,6 7,6 14,20 11,20"
        fill={color}
      />

      {/* Right diagonal (top-right down to centre-bottom) */}
      <polygon
        points="24,6 21,6 14,20 17,20"
        fill={color}
      />

      {/* Lens dot — sits in the notch of the right diagonal */}
      <circle cx="19.5" cy="10" r="2.4" fill="none" stroke={color} strokeWidth="1.4" />
      <circle cx="19.5" cy="10" r="0.9" fill={color} />
    </svg>
  );
}
