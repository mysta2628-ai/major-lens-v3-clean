// Phase 1 — 20 questions, 4 dimensions × 5 questions
// Written to feel like genuine self-reflection, not a survey.
// Format: [question text, dimension key]
// Dimensions: interests (curiosity), structure (thinking style),
//             values (meaning), pressure (external influence)

export const FULL_QUESTIONS = [
  // ── Intellectual Curiosity (interests) ───────────────────────────
  [
    "When I finish a class I liked, I usually want to keep reading about it on my own.",
    "interests",
  ],
  [
    "I find myself more excited at the start of a new topic than when I finally master it.",
    "interests",
  ],
  [
    "I get restless when I'm stuck in one subject for too long without exploring something new.",
    "interests",
  ],
  [
    "I'd rather take a course that challenges my assumptions than one I know I'll do well in.",
    "interests",
  ],
  [
    "I often notice connections between subjects that don't obviously belong together.",
    "interests",
  ],

  // ── Thinking Style (structure) ────────────────────────────────────
  [
    "Before starting an assignment, I usually spend time planning how I'll approach it.",
    "structure",
  ],
  [
    "I find it easier to work when I have a clear framework or set of rules to follow.",
    "structure",
  ],
  [
    "When solving a problem, I prefer to work through it step-by-step rather than going with gut feeling.",
    "structure",
  ],
  [
    "I like knowing exactly what's expected of me before I start working.",
    "structure",
  ],
  [
    "I tend to keep notes organised and revisit them in a structured way.",
    "structure",
  ],

  // ── Meaning Orientation (values) ─────────────────────────────────
  [
    "If two jobs paid the same, I'd pick the one that felt meaningful over the one that was easier.",
    "values",
  ],
  [
    "I'd feel uncomfortable spending years on work I didn't believe was useful to society.",
    "values",
  ],
  [
    "Whether a field aligns with my personal beliefs matters to me when choosing what to study.",
    "values",
  ],
  [
    "I think about the long-term impact of what I'm learning, not just how it helps me get a job.",
    "values",
  ],
  [
    "I'd rather take a lower-paying role that I cared about than a well-paid one I found hollow.",
    "values",
  ],

  // ── External Influence (pressure) ────────────────────────────────
  [
    "My family's opinion about which major I choose matters a lot to me.",
    "pressure",
  ],
  [
    "I regularly check which degrees lead to stable, high-paying careers.",
    "pressure",
  ],
  [
    "I'd feel uncomfortable choosing a major that people around me didn't understand or respect.",
    "pressure",
  ],
  [
    "Job market data — employment rates, starting salaries — plays a big role in how I think about my options.",
    "pressure",
  ],
  [
    "The prestige of a field or university name affects how seriously I consider it.",
    "pressure",
  ],
];

export const LIKERT = [
  ["Strongly Disagree", 1],
  ["Disagree", 2],
  ["Neutral", 3],
  ["Agree", 4],
  ["Strongly Agree", 5],
];
