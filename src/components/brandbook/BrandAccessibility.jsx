import React from "react";
import { CheckCircle2 } from "lucide-react";

const PAIRS = [
  { label: "Ink on paper", fg: "#2D2D2D", bg: "#F5F2E9", ratio: "11.9:1" },
  { label: "White on terracotta", fg: "#FFFFFF", bg: "#C1451F", ratio: "5.1:1" },
  { label: "Terracotta on paper", fg: "#C1451F", bg: "#F5F2E9", ratio: "4.5:1" },
  { label: "White on passport blue", fg: "#FFFFFF", bg: "#1A237E", ratio: "15.0:1" },
  { label: "Teal on teal tint", fg: "#1E5A54", bg: "#E5F0EE", ratio: "5.5:1" },
  { label: "Stamp red on paper", fg: "#B71C1C", bg: "#F5F2E9", ratio: "5.9:1" },
];

const RULES = [
  "All text meets WCAG 2.1 AA: 4.5:1 for body, 3:1 for large text and icons.",
  "Input borders and dark-mode borders meet 3:1 so fields are always visible.",
  "Never lower text opacity to soften it — pick a token that already passes.",
  "Every button and link shows a terracotta focus ring when reached by keyboard.",
  "Icon-only buttons need an aria-label that names the item, like “Socks quantity increase”.",
];

export default function BrandAccessibility() {
  return (
    <section>
      <h2 className="serif text-2xl font-bold md:text-3xl">Accessibility</h2>
      <p className="mt-2 text-sm text-ink-muted">Verified contrast ratios for the core color pairings.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PAIRS.map((p) => (
          <div key={p.label} className="soft-border overflow-hidden rounded-lg bg-paper-white">
            <div className="px-4 py-5 text-lg font-bold serif" style={{ color: p.fg, background: p.bg }}>
              Aa
            </div>
            <div className="p-3">
              <p className="text-xs font-bold">{p.label}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                <CheckCircle2 className="h-3.5 w-3.5" /> {p.ratio} · AA pass
              </p>
            </div>
          </div>
        ))}
      </div>

      <ul className="soft-border card-shadow mt-6 space-y-2 rounded-lg bg-paper-white p-5 text-sm">
        {RULES.map((r) => (
          <li key={r} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}