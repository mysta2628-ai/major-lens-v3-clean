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
            Reflective academic decision-support prototype
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#21352d] lg:text-7xl">
            Make a better decision.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5f6d62]">
            Major Lens helps high school graduates and first-year university students make better major decisions through a structured assessment of interests, analytical strengths, values, and employment pressure.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/assessment"><PrimaryButton>Take the 5-minute assessment</PrimaryButton></Link>
            <Link to="/explore"><SecondaryButton>Explore study directions</SecondaryButton></Link>
          </div>
        </div>
        <aside>
          <Card className="p-7">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#21352d]">Major Lens</h2>
            <p className="mt-3 text-sm text-[#5f6d62]">Compare majors more thoughtfully and move beyond prestige-only decisions.</p>
          </Card>
        </aside>
      </section>
    </main>
  );
}
