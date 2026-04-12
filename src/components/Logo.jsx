export default function Logo({ size = 28, color = "#21352d" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Major Lens"
    >
      {/* Outer circle */}
      <circle cx="14" cy="14" r="12.5" stroke={color} strokeWidth="1.5" />
      {/* Inner circle (lens) */}
      <circle cx="14" cy="14" r="6.5" stroke={color} strokeWidth="1.5" />
      {/* Cross-hair lines */}
      <line x1="14" y1="1.5" x2="14" y2="7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="20.5" x2="14" y2="26.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="14" x2="7.5" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20.5" y1="14" x2="26.5" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="14" cy="14" r="2" fill={color} />
    </svg>
  );
}
