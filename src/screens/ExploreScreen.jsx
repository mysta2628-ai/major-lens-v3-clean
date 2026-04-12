import Card from "../components/Card.jsx";
import { majors } from "../data/majors.js";

export default function ExploreScreen() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#21352d]">Explore study directions</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {majors.map((major) => (
          <Card key={major.key} className="p-7">
            <h3 className="text-lg font-semibold text-[#21352d]">{major.title}</h3>
            <p className="mt-4 leading-7 text-[#5f6d62]">{major.learningStyle}</p>
            <p className="mt-4 text-sm text-[#486156]">{major.fit}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
