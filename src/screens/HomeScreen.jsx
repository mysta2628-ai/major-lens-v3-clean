import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

export default function HomeScreen() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24">
      {/* Hero */}
      <section className="pt-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
            Major selection, made more thoughtful
          </p>

          <h1 className="mt-5 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#21352d] lg:text-7xl">
            Stop guessing. Start choosing with clarity.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5f6d62]">
            Major Lens helps students explore university pathways through
            structured reflection, major comparison, and decision support that
            turns vague uncertainty into clearer choices.
          </p>

          <div className="mt-8">
            <Link to="/assessment">
              <PrimaryButton>Start the assessment</PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Point Resonance */}
      <section className="mt-24 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#486156]">
          Why this matters
        </p>

        <div className="mt-6 space-y-4 text-lg leading-8 text-[#5f6d62]">
          <p>Many students choose a major because:</p>
          <p>・the salary looks good</p>
          <p>・their family thinks it is stable</p>
          <p>・they do not know what else to choose</p>
        </div>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-[#5f6d62]">
          Major Lens helps turn these vague reasons into choices you can
          actually reflect on, compare, and explain with confidence.
        </p>
      </section>

      {/* How It Works */}
      <section className="mt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#486156]">
          How it works
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="p-7">
            <p className="text-sm font-semibold text-[#486156]">① Assessment</p>
            <h3 className="mt-3 text-xl font-semibold text-[#21352d]">
              Take a structured reflection
            </h3>
            <p className="mt-4 leading-7 text-[#5f6d62]">
              Understand whether your choices are being driven more by
              interests, values, analytical structure, or employment pressure.
            </p>
          </Card>

          <Card className="p-7">
            <p className="text-sm font-semibold text-[#486156]">② Explore</p>
            <h3 className="mt-3 text-xl font-semibold text-[#21352d]">
              See which fields fit you
            </h3>
            <p className="mt-4 leading-7 text-[#5f6d62]">
              Use your profile to explore majors that better match the way you
              think, learn, and imagine your future.
            </p>
          </Card>

          <Card className="p-7">
            <p className="text-sm font-semibold text-[#486156]">③ Compare</p>
            <h3 className="mt-3 text-xl font-semibold text-[#21352d]">
              Compare and move forward
            </h3>
            <p className="mt-4 leading-7 text-[#5f6d62]">
              Look beyond rankings and salary alone. Compare options through the
              lens of learning style, motivation, and long-term fit.
            </p>
          </Card>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#486156]">
          What this tool helps you do
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="p-7">
            <h3 className="text-xl font-semibold text-[#21352d]">
              Clarify your motivation
            </h3>
            <p className="mt-4 leading-7 text-[#5f6d62]">
              It is not only about what you like. It is about understanding what
              is actually driving your decision.
            </p>
          </Card>

          <Card className="p-7">
            <h3 className="text-xl font-semibold text-[#21352d]">
              Break out of salary and prestige thinking
            </h3>
            <p className="mt-4 leading-7 text-[#5f6d62]">
              Compare majors through multiple dimensions, including learning
              style, type of thinking, and range of future pathways.
            </p>
          </Card>

          <Card className="p-7">
            <h3 className="text-xl font-semibold text-[#21352d]">
              Leave with a reasoned choice
            </h3>
            <p className="mt-4 leading-7 text-[#5f6d62]">
              The goal is not to hand you a single answer, but to help you
              explain clearly why one path makes more sense for you.
            </p>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-24">
        <Card className="p-10 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#21352d]">
            Ready to make a more thoughtful decision?
          </h2>

          <p className="mt-4 text-lg leading-8 text-[#5f6d62]">
            The assessment takes about 10 minutes.
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
