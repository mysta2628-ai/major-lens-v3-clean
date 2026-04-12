import { useState } from "react";
import { ACADEMIC_GROUPS, FIT_ORDER } from "../data/academic-groups.js";

// ── Fit badge ────────────────────────────────────────────────────
const FIT_STYLES = {
  strong:  { dot: "bg-[#29443a]",  badge: "bg-[#e6ede9] text-[#29443a]"  },
  good:    { dot: "bg-[#7a9e8e]",  badge: "bg-[#eff4f1] text-[#486156]"  },
  explore: { dot: "bg-[#c8d4c2]",  badge: "bg-[#f5f7f4] text-[#8a9488]"  },
};

function FitBadge({ fit, label }) {
  const s = FIT_STYLES[fit];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

// ── Expandable group card ─────────────────────────────────────────
function GroupCard({ group }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[24px] border border-[#dfe3db] bg-white shadow-sm overflow-hidden">
      {/* Card header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-7 flex items-start justify-between gap-4 hover:bg-[#fafaf8] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <FitBadge fit={group.fit} label={group.fitLabel} />
            <span className="text-xs text-[#8a9488]">{group.chineseName}</span>
          </div>

          <h3 className="mt-3 text-xl font-semibold text-[#21352d] leading-snug">
            {group.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5f6d62] line-clamp-2">
            {group.description}
          </p>
        </div>

        {/* Expand chevron */}
        <span
          className={`mt-1 flex-shrink-0 text-[#8a9488] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4.5 6.75 L9 11.25 L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-7 pb-7 border-t border-[#f0f3ee]">
          {/* Why it matches */}
          <div className="mt-5 rounded-2xl bg-[#f5f7f4] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#486156]">
              Why it matches you
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5f6d62]">
              {group.whyMatch}
            </p>
          </div>

          {/* Detail grid */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {/* Subfields */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a9488]">
                Subfields
              </p>
              <ul className="mt-2 space-y-1">
                {group.subfields.map((s) => (
                  <li key={s} className="text-sm text-[#5f6d62] flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#c8d4c2] flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Example majors */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a9488]">
                Example majors
              </p>
              <ul className="mt-2 space-y-1">
                {group.majors.map((m) => (
                  <li key={m} className="text-sm text-[#5f6d62] flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#c8d4c2] flex-shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning style */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a9488]">
                Learning style
              </p>
              <p className="mt-2 text-sm text-[#5f6d62]">{group.learningStyle}</p>
            </div>

            {/* Flexibility */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a9488]">
                Career flexibility
              </p>
              <p className="mt-2 text-sm text-[#5f6d62]">{group.flexibility}</p>
            </div>
          </div>

          {/* Careers */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a9488]">
              Possible careers
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.careers.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[#dfe3db] bg-[#f7f7f4] px-3 py-1 text-xs text-[#5f6d62]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────
const FILTERS = [
  { key: "all",     label: "All 18 groups" },
  { key: "strong",  label: "Strong fit" },
  { key: "good",    label: "Good fit" },
  { key: "explore", label: "Worth exploring" },
];

// ── Main screen ───────────────────────────────────────────────────
export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState("all");

  const sorted = [...ACADEMIC_GROUPS].sort(
    (a, b) => FIT_ORDER[a.fit] - FIT_ORDER[b.fit]
  );

  const filtered =
    activeFilter === "all"
      ? sorted
      : sorted.filter((g) => g.fit === activeFilter);

  return (
    <main className="mx-auto max-w-4xl px-6 pb-32">
      {/* Header */}
      <section className="pt-10 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9488]">
          Step 2
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#21352d] md:text-5xl">
          Explore study directions
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6d62]">
          Browse all 18 academic groups. Complete the assessment first to see
          personalised fit labels — or explore freely below.
        </p>
      </section>

      {/* Fit legend */}
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-[#5f6d62]">
          <FitBadge fit="strong" label="Strong fit" />
          <span className="text-[#8a9488]">—</span>
          <FitBadge fit="good" label="Good fit" />
          <span className="text-[#8a9488]">—</span>
          <FitBadge fit="explore" label="Worth exploring" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === f.key
                ? "border-[#21352d] bg-[#21352d] text-white"
                : "border-[#dfe3db] bg-white text-[#5f6d62] hover:border-[#8a9488]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Group count */}
      <p className="mt-5 text-sm text-[#8a9488]">
        Showing {filtered.length} of {ACADEMIC_GROUPS.length} groups
      </p>

      {/* Cards */}
      <div className="mt-6 flex flex-col gap-4">
        {filtered.map((group) => (
          <GroupCard key={group.key} group={group} />
        ))}
      </div>
    </main>
  );
}
