import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RadarChart from "../components/RadarChart";
import { getPersonalityType } from "../utils/personality-type";

const MAX = 25;

// ── Dimension bar ────────────────────────────────────────────────────
function DimensionBar({ label, score, max = MAX }) {
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

// ── Stat chip ────────────────────────────────────────────────────────
function StatChip({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-4 rounded-[16px] bg-[#f5f3ee] border border-[#dfe3db]">
      <span className="text-2xl font-semibold tracking-[-0.02em] text-[#21352d]">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a9488]">{label}</span>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`rounded-[10px] bg-[#ffffff18] animate-pulse ${className}`}
    />
  );
}

// ── Generate AI profile via /api/chat ────────────────────────────────
async function generateAIProfile(profile, analysis) {
  const scores = `
- Intellectual Curiosity: ${Math.round((profile.interests / MAX) * 100)}%
- Thinking Style: ${Math.round((profile.structure / MAX) * 100)}%
- Meaning Orientation: ${Math.round((profile.values / MAX) * 100)}%
- External Influence: ${Math.round((profile.pressure / MAX) * 100)}%`.trim();

  const prompt = `You are an educational counsellor writing a personalised profile for a high school student who is deciding which university major to pursue.

Here are their Phase 1 assessment scores (out of 100%):
${scores}

Here is a summary of their Phase 2 conversation with the counsellor:
${analysis}

Write a short personalised profile in exactly this format — no extra text, no headers outside of these, no markdown except bold:

---PROFILE---
DESCRIPTION
[2–3 sentences describing how this specific student thinks and makes decisions, using evidence from both their scores and what they said in the conversation. Write directly to the student using "you". Be specific — avoid generic phrases like "you are curious".]

BLIND_SPOT
[1–2 sentences naming one honest blind spot or risk pattern this student should watch out for, grounded in what they actually said or scored. Be direct, not harsh.]
---END---`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", text: prompt }],
    }),
  });

  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  const text = data.text ?? "";

  // Parse
  const match = text.match(/---PROFILE---([\s\S]*?)---END---/);
  if (!match) throw new Error("Unexpected format");

  const inner = match[1].trim();
  const descMatch = inner.match(/DESCRIPTION\s*([\s\S]*?)BLIND_SPOT/);
  const blindMatch = inner.match(/BLIND_SPOT\s*([\s\S]*?)$/);

  return {
    description: descMatch?.[1]?.trim() ?? "",
    blindSpot: blindMatch?.[1]?.trim() ?? "",
  };
}

// ── Main screen ──────────────────────────────────────────────────────
export default function ProfileScreen() {
  const navigate = useNavigate();
  const [profile, setProfile]         = useState(null);
  const [type, setType]               = useState(null);
  const [aiContent, setAiContent]     = useState(null);  // { description, blindSpot }
  const [aiLoading, setAiLoading]     = useState(false);
  const [hasPhase2, setHasPhase2]     = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("ml_profile");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setProfile(parsed);
      setType(getPersonalityType(parsed));
    } catch { return; }

    const analysis  = localStorage.getItem("ml_analysis");
    const cached    = localStorage.getItem("ml_profile_ai");
    const phase2done = localStorage.getItem("ml_phase2_done");

    setHasPhase2(!!phase2done);

    if (analysis) {
      // Check for a valid cache first
      if (cached) {
        try {
          setAiContent(JSON.parse(cached));
          return;
        } catch { /* regenerate */ }
      }

      // Generate fresh
      const raw2 = localStorage.getItem("ml_profile");
      const parsed2 = JSON.parse(raw2);
      setAiLoading(true);
      generateAIProfile(parsed2, analysis)
        .then((result) => {
          setAiContent(result);
          localStorage.setItem("ml_profile_ai", JSON.stringify(result));
        })
        .catch(() => { /* fallback to static */ })
        .finally(() => setAiLoading(false));
    }
  }, []);

  function handleRetake() {
    ["ml_profile", "ml_analysis", "ml_phase2_done", "ml_profile_ai", "ml_compare_key"].forEach(
      (k) => localStorage.removeItem(k)
    );
    navigate("/assessment");
  }

  // ── Empty state ──────────────────────────────────────────────────
  if (!profile || !type) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-sm text-center flex flex-col gap-6">
          <div className="w-16 h-16 rounded-full bg-[#dfe3db] flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="10" r="5" stroke="#8a9488" strokeWidth="1.8" />
              <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#8a9488" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-2">Your Profile</p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#21352d] mb-3">No Assessment Yet</h2>
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
  const dimLabels = ["Intellectual Curiosity", "Thinking Style", "Meaning Orientation", "External Influence"];
  const maxIdx = scores.indexOf(Math.max(...scores));
  const dominantLabel = dimLabels[maxIdx];

  // Decide which content to show
  const description = aiContent?.description || type.description;
  const blindSpot   = aiContent?.blindSpot   || type.blindSpot;
  const isAI        = !!aiContent;

  return (
    <div className="min-h-screen bg-[#f5f3ee] px-6 py-12 md:py-16">

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-2">
          Your Profile
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-[#21352d]">
          Your Decision Profile
        </h1>
      </div>

      {/* ── Two-column grid ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* ── LEFT COLUMN ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Personality type card */}
          <div className="rounded-[24px] bg-[#21352d] px-8 py-8 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a9488]">
                Personality Type
              </p>
              {isAI && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#29443a] text-[#7a9b8a]">
                  AI Personalised
                </span>
              )}
            </div>

            <div>
              <h2 className="text-[2rem] font-semibold tracking-[-0.03em] text-[#f5f3ee] leading-tight mb-2">
                {type.name}
              </h2>
              <p className="text-sm font-medium text-[#7a9b8a] italic">
                {type.tagline}
              </p>
            </div>

            {/* Description — skeleton while loading */}
            {aiLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <p className="text-[15px] leading-7 text-[#c8d4c0]">{description}</p>
            )}

            {/* Stat chips */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <StatChip label="Dominant Trait" value={dominantLabel.split(" ")[0]} />
              <StatChip label="Dimensions" value="4" />
            </div>
          </div>

          {/* Blind Spot card */}
          <div
            className="rounded-[24px] border border-[#dfe3db] bg-white shadow-sm px-8 py-7 flex flex-col gap-3"
            style={{ borderLeft: "4px solid #8B6914" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#8B6914" }}>
                Your Blind Spot
              </p>
              {isAI && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#fdf3e0] text-[#8B6914]">
                  AI Personalised
                </span>
              )}
            </div>
            {aiLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3.5 w-full bg-[#f0e8d8]" />
                <Skeleton className="h-3.5 w-4/5 bg-[#f0e8d8]" />
              </div>
            ) : (
              <p className="text-[15px] leading-7 text-[#5f6d62]">{blindSpot}</p>
            )}
          </div>

          {/* Phase 2 nudge — only if they haven't done it */}
          {!hasPhase2 && (
            <div className="rounded-[20px] border border-[#dfe3db] bg-white shadow-sm px-6 py-5 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#e8f0eb] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v6M7 10v.5" stroke="#29443a" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#21352d] mb-1">Unlock A Personalised Analysis</p>
                <p className="text-[13px] leading-6 text-[#5f6d62] mb-3">
                  Complete the Phase 2 conversation to get an AI-generated profile description written specifically for you.
                </p>
                <button
                  onClick={() => navigate("/assessment")}
                  className="text-xs font-semibold text-[#486156] underline underline-offset-4 hover:text-[#21352d] transition-colors"
                >
                  Continue To Phase 2
                </button>
              </div>
            </div>
          )}

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

        {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Radar chart */}
          <div className="rounded-[24px] border border-[#dfe3db] bg-white shadow-sm px-8 py-8 flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a9488] mb-1">
                Thinking Shape
              </p>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#21352d]">
                Your Thinking Shape
              </h3>
            </div>
            <div className="flex justify-center py-2">
              <RadarChart scores={scores} />
            </div>
          </div>

          {/* Dimension scores */}
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
