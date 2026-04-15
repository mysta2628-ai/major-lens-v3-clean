import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopMatches } from "../utils/match-groups";
import { getPersonalityType } from "../utils/personality-type";

// ── Fit badge ────────────────────────────────────────────────────────
function FitBadge({ fit }) {
  const styles = {
    strong:  { bg: "#e8f0eb", text: "#29443a", label: "Strong Fit" },
    good:    { bg: "#eef2ee", text: "#486156", label: "Good Fit"   },
    explore: { bg: "#f4f3ee", text: "#8a9488", label: "Worth Exploring" },
  };
  const s = styles[fit] || styles.explore;
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

// ── Top match card ────────────────────────────────────────────────────
function MatchCard({ match, index, onCompare }) {
  const { group, reason } = match;
  const careers = group.careers?.slice(0, 3) ?? [];
  return (
    <div className="rounded-[20px] border border-[#dfe3db] bg-white shadow-sm overflow-hidden">
      {/* Number + name header */}
      <div className="flex items-start gap-4 px-6 pt-6 pb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#21352d] flex items-center justify-center text-xs font-bold text-[#f5f3ee]">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#21352d]">
              {group.name}
            </h3>
            <FitBadge fit={group.fit} />
          </div>
          <p className="text-xs text-[#8a9488] font-medium">{group.chineseName}</p>
        </div>
      </div>

      {/* Why it matches */}
      <div className="px-6 pb-4">
        <p className="text-[13px] leading-6 text-[#5f6d62]">{group.whyMatch}</p>
      </div>

      {/* Stats row */}
      <div className="mx-6 mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-[12px] bg-[#f5f3ee] px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a9488] mb-1">
            Learning Style
          </p>
          <p className="text-xs font-medium text-[#21352d] leading-5">{group.learningStyle}</p>
        </div>
        <div className="rounded-[12px] bg-[#f5f3ee] px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a9488] mb-1">
            Career Paths
          </p>
          <p className="text-xs font-medium text-[#21352d] leading-5">{careers.join(" · ")}</p>
        </div>
      </div>

      {/* Action row */}
      <div className="px-6 pb-5 flex gap-3">
        <button
          onClick={() => onCompare(group.key)}
          className="flex-1 text-center text-xs font-semibold bg-[#21352d] text-[#f5f3ee] py-2.5 rounded-full hover:bg-[#29443a] transition-colors"
        >
          Compare In Detail
        </button>
        <a
          href="/explore"
          className="flex-1 text-center text-xs font-semibold border border-[#dfe3db] text-[#486156] py-2.5 rounded-full hover:border-[#21352d] hover:text-[#21352d] transition-colors"
        >
          Explore Group
        </a>
      </div>
    </div>
  );
}

// ── Action step card ─────────────────────────────────────────────────
function StepCard({ number, icon, title, body, cta, href }) {
  return (
    <div className="flex gap-4 rounded-[20px] border border-[#dfe3db] bg-white shadow-sm px-6 py-5">
      {/* Icon circle */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f5f3ee] border border-[#dfe3db] flex items-center justify-center text-lg mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a9488]">
            Step {number}
          </span>
        </div>
        <h4 className="text-base font-semibold tracking-[-0.02em] text-[#21352d] mb-1">{title}</h4>
        <p className="text-[13px] leading-6 text-[#5f6d62] mb-3">{body}</p>
        <a
          href={href}
          className="inline-block text-xs font-semibold text-[#486156] underline underline-offset-4 hover:text-[#21352d] transition-colors"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}

// ── Main screen ──────────────────────────────────────────────────────
export default function NextStepsScreen() {
  const navigate = useNavigate();
  const [profile, setProfile]   = useState(null);
  const [matches, setMatches]   = useState([]);
  const [typeName, setTypeName] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("ml_profile");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProfile(parsed);
        setMatches(getTopMatches(parsed, 3));
        setTypeName(getPersonalityType(parsed).name);
      } catch { /* ignore */ }
    }
  }, []);

  function handleCompare(groupKey) {
    // Store the selected group key so CompareScreen can pre-select it
    localStorage.setItem("ml_compare_key", groupKey);
    navigate("/compare");
  }

  // ── Empty state ──────────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-sm text-center flex flex-col gap-6">
          <div className="w-16 h-16 rounded-full bg-[#dfe3db] flex items-center justify-center mx-auto">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M13 3L3 10v13h7v-7h6v7h7V10L13 3Z" stroke="#8a9488" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-2">
              Next Steps
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#21352d] mb-3">
              Complete Your Assessment First
            </h2>
            <p className="text-base leading-7 text-[#5f6d62]">
              Your personalised next steps are generated based on your assessment results.
            </p>
          </div>
          <button
            onClick={() => navigate("/assessment")}
            className="self-center bg-[#21352d] text-[#f5f3ee] text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#29443a] transition-colors"
          >
            Take The Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee] px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* ── Page header ──────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-2">
            Next Steps
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-[#21352d] mb-3">
            Where To Go From Here
          </h1>
          {typeName && (
            <p className="text-base text-[#5f6d62]">
              Based on your{" "}
              <span className="font-semibold text-[#21352d]">{typeName}</span>{" "}
              profile
            </p>
          )}
        </div>

        {/* ── Top matches ──────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#21352d]">
              Your Top Matches
            </h2>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9488]">
              {matches.length} Groups
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {matches.map((match, i) => (
              <MatchCard
                key={match.key}
                match={match}
                index={i}
                onCompare={handleCompare}
              />
            ))}
          </div>
        </section>

        {/* ── Exploration steps ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#21352d] mb-5">
            How To Keep Going
          </h2>
          <div className="flex flex-col gap-4">
            <StepCard
              number="1"
              icon="🔍"
              title="Browse All 18 Groups"
              body="The Explore page gives you a full view of Taiwan's academic landscape — fit badges, subfields, and career paths for every group."
              cta="Go To Explore"
              href="/explore"
            />
            <StepCard
              number="2"
              icon="⚖️"
              title="Run A Side-By-Side Compare"
              body="Pick two groups and compare them across 7 dimensions including thinking type, flexibility, and how well they match your profile scores."
              cta="Go To Compare"
              href="/compare"
            />
            <StepCard
              number="3"
              icon="🧭"
              title="Revisit Your Profile"
              body="Your decision profile shows which dimensions drive your choices and where your blind spots are. Use it to stress-test any direction you're considering."
              cta="Go To Profile"
              href="/profile"
            />
          </div>
        </section>

        {/* ── Bottom retake prompt ──────────────────────────────────── */}
        <div className="rounded-[24px] bg-[#21352d] px-8 py-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a9b8a] mb-2">
              Changed Your Mind?
            </p>
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#f5f3ee] mb-1">
              Retake The Assessment
            </h3>
            <p className="text-sm leading-6 text-[#c8d4c0]">
              Your priorities shift over time. Retaking the assessment will refresh your profile and all recommendations.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("ml_profile");
              navigate("/assessment");
            }}
            className="flex-shrink-0 self-start md:self-center bg-[#f5f3ee] text-[#21352d] text-sm font-semibold px-6 py-3 rounded-full hover:bg-white transition-colors"
          >
            Start Over
          </button>
        </div>

      </div>
    </div>
  );
}
