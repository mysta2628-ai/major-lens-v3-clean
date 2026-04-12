import { useState } from "react";
import { FULL_QUESTIONS, LIKERT } from "../data/full_questions.js";
import { computeProfile } from "../utils/full_scoring.js";
import LikertOption from "../components/LikertOption.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function AssessmentScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [profileResult, setProfileResult] = useState(null);

  const [text, dimension] = FULL_QUESTIONS[index] || [];

  function handleSelect(score) {
    const updated = [...answers, { dimension, score }];
    if (index + 1 < FULL_QUESTIONS.length) {
      setAnswers(updated);
      setIndex(index + 1);
    } else {
      const profile = computeProfile(updated);
      setProfileResult(profile);
    }
  }

  if (profileResult) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-2xl font-semibold">Assessment complete</h2>
        <pre className="rounded-[20px] border border-[#dfe3db] bg-white p-6 text-sm overflow-auto">{JSON.stringify(profileResult, null, 2)}</pre>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <ProgressBar current={index + 1} total={FULL_QUESTIONS.length} />
      <h2 className="text-xl font-semibold leading-relaxed">{text}</h2>
      <div className="grid gap-4">
        {LIKERT.map(([label, value]) => (
          <LikertOption key={value} label={label} value={value} selected={false} onSelect={handleSelect} />
        ))}
      </div>
    </main>
  );
}
