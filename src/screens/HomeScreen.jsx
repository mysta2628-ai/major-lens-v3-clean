import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

const steps = [
  {
    number: "01",
    label: "Assessment",
    title: "Understand what's driving you",
    description:
      "A structured reflection that surfaces whether your choices are shaped by genuine interest, values, or external pressure.",
    href: "/assessment",
  },
  {
    number: "02",
    label: "Explore",
    title: "See which fields actually fit",
    description:
      "Browse major groups matched to how you think, what you value, and where you imagine yourself in the future.",
    href: "/explore",
  },
  {
    number: "03",
    label: "Compare & Decide",
    title: "Build a choice you can explain",
    description:
      "Compare options on more than salary and prestige — then leave with a reason that's actually yours.",
    href: "/compare",
  },
];

const features = [
  {
    icon: "◎",
    title: "Clarify your motivation",
    description:
      "Not only what you enjoy — but what is actually steering your decision. Interest, anxiety, identity, or external pressure.",
  },
  {
    icon: "⊘",
    title: "Break out of the prestige trap",
    description:
      "Salary and rankings are one lens. Major Lens adds thinking style, learning environment, and long-term flexibility.",
  },
  {
    icon: "→",
    title: "Leave with a reasoned choice",
    description:
      "The goal isn't a single answer handed to you. It's a position you can defend — to yourself, and to others.",
  },
];

export default function HomeScreen() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-32">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pt-10 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-12">
          {/* Left — copy */}
          <div className="max-w-2xl md:flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
              Major selection, made more thoughtful
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#21352d] lg:text-7xl">
              Stop guessing.{" "}
              <br className="hidden md:block" />
              Start choosing{" "}
              <br className="hidden md:block" />
              with clarity.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5f6d62]">
              Major Lens helps you move from vague instinct to a decision you can
              actually stand behind — through structured reflection, not rankings
              or salary tables.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link to="/assessment">
                <PrimaryButton>Start the assessment</PrimaryButton>
              </Link>
              <Link
                to="/explore"
                className="text-sm font-medium text-[#486156] underline underline-offset-4 hover:text-[#21352d] transition-colors"
              >
                Explore majors first
              </Link>
            </div>
          </div>

          {/* Right — preview card */}
          <div className="mt-12 md:mt-8 md:w-[340px] flex-shrink-0">
            <Card className="p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9488]">
                Sample result
              </p>

              <div>
                <p className="text-sm font-semibold text-[#486156]">Top match</p>
                <p className="mt-1 text-xl font-semibold text-[#21352d]">
                  Law & Politics
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#e8ece5]">
                    <div className="h-2 w-[88%] rounded-full bg-[#486156]" />
                  </div>
                  <span className="text-xs font-semibold text-[#486156]">88%</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#486156]">Also strong</p>
                <p className="mt-1 text-lg font-semibold text-[#21352d]">
                  Social & Psychology
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#e8ece5]">
                    <div className="h-2 w-[74%] rounded-full bg-[#8a9488]" />
                  </div>
                  <span className="text-xs font-semibold text-[#8a9488]">74%</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#486156]">Worth exploring</p>
                <p className="mt-1 text-lg font-semibold text-[#21352d]">
                  Management & Finance
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#e8ece5]">
                    <div className="h-2 w-[61%] rounded-full bg-[#c8d4c2]" />
                  </div>
                  <span className="text-xs font-semibold text-[#8a9488]">61%</span>
                </div>
              </div>

              <p className="text-xs text-[#8a9488] italic">
                Based on a sample profile. Your results will be different.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Pain point ───────────────────────────────── */}
      <section className="mt-24 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#486156]">
          Sound familiar?
        </p>

        <blockquote className="mt-6 border-l-2 border-[#c8d4c2] pl-6 space-y-3 text-xl leading-9 text-[#21352d] font-medium tracking-[-0.02em]">
          <p>"I chose this because the salary looked good."</p>
          <p>"My parents think it's stable."</p>
          <p>"I don't really know what else to pick."</p>
        </blockquote>

        <p className="mt-8 text-lg leading-8 text-[#5f6d62]">
          Most major decisions are made with incomplete information and too much
          external noise. Major Lens gives you a structured way to hear yourself
          think.
        </p>
      </section>

      {/* ── How it works — stepper ───────────────────── */}
      <section className="mt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#486156]">
          How it works
        </p>

        <div className="mt-10 flex flex-col md:flex-row md:gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex md:flex-1">
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[2.6rem] top-10 hidden h-px w-[calc(100%-2.6rem)] bg-[#dfe3db] md:block" />
              )}

              <div className="flex gap-5 pb-10 md:flex-col md:gap-0 md:pr-10 md:pb-0">
                {/* step number circle */}
                <div className="flex-shrink-0 mt-1 md:mt-0 flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe3db] bg-white text-xs font-semibold text-[#486156]">
                  {step.number}
                </div>

                <div className="md:mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9488]">
                    {step.label}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#21352d] leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f6d62]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────── */}
      <section className="mt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#486156]">
          What you'll get out of it
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="p-7">
              <span className="text-2xl text-[#486156]">{f.icon}</span>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-[#21352d]">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#5f6d62]">
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────── */}
      <section className="mt-24">
        <Card className="p-10 md:p-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
            Ready when you are
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#21352d]">
            Make a more thoughtful decision.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#5f6d62]">
            The assessment takes about 10 minutes. No sign-up required.
          </p>
          <div className="mt-8">
            <Link to="/assessment">
              <PrimaryButton>Start the assessment</PrimaryButton>
            </Link>
          </div>
        </Card>
      </section>

    </main>
  );
}
