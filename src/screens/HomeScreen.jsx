import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import SecondaryButton from "../components/SecondaryButton.jsx";

export default function HomeScreen() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start pt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
            Major selection, made more thoughtful
          </p>

          <h1 className="mt-5 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#21352d] lg:text-7xl">
            Stop guessing. Start choosing with clarity.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5f6d62]">
            Major Lens helps students explore university pathways through
            structured reflection, major comparison, and decision support that
            goes beyond prestige, pressure, or vague instinct.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/assessment">
              <PrimaryButton>Start the assessment</PrimaryButton>
            </Link>

            <Link to="/explore">
              <SecondaryButton>Explore majors</SecondaryButton>
            </Link>
          </div>
        </div>

        <aside>
          <Card className="p-7">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#21352d]">
              What this tool helps you do
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-[#5f6d62]">
              <p>
                Identify what is actually driving your choice — interest,
                structure, values, or employment pressure.
              </p>
              <p>
                Compare majors more intelligently instead of relying only on
                salary, prestige, or family expectations.
              </p>
              <p>
                Leave with clearer study directions and a more defensible next
                step.
              </p>
            </div>
          </Card>
        </aside>
      </section>
    </main>
  );
}
