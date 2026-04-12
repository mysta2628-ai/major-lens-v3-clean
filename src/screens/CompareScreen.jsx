import CompareTable from "../components/CompareTable.jsx";
import { majors } from "../data/majors.js";

export default function CompareScreen() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#21352d]">Compare majors</h2>
      <p className="mt-4 max-w-3xl leading-8 text-[#5f6d62]">Compare shortlisted study directions across learning style, careers, and likely fit.</p>
      <CompareTable majors={majors} />
    </main>
  );
}
