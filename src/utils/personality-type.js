// Derives a personality type from the four assessment dimension scores.
// Each dimension max = 25.

const MAX = 25;

function level(score) {
  const p = score / MAX;
  if (p >= 0.65) return "high";
  if (p >= 0.40) return "mid";
  return "low";
}

// ── Type matrix ───────────────────────────────────────────────────
// Keyed by [curiosity, systematic, meaning, pressure] levels
// We check the two dominant dimensions first.

const TYPES = [
  {
    match: (c, s, m, p) => c === "high" && s === "high",
    name: "Curious Systematist",
    tagline: "Rigorous thinking meets open-ended exploration.",
    description:
      "You are driven by ideas but bring discipline to how you pursue them. Logic and meaning guide your decisions in equal measure — you're at your best when given space to think deeply and structure your findings. You thrive in fields that reward both intellectual breadth and analytical precision.",
    blindSpot:
      "Your strength in analysis can cause you to underweight emotional and relational factors. When evaluating a major, ask yourself: what would I choose if every option had the same salary and status attached to it?",
  },
  {
    match: (c, s, m, p) => c === "high" && m === "high",
    name: "Values-Led Explorer",
    tagline: "Curiosity in the service of something that matters.",
    description:
      "You explore widely, but you're not exploring aimlessly — you're searching for work that aligns with what you believe in. Ideas energise you, and purpose grounds you. You're most engaged when you can see how your learning connects to something larger than yourself.",
    blindSpot:
      "Your values-focus can make it hard to commit to a direction that feels impure or pragmatic. Watch out for paralysis — a good-enough path pursued with intention often beats a perfect path never taken.",
  },
  {
    match: (c, s, m, p) => s === "high" && m === "high",
    name: "Principled Analyst",
    tagline: "Structured thinking anchored in strong values.",
    description:
      "You bring both rigour and ethics to your decisions. You want your reasoning to be sound and your choices to be defensible — not just to others, but to yourself. You're drawn to fields where getting things right matters, and where there are real stakes to the conclusions you reach.",
    blindSpot:
      "You may hold yourself to standards that slow your decision-making. Not every choice needs to be fully justified before you act. Sometimes moving forward with a provisional answer is the most honest thing you can do.",
  },
  {
    match: (c, s, m, p) => p === "high" && c !== "high",
    name: "Pressured Pragmatist",
    tagline: "Navigating real-world expectations with practical intent.",
    description:
      "External factors — family, finances, job market — are shaping your choices significantly. That's not a weakness; it's a reality many students share. The key is to understand which pressures are non-negotiable constraints and which ones you've assumed without fully questioning them.",
    blindSpot:
      "There's a risk of optimising entirely for others' approval and losing track of what you actually want. Try to separate the constraints you must accept from the preferences you've inherited but haven't examined.",
  },
  {
    match: (c, s, m, p) => c === "high" && s !== "high" && m !== "high",
    name: "Open Inquirer",
    tagline: "Drawn to ideas, still finding the direction.",
    description:
      "You're intellectually alive and genuinely curious, but you haven't yet settled on a clear framework for making decisions. That's not a problem — it's a stage. You're gathering information and following interests, which is exactly what early exploration should look like.",
    blindSpot:
      "Curiosity without structure can leave you spread too thin. At some point, depth beats breadth. Try to identify two or three areas where you'd be willing to go further than comfortable.",
  },
  {
    match: (c, s, m, p) => s === "high" && c !== "high",
    name: "Deliberate Planner",
    tagline: "Methodical, structured, and outcome-focused.",
    description:
      "You prefer clear processes and defined outcomes. You're not drawn to open-ended exploration for its own sake — you want to know where you're headed and why. You make decisions carefully and tend to stick with them once made.",
    blindSpot:
      "Your preference for certainty can lead you to avoid fields that are genuinely uncertain or interdisciplinary. Some of the most interesting career paths don't have a clear syllabus. Consider whether the discomfort of ambiguity is worth tolerating.",
  },
  {
    // Fallback
    match: () => true,
    name: "Thoughtful Decider",
    tagline: "Balanced across multiple dimensions.",
    description:
      "Your profile shows a relatively even distribution across curiosity, structure, values, and external influence. You're adaptable and can work across different environments. The challenge is that without a strong dominant signal, it can be harder to know where to focus your energy.",
    blindSpot:
      "A balanced profile can sometimes mean you haven't yet found the thing that pulls you strongly in one direction. That's fine — but it's worth asking whether your evenness reflects genuine flexibility or a reluctance to commit.",
  },
];

export function getPersonalityType(profile) {
  const { interests, structure, values, pressure } = profile;
  const c = level(interests);
  const s = level(structure);
  const m = level(values);
  const p = level(pressure);

  const type = TYPES.find((t) => t.match(c, s, m, p));
  return { ...type, levels: { c, s, m, p } };
}
