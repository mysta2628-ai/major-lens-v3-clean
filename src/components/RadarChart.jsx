// Pure SVG radar chart — no external dependencies.
// Renders a 4-axis diamond layout for the four profile dimensions.

const SIZE     = 320;  // SVG canvas — wide enough for side labels
const CX       = SIZE / 2;
const CY       = SIZE / 2;
const RADIUS   = 100;  // max radius of the chart area
const LEVELS   = 4;    // concentric grid rings
const MAX_SCORE = 25;

// 4-axis positions (top, right, bottom, left) — 90° apart, starting top
function axisPoint(axisIndex, r) {
  const angle = (Math.PI * 2 * axisIndex) / 4 - Math.PI / 2;
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

function polygonPoints(scores) {
  return scores
    .map((score, i) => {
      const r = (score / MAX_SCORE) * RADIUS;
      const pt = axisPoint(i, r);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");
}

// Label positions — give left/right extra horizontal clearance
const AXES = [
  { label: "Intellectual\nCuriosity",  labelX: CX,              labelY: CY - RADIUS - 22, anchor: "middle" },
  { label: "Thinking\nStyle",          labelX: CX + RADIUS + 22, labelY: CY - 6,           anchor: "start"  },
  { label: "Meaning\nOrientation",     labelX: CX,              labelY: CY + RADIUS + 16,  anchor: "middle" },
  { label: "External\nInfluence",      labelX: CX - RADIUS - 22, labelY: CY - 6,           anchor: "end"    },
];

export default function RadarChart({ scores }) {
  const pts = polygonPoints(scores);

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto w-full max-w-[320px]"
      aria-label="Radar chart of your profile dimensions"
    >
      {/* Grid rings */}
      {Array.from({ length: LEVELS }).map((_, i) => {
        const r = (RADIUS / LEVELS) * (i + 1);
        const ringPts = [0, 1, 2, 3]
          .map((ax) => {
            const p = axisPoint(ax, r);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={i}
            points={ringPts}
            fill="none"
            stroke="#dfe3db"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {[0, 1, 2, 3].map((i) => {
        const outer = axisPoint(i, RADIUS);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={outer.x}
            y2={outer.y}
            stroke="#dfe3db"
            strokeWidth="1"
          />
        );
      })}

      {/* Score polygon */}
      <polygon
        points={pts}
        fill="#21352d"
        fillOpacity="0.15"
        stroke="#21352d"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Score dots */}
      {scores.map((score, i) => {
        const r = (score / MAX_SCORE) * RADIUS;
        const pt = axisPoint(i, r);
        return (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="4"
            fill="#21352d"
          />
        );
      })}

      {/* Axis labels */}
      {AXES.map((axis, i) => {
        const lines = axis.label.split("\n");
        return (
          <text
            key={i}
            x={axis.labelX}
            y={axis.labelY}
            textAnchor={axis.anchor}
            fontSize="9"
            fontFamily="sans-serif"
            fontWeight="600"
            letterSpacing="0.09em"
            fill="#8a9488"
            style={{ textTransform: "uppercase" }}
          >
            {lines.map((line, li) => (
              <tspan
                key={li}
                x={axis.labelX}
                dy={li === 0 ? 0 : "1.3em"}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}
