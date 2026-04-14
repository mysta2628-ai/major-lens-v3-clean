import { useState } from "react";
import { Link } from "react-router-dom";
import { FULL_QUESTIONS, LIKERT } from "../data/full_questions.js";
import { computeProfile } from "../utils/full_scoring.js";
import LikertOption from "../components/LikertOption.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

// ── Dimension metadata ────────────────────────────────────────────
const DIMENSIONS = {
  interests: {
    label: "Intellectual curiosity",
    low:  "Goal-oriented — you prefer clear targets and defined outcomes.",
    mid:  "Balanced — you enjoy exploring but also value direction.",
    high: "Curiosity-driven — you're energised by ideas and open-ended questions.",
    icon: "◎",
  },
  structure: {
    label: "Thinking style",
    low:  "Intuitive — you prefer open, exploratory thinking over rigid frameworks.",
    mid:  "Flexible — you can work with structure but don't rely on it.",
    high: "Systematic — you're drawn to logic, frameworks, and structured reasoning.",
    icon: "⊞",
  },
  values: {
    label: "Meaning orientation",
    low:  "Pragmatic — outcomes, speed, and practicality guide your choices.",
    mid:  "Mixed — you balance purpose with practical considerations.",
    high: "Values-driven — you want your work to align with personal meaning and ethics.",
    icon: "→",
  },
  pressure: {
    label: "External influence",
    low:  "Self-directed — your choices are mostly shaped by your own preferences.",
    mid:  "Moderately influenced — you consider external factors but maintain autonomy.",
    high: "Externally influenced — family expectations, salary, and job security weigh heavily.",
    icon: "△",
  },
};

const MAX_SCORE = 25; // 5 questions × max 5 points

function getDimLabel(score) {
  const pct = score / MAX_SCORE;
  if (pct >= 0.7) return "high";
  if (pct >= 0.4) return "mid";
  return "low";
}

// ── Score bar ─────────────────────────────────────────────────────
function ScoreBar({ score, max = MAX_SCORE }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[#e8ece5]">
        <div
          className="h-2 rounded-full bg-[#29443a] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-[#29443a] w-8 text-right tabular-nums">
        {score}
      </span>
    </div>
  );
}

// ── Matched groups based on profile ──────────────────────────────
function getTopMatches(profile) {
  const { interests, structure, values, pressure } = profile;
  const curiosity = getDimLabel(interests);
  const systematic = getDimLabel(structure);
  const meaning = getDimLabel(values);

  const suggestions = [];

  if (curiosity === "high" && meaning === "high") {
    suggestions.push({ name: "Law & Politics", group: "law-politics", reason: "High curiosity + values alignment" });
    suggestions.push({ name: "Humanities & Philosophy", group: "humanities", reason: "Strong meaning-seeking + intellectual range" });
  }
  if (systematic === "high" && meaning === "high") {
    suggestions.push({ name: "Social Sciences & Psychology", group: "social-psychology", reason: "Systematic thinking + values-driven" });
  }
  if (systematic === "high" && curiosity !== "low") {
    suggestions.push({ name: "Management & Finance", group: "management-finance", reason: "Structured thinking with broad curiosity" });
  }
  if (curiosity === "high" && systematic !== "high") {
    suggestions.push({ name: "Communication & Media", group: "communication-media", reason: "Exploratory, creative, open-ended" });
  }
  if (pressure === "high" && systematic === "high") {
    suggestions.push({ name: "Engineering & Technology", group: "cs-engineering", reason: "High external pressure + systematic thinking" });
  }
  if (meaning === "high" && curiosity === "high" && systematic !== "high") {
    suggestions.push({ name: "International & Area Studies", group: "international-area", reason: "Cross-cultural curiosity + strong values" });
  }

  // Deduplicate and return top 3
  const seen = new Set();
  return suggestions.filter(s => {
    if (seen.has(s.group)) return false;
    seen.add(s.group);
    return true;
  }).slice(0, 3);
}

// ── Result screen ─────────────────────────────────────────────────
function ResultScreen({ profile }) {
  const topMatches = getTopMatches(profile);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-32 pt-10 md:pt-16">

      {/* Header */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
        Your Results
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#21352d] md:text-5xl">
        Assessment Complete.
      </h1>
      <p className="mt-4 text-lg leading-8 text-[#5f6d62]">
        Here's what your answers reveal about how you think, what you value,
        and what's shaping your choices.
      </p>

      {/* Dimension scores */}
      <section className="mt-12 space-y-5">
        {Object.entries(profile).map(([key, score]) => {
          const dim = DIMENSIONS[key];
          if (!dim) return null;
          const level = getDimLabel(score);
          return (
            <Card key={key} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-[#486156]">{dim.icon}</span>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#486156]">
                      {dim.label}
                    </p>
                  </div>
                  <ScoreBar score={score} />
                  <p className="mt-3 text-sm leading-7 text-[#5f6d62]">
                    {dim[level]}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Top matched groups */}
      {topMatches.length > 0 && (
        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
            Based on Your Profile
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#21352d]">
            Directions Worth Exploring
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#5f6d62]">
            These aren't prescriptions — they're starting points based on your
            pattern of answers.
          </p>

          <div className="mt-6 space-y-4">
            {topMatches.map((match, i) => (
              <Card key={match.group} className="p-5 flex items-center gap-5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#dfe3db] text-sm font-semibold text-[#486156]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#21352d]">{match.name}</p>
                  <p className="mt-0.5 text-xs text-[#8a9488]">{match.reason}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-[#e6ede9] text-[#29443a]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#29443a]" />
                  Strong fit
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Next steps CTA */}
      <Card className="mt-14 p-8 md:p-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
          What's Next
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#21352d]">
          Explore and Compare Your Options.
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#5f6d62]">
          Browse all 18 academic groups with your profile in mind,
          or compare specific majors side by side.
        </p>
        <div className="mt-7 flex items-center justify-center gap-4 flex-wrap">
          <Link to="/explore">
            <PrimaryButton>Explore Majors</PrimaryButton>
          </Link>
          <Link
            to="/compare"
            className="text-sm font-medium text-[#486156] underline underline-offset-4 hover:text-[#21352d] transition-colors"
          >
            Compare Options
          </Link>
        </div>
      </Card>

    </main>
  );
}

// ── Assessment question screen ────────────────────────────────────
export default function AssessmentScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [profileResult, setProfileResult] = useState(null);
  const [selected, setSelected] = useState(null);

  const [text, dimension] = FULL_QUESTIONS[index] || [];

  function handleSelect(score) {
    setSelected(score);
    setTimeout(() => {
      const updated = [...answers, { dimension, score }];
      setSelected(null);
      if (index + 1 < FULL_QUESTIONS.length) {
        setAnswers(updated);
        setIndex(index + 1);
      } else {
        const profile = computeProfile(updated);
        try { localStorage.setItem("ml_profile", JSON.stringify(profile)); } catch (_) {}
        setProfileResult(profile);
      }
    }, 260);
  }

  if (profileResult) {
    return <ResultScreen profile={profileResult} />;
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <ProgressBar current={index + 1} total={FULL_QUESTIONS.length} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9488]">
          Question {index + 1} of {FULL_QUESTIONS.length}
        </p>
        <h2 className="mt-4 text-xl font-semibold leading-8 text-[#21352d]">
          {text}
        </h2>
      </div>

      <div className="grid gap-3">
        {LIKERT.map(([label, value]) => (
          <LikertOption
            key={value}
            label={label}
            value={value}
            selected={selected === value}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </main>
  );
}
