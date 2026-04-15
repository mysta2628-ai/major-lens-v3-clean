import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RadarChart from "../components/RadarChart";
import { getPersonalityType } from "../utils/personality-type";

// ── Dimension bar ────────────────────────────────────────────────────
function DimensionBar({ label, score, max = 25 }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a9488]">
          {label}
        </span>
        <span className="text-[11px] font-semibold text-[#486156]">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#e8ebe5] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#21352d] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Small stat chip ──────────────────────────────────────────────────
function StatChip({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-4 rounded-[16px] bg-[#f5f3ee] border border-[#dfe3db]">
      <span className="text-2xl font-semibold tracking-[-0.02em] text-[#21352d]">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a9488]">{label}</span>
    </div>
  );
}

// ── Main screen ──────────────────────────────────────────────────────
export default function ProfileScreen() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("ml_profile");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProfile(parsed);
        setType(getPersonalityType(parsed));
      } catch {
        // corrupted data
      }
    }
  }, []);

  function handleRetake() {
    localStorage.removeItem("ml_profile");
    navigate("/assessment");
  }

  // ── Empty state ──────────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-sm text-center flex flex-col gap-6">
          <div className="w-16 h-16 rounded-full bg-[#dfe3db] flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="10" r="5" stroke="#8a9488" strokeWidth="1.8" />
              <path
                d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10"
                stroke="#8a9488"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-2">
              Your Profile
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#21352d] mb-3">
              No Assessment Yet
            </h2>
            <p className="text-base leading-7 text-[#5f6d62]">
              Complete the assessment first to unlock your decision-maker profile and thinking shape.
            </p>
          </div>
          <button
            onClick={() => navigate("/assessment")}
            className="inline-block self-center bg-[#21352d] text-[#f5f3ee] text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#29443a] transition-colors"
          >
            Take The Assessment
          </button>
        </div>
      </div>
    );
  }

  const scores = [profile.interests, profile.structure, profile.values, profile.pressure];

  // Dominant dimension label
  const dimLabels = ["Intellectual Curiosity", "Thinking Style", "Meaning Orientation", "External Influence"];
  const maxIdx = scores.indexOf(Math.max(...scores));
  const dominantLabel = dimLabels[maxIdx];

  return (
    <div className="min-h-screen bg-[#f5f3ee] px-6 py-12 md:py-16">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-2">
          Your Profile
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-[#21352d]">
          Your Decision Profile
        </h1>
      </div>

      {/* ── Two-column grid ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Personality type card */}
          <div className="rounded-[24px] bg-[#21352d] px-8 py-8 flex flex-col gap-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a9488]">
              Personality Type
            </p>
            <div>
              <h2 className="text-[2rem] font-semibold tracking-[-0.03em] text-[#f5f3ee] leading-tight mb-2">
                {type.name}
              </h2>
              <p className="text-sm font-medium text-[#7a9b8a] italic">
                {type.tagline}
              </p>
            </div>
            <p className="text-[15px] leading-7 text-[#c8d4c0]">
              {type.description}
            </p>

            {/* Stat chips row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <StatChip
                label="Dominant Trait"
                value={dominantLabel.split(" ")[0]}
              />
              <StatChip
                label="Dimensions"
                value="4"
              />
            </div>
          </div>

          {/* Blind Spot card */}
          <div
            className="rounded-[24px] border border-[#dfe3db] bg-white shadow-sm px-8 py-7 flex flex-col gap-3"
            style={{ borderLeft: "4px solid #8B6914" }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#8B6914" }}
            >
              Your Blind Spot
            </p>
            <p className="text-[15px] leading-7 text-[#5f6d62]">
              {type.blindSpot}
            </p>
          </div>

          {/* Retake link */}
          <div className="px-1">
            <button
              onClick={handleRetake}
              className="text-sm text-[#486156] underline underline-offset-4 hover:text-[#21352d] transition-colors"
            >
              Retake Assessment
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Radar chart card */}
          <div className="rounded-[24px] border border-[#dfe3db] bg-white shadow-sm px-8 py-8 flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a9488] mb-1">
                Thinking Shape
              </p>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#21352d]">
                Your Thinking Shape
              </h3>
            </div>

            {/* Radar — larger canvas, centred with room for labels */}
            <div className="flex justify-center py-2">
              <RadarChart scores={scores} />
            </div>
          </div>

          {/* Dimension scores card */}
          <div className="rounded-[24px] border border-[#dfe3db] bg-white shadow-sm px-8 py-7 flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a9488] mb-1">
                Dimension Scores
              </p>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#21352d]">
                How You Break Down
              </h3>
            </div>
            <div className="flex flex-col gap-5">
              <DimensionBar label="Intellectual Curiosity" score={profile.interests} />
              <DimensionBar label="Thinking Style"         score={profile.structure} />
              <DimensionBar label="Meaning Orientation"    score={profile.values}    />
              <DimensionBar label="External Influence"     score={profile.pressure}  />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
