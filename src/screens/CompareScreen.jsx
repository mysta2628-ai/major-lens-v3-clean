import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ACADEMIC_GROUPS } from "../data/academic-groups.js";
import { getTopMatches } from "../utils/match-groups.js";
import Card from "../components/Card.jsx";

// ── Criteria rows to display ──────────────────────────────────────
const CRITERIA = [
  { key: "description",   label: "Overview" },
  { key: "learningStyle", label: "Learning style" },
  { key: "thinkingType",  label: "Thinking type" },
  { key: "subfields",     label: "Subfields" },
  { key: "majors",        label: "Example majors" },
  { key: "flexibility",   label: "Career flexibility" },
  { key: "careers",       label: "Possible careers" },
];

// ── Load saved profile from localStorage ─────────────────────────
function loadProfile() {
  try {
    const raw = localStorage.getItem("ml_profile");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

// ── Group selector modal ──────────────────────────────────────────
function GroupPicker({ selected, onToggle, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 pb-4 md:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative z-10 w-full max-w-2xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f3ee]">
          <p className="font-semibold text-[#21352d]">Add a group to compare</p>
          <button
            onClick={onClose}
            className="text-[#8a9488] hover:text-[#21352d] transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-4 grid gap-2">
          {ACADEMIC_GROUPS.map((g) => {
            const isSelected = selected.includes(g.key);
            return (
              <button
                key={g.key}
                onClick={() => onToggle(g.key)}
                className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                  isSelected
                    ? "border-[#29443a] bg-[#e6ede9]"
                    : "border-[#dfe3db] bg-white hover:border-[#8a9488]"
                }`}
              >
                <div>
                  <p className="font-medium text-[#21352d] text-sm">{g.name}</p>
                  <p className="text-xs text-[#8a9488] mt-0.5">{g.chineseName}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  isSelected ? "bg-[#29443a] text-white" : "bg-[#f5f7f4] text-[#8a9488]"
                }`}>
                  {isSelected ? "Added" : "+ Add"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[#f0f3ee]">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-[#21352d] py-3 text-sm font-semibold text-white hover:bg-[#29443a] transition-colors"
          >
            Done ({selected.length} selected)
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── Cell renderer ─────────────────────────────────────────────────
function CellValue({ value }) {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((v) => (
          <span
            key={v}
            className="rounded-full border border-[#dfe3db] bg-[#f7f7f4] px-2.5 py-0.5 text-xs text-[#5f6d62]"
          >
            {v}
          </span>
        ))}
      </div>
    );
  }
  return <p className="text-sm leading-6 text-[#5f6d62]">{value}</p>;
}

// ── Main screen ───────────────────────────────────────────────────
export default function CompareScreen() {
  const profile = useMemo(() => loadProfile(), []);

  // Auto-populate with top 3 matches if profile exists, else first 3 groups
  const defaultKeys = useMemo(() => {
    if (profile) {
      return getTopMatches(profile, 3).map((m) => m.key);
    }
    return ACADEMIC_GROUPS.slice(0, 3).map((g) => g.key);
  }, [profile]);

  const [selectedKeys, setSelectedKeys] = useState(defaultKeys);
  const [showPicker, setShowPicker] = useState(false);

  const selectedGroups = selectedKeys
    .map((k) => ACADEMIC_GROUPS.find((g) => g.key === k))
    .filter(Boolean);

  function toggleGroup(key) {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length < 4
        ? [...prev, key]
        : prev
    );
  }

  function removeGroup(key) {
    setSelectedKeys((prev) => prev.filter((k) => k !== key));
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-32 pt-10 md:pt-16">

      {/* Header */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
            Step 3
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#21352d] md:text-5xl">
            Compare directions
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5f6d62]">
            {profile
              ? "These groups were selected based on your assessment results. You can swap or add others below."
              : "Select up to 4 academic groups to compare side by side. Complete the assessment to get personalised suggestions."}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          {!profile && (
            <Link
              to="/assessment"
              className="rounded-full border border-[#dfe3db] bg-white px-4 py-2 text-sm font-medium text-[#486156] hover:border-[#8a9488] transition-colors"
            >
              Take assessment first
            </Link>
          )}
          {selectedKeys.length < 4 && (
            <button
              onClick={() => setShowPicker(true)}
              className="rounded-full bg-[#21352d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#29443a] transition-colors"
            >
              + Add group
            </button>
          )}
        </div>
      </div>

      {/* Profile source note */}
      {profile && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e6ede9] px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#29443a]" />
          <p className="text-xs font-semibold text-[#29443a]">
            Personalised — based on your assessment profile
          </p>
        </div>
      )}

      {/* No groups selected */}
      {selectedGroups.length === 0 && (
        <Card className="mt-10 p-10 text-center">
          <p className="text-[#8a9488]">No groups selected. Add some to start comparing.</p>
          <button
            onClick={() => setShowPicker(true)}
            className="mt-4 rounded-full bg-[#21352d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#29443a] transition-colors"
          >
            + Add group
          </button>
        </Card>
      )}

      {/* Compare table */}
      {selectedGroups.length > 0 && (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 min-w-[640px]">
            <thead>
              <tr>
                {/* Criteria label column */}
                <th className="w-40 px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8a9488]">
                  Criteria
                </th>
                {/* Group columns */}
                {selectedGroups.map((g) => (
                  <th key={g.key} className="px-4 py-2 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xl font-semibold tracking-[-0.02em] text-[#21352d]">{g.name}</p>
                        <p className="text-xs text-[#8a9488] mt-1">{g.chineseName}</p>
                        {/* Fit badge */}
                        <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          g.fit === "strong"  ? "bg-[#e6ede9] text-[#29443a]" :
                          g.fit === "good"    ? "bg-[#eff4f1] text-[#486156]" :
                                               "bg-[#f5f7f4] text-[#8a9488]"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            g.fit === "strong" ? "bg-[#29443a]" :
                            g.fit === "good"   ? "bg-[#7a9e8e]" : "bg-[#c8d4c2]"
                          }`} />
                          {g.fitLabel}
                        </span>
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeGroup(g.key)}
                        className="mt-0.5 flex-shrink-0 text-[#c8d4c2] hover:text-[#8a9488] transition-colors text-sm"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Why it fits you row — only if profile exists */}
              {profile && (
                <tr>
                  <td className="rounded-l-[18px] border border-r-0 border-[#e6e9e2] bg-[#e6ede9] px-5 py-4 w-40">
                    <p className="text-sm font-semibold text-[#29443a]">
                      Why it fits you
                    </p>
                  </td>
                  {selectedGroups.map((g, i) => {
                    const match = getTopMatches(profile, 10).find((m) => m.key === g.key);
                    return (
                      <td
                        key={g.key}
                        className={`border border-[#e6e9e2] bg-[#e6ede9] px-4 py-4 ${
                          i === selectedGroups.length - 1 ? "rounded-r-[18px]" : "border-l-0"
                        }`}
                      >
                        <p className="text-sm leading-6 text-[#486156]">
                          {match ? match.reason : g.whyMatch}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              )}

              {/* Standard criteria rows */}
              {CRITERIA.map((criterion) => (
                <tr key={criterion.key}>
                  <td className="rounded-l-[18px] border border-r-0 border-[#e6e9e2] bg-white px-5 py-5 w-40">
                    <p className="text-sm font-semibold text-[#21352d]">
                      {criterion.label}
                    </p>
                  </td>
                  {selectedGroups.map((g, i) => (
                    <td
                      key={g.key + criterion.key}
                      className={`border border-[#e6e9e2] bg-white px-4 py-5 align-top ${
                        i === selectedGroups.length - 1
                          ? "rounded-r-[18px]"
                          : "border-l-0"
                      }`}
                    >
                      <CellValue value={g[criterion.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Group picker modal */}
      {showPicker && (
        <GroupPicker
          selected={selectedKeys}
          onToggle={toggleGroup}
          onClose={() => setShowPicker(false)}
        />
      )}

    </main>
  );
}
