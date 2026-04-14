import { ACADEMIC_GROUPS } from "../data/academic-groups.js";

const MAX_SCORE = 25;

function getDimLabel(score) {
  const pct = score / MAX_SCORE;
  if (pct >= 0.7) return "high";
  if (pct >= 0.4) return "mid";
  return "low";
}

export function getTopMatches(profile, limit = 3) {
  const { interests, structure, values, pressure } = profile;
  const curiosity  = getDimLabel(interests);
  const systematic = getDimLabel(structure);
  const meaning    = getDimLabel(values);

  const suggestions = [];

  if (curiosity === "high" && meaning === "high") {
    suggestions.push({ key: "law-politics",        reason: "High curiosity + values alignment" });
    suggestions.push({ key: "humanities",           reason: "Strong meaning-seeking + intellectual range" });
  }
  if (systematic === "high" && meaning === "high") {
    suggestions.push({ key: "social-psychology",   reason: "Systematic thinking + values-driven" });
  }
  if (systematic === "high" && curiosity !== "low") {
    suggestions.push({ key: "management-finance",  reason: "Structured thinking with broad curiosity" });
  }
  if (curiosity === "high" && systematic !== "high") {
    suggestions.push({ key: "communication-media", reason: "Exploratory, creative, open-ended" });
  }
  if (pressure === "high" && systematic === "high") {
    suggestions.push({ key: "cs-engineering",      reason: "High external pressure + systematic thinking" });
  }
  if (meaning === "high" && curiosity === "high" && systematic !== "high") {
    suggestions.push({ key: "international-area",  reason: "Cross-cultural curiosity + strong values" });
  }

  // Fallback: if no strong signal, use first 3 from ACADEMIC_GROUPS sorted by fit
  if (suggestions.length === 0) {
    return ACADEMIC_GROUPS.filter(g => g.fit === "strong" || g.fit === "good")
      .slice(0, limit)
      .map(g => ({ key: g.key, reason: "Recommended based on your profile" }));
  }

  // Deduplicate
  const seen = new Set();
  return suggestions
    .filter(s => { if (seen.has(s.key)) return false; seen.add(s.key); return true; })
    .slice(0, limit)
    .map(s => ({
      ...s,
      group: ACADEMIC_GROUPS.find(g => g.key === s.key),
    }))
    .filter(s => s.group);
}
