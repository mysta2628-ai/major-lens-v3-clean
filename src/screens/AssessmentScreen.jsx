import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FULL_QUESTIONS, LIKERT } from "../data/full_questions.js";
import { computeProfile } from "../utils/full_scoring.js";
import LikertOption from "../components/LikertOption.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

// ── Dimension metadata ────────────────────────────────────────────
const DIMENSIONS = {
  interests: {
    label: "Intellectual Curiosity",
    low:  "Goal-oriented — you prefer clear targets and defined outcomes.",
    mid:  "Balanced — you enjoy exploring but also value direction.",
    high: "Curiosity-driven — you're energised by ideas and open-ended questions.",
    icon: "◎",
  },
  structure: {
    label: "Thinking Style",
    low:  "Intuitive — you prefer open, exploratory thinking over rigid frameworks.",
    mid:  "Flexible — you can work with structure but don't rely on it.",
    high: "Systematic — you're drawn to logic, frameworks, and structured reasoning.",
    icon: "⊞",
  },
  values: {
    label: "Meaning Orientation",
    low:  "Pragmatic — outcomes, speed, and practicality guide your choices.",
    mid:  "Mixed — you balance purpose with practical considerations.",
    high: "Values-driven — you want your work to align with personal meaning and ethics.",
    icon: "→",
  },
  pressure: {
    label: "External Influence",
    low:  "Self-directed — your choices are mostly shaped by your own preferences.",
    mid:  "Moderately influenced — you consider external factors but maintain autonomy.",
    high: "Externally influenced — family expectations, salary, and job security weigh heavily.",
    icon: "△",
  },
};

const MAX_SCORE = 25;

function getDimLabel(score) {
  const pct = score / MAX_SCORE;
  if (pct >= 0.7) return "high";
  if (pct >= 0.4) return "mid";
  return "low";
}

// ── Build system prompt from Phase 1 profile ─────────────────────
function buildSystemPrompt(profile) {
  const dims = Object.entries(profile).map(([key, score]) => {
    const d = DIMENSIONS[key];
    const level = getDimLabel(score);
    return `- ${d.label}: ${level} (${score}/${MAX_SCORE}) — ${d[level]}`;
  });

  return `You are an educational counsellor helping a high school student in Taiwan explore which academic major group suits them best. You are conducting a short guided conversation (maximum 5 turns) to help them clarify their thinking and interests.

The student just completed a multiple-choice assessment. Here are their Phase 1 profile results:
${dims.join("\n")}

Your job in this conversation:
1. Ask one thoughtful, open-ended question per turn — directly relevant to their profile results.
2. Listen carefully to their answers and build on them in the next question.
3. Do NOT give a final recommendation until the 5th turn.
4. On the 5th turn (when you see [FINAL_TURN] in the system instruction), produce a structured personal analysis in the following format exactly:

---ANALYSIS---
**Your Learning Character**
[2–3 sentences describing how this student thinks and learns, grounded in their answers]

**Where You Fit Best**
[Top 2–3 academic group recommendations with a specific reason for each, tied to what the student actually said]

**One Thing To Watch**
[One honest blind spot or caution based on the conversation]

**A Question To Sit With**
[One reflective question for them to keep thinking about]
---END---

Keep your language warm, direct, and educational — not corporate. Speak to the student, not about them. Keep each message under 120 words (except the final analysis).

Start by greeting the student briefly and asking your first question. Do not repeat or summarise the Phase 1 results to the student — just move straight into the conversation.`;
}

// ── Call /api/chat ────────────────────────────────────────────────
async function callChat(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.text;
}

// ── Parse final analysis block ────────────────────────────────────
function parseAnalysis(text) {
  const match = text.match(/---ANALYSIS---([\s\S]*?)---END---/);
  if (!match) return null;
  return match[1].trim();
}

// ── Render analysis markdown (bold + paragraphs) ─────────────────
function AnalysisBlock({ text }) {
  const sections = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="flex flex-col gap-5">
      {sections.map((section, i) => {
        // Bold heading line
        const boldMatch = section.match(/^\*\*(.+?)\*\*\n?([\s\S]*)/);
        if (boldMatch) {
          return (
            <div key={i}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9488] mb-2">
                {boldMatch[1]}
              </p>
              <p className="text-[15px] leading-7 text-[#5f6d62]">
                {boldMatch[2].trim()}
              </p>
            </div>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-7 text-[#5f6d62]">
            {section}
          </p>
        );
      })}
    </div>
  );
}

// ── Phase 2 conversation screen ───────────────────────────────────
function Phase2Screen({ profile }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // { role: "user"|"model", text }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turn, setTurn] = useState(0); // how many user messages sent
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_TURNS = 5;
  const systemPrompt = buildSystemPrompt(profile);

  // Kick off with AI greeting
  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startConversation() {
    setLoading(true);
    setError(null);
    try {
      // Send system prompt as first user message so Gemini follows it
      const initMessages = [{ role: "user", text: systemPrompt + "\n\n[Begin the conversation now.]" }];
      const reply = await callChat(initMessages);
      setMessages([{ role: "model", text: reply }]);
    } catch {
      setError("Something went wrong connecting to the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newTurn = turn + 1;
    setTurn(newTurn);
    setInput("");

    const userMsg = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      // Reconstruct full context for Gemini
      const isFinalTurn = newTurn >= MAX_TURNS;
      const systemNote = isFinalTurn
        ? systemPrompt + "\n\n[FINAL_TURN] This is the student's last response. Now produce the structured analysis."
        : systemPrompt;

      // Build the message list: system + conversation so far
      const apiMessages = [
        { role: "user", text: systemNote + "\n\n[Begin the conversation now.]" },
        // Skip first model greeting (index 0) — already sent as context
        ...updatedMessages,
      ];

      // Insert the AI's previous replies back in
      const fullContext = [
        { role: "user", text: systemNote + "\n\n[Begin the conversation now.]" },
        ...messages, // includes model greetings and user replies
        userMsg,
      ];

      const reply = await callChat(fullContext);
      const parsed = parseAnalysis(reply);

      if (parsed) {
        setAnalysis(parsed);
        // Save enhanced profile flag
        try {
          localStorage.setItem("ml_phase2_done", "true");
          localStorage.setItem("ml_analysis", parsed);
        } catch (_) {}
      }

      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Final analysis view ────────────────────────────────────────
  if (analysis) {
    return (
      <main className="max-w-2xl mx-auto px-6 pb-32 pt-10 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
          Your Analysis
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#21352d] md:text-5xl">
          Your Personal Report
        </h1>
        <p className="mt-4 text-lg leading-8 text-[#5f6d62]">
          Based on both your assessment scores and the conversation you just had.
        </p>

        <Card className="mt-10 p-8">
          <AnalysisBlock text={analysis} />
        </Card>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 text-center bg-[#21352d] text-[#f5f3ee] text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#29443a] transition-colors"
          >
            View Full Profile
          </button>
          <button
            onClick={() => navigate("/next")}
            className="flex-1 text-center border border-[#dfe3db] text-[#486156] text-sm font-semibold px-6 py-3 rounded-full hover:border-[#21352d] hover:text-[#21352d] transition-colors"
          >
            See Next Steps
          </button>
        </div>
      </main>
    );
  }

  // ── Chat UI ────────────────────────────────────────────────────
  const turnsLeft = MAX_TURNS - turn;

  return (
    <main className="max-w-2xl mx-auto px-6 pt-10 pb-6 md:pt-16 flex flex-col" style={{ minHeight: "calc(100vh - 72px)" }}>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-1">
          Phase 2 — Deep Dive
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#21352d]">
          Let's Go Deeper
        </h1>
        <p className="text-sm text-[#8a9488] mt-1">
          {turnsLeft > 0
            ? `${turnsLeft} question${turnsLeft !== 1 ? "s" : ""} left — then you'll get your personal analysis`
            : "Generating your analysis..."}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: MAX_TURNS }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < turn ? "#21352d" : "#dfe3db" }}
          />
        ))}
      </div>

      {/* Message list */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-[18px] px-5 py-4 text-[15px] leading-7 ${
                msg.role === "user"
                  ? "bg-[#21352d] text-[#f5f3ee] rounded-br-[4px]"
                  : "bg-white border border-[#dfe3db] text-[#21352d] rounded-bl-[4px]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#dfe3db] rounded-[18px] rounded-bl-[4px] px-5 py-4">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#8a9488] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      {turn < MAX_TURNS && !loading && messages.length > 0 && (
        <div className="mt-4 flex gap-3 items-end border-t border-[#dfe3db] pt-4">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
            rows={2}
            className="flex-1 resize-none rounded-[16px] border border-[#dfe3db] bg-white px-4 py-3 text-[15px] text-[#21352d] placeholder-[#8a9488] outline-none focus:border-[#21352d] transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0 bg-[#21352d] text-[#f5f3ee] text-sm font-semibold px-5 py-3 rounded-full hover:bg-[#29443a] disabled:opacity-40 transition-colors"
          >
            Send
          </button>
        </div>
      )}
    </main>
  );
}

// ── Phase 1 result / bridge screen ────────────────────────────────
function Phase1ResultScreen({ profile, onContinue }) {
  const topDim = Object.entries(profile).reduce((a, b) => a[1] > b[1] ? a : b);
  const topDimMeta = DIMENSIONS[topDim[0]];

  return (
    <main className="max-w-2xl mx-auto px-6 pb-32 pt-10 md:pt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
        Phase 1 Complete
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#21352d] md:text-5xl">
        Good Start.
      </h1>
      <p className="mt-4 text-lg leading-8 text-[#5f6d62]">
        Your answers give us a clear starting point. Now let's go deeper with a short conversation.
      </p>

      {/* Dimension scores */}
      <section className="mt-10 space-y-5">
        {Object.entries(profile).map(([key, score]) => {
          const dim = DIMENSIONS[key];
          if (!dim) return null;
          const level = getDimLabel(score);
          const pct = Math.round((score / MAX_SCORE) * 100);
          return (
            <Card key={key} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg text-[#486156]">{dim.icon}</span>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#486156]">
                  {dim.label}
                </p>
                <span className="ml-auto text-xs font-semibold text-[#21352d]">{pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#e8ece5] mb-3">
                <div
                  className="h-1.5 rounded-full bg-[#29443a]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm leading-6 text-[#5f6d62]">{dim[level]}</p>
            </Card>
          );
        })}
      </section>

      {/* Bridge CTA */}
      <div className="mt-12 rounded-[24px] bg-[#21352d] px-8 py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a9b8a] mb-2">
          Phase 2
        </p>
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#f5f3ee] mb-2">
          Let's Talk It Through
        </h2>
        <p className="text-sm leading-6 text-[#c8d4c0] mb-6">
          A short guided conversation — 5 questions, typed answers — will help us build a personalised analysis that goes beyond the scores.
        </p>
        <button
          onClick={onContinue}
          className="bg-[#f5f3ee] text-[#21352d] text-sm font-semibold px-6 py-3 rounded-full hover:bg-white transition-colors"
        >
          Start Phase 2
        </button>
      </div>
    </main>
  );
}

// ── Assessment question screen ────────────────────────────────────
export default function AssessmentScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState(1); // 1 = MCQ, 1.5 = bridge, 2 = chat
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
        setPhase(1.5);
      }
    }, 260);
  }

  if (phase === 1.5 && profileResult) {
    return (
      <Phase1ResultScreen
        profile={profileResult}
        onContinue={() => setPhase(2)}
      />
    );
  }

  if (phase === 2 && profileResult) {
    return <Phase2Screen profile={profileResult} />;
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488] mb-1">
          Phase 1 — Quick Assessment
        </p>
        <ProgressBar current={index + 1} total={FULL_QUESTIONS.length} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9488]">
          Question {index + 1} Of {FULL_QUESTIONS.length}
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
