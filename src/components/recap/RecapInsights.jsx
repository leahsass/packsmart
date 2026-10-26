import React from "react";
import { Sparkles } from "lucide-react";

export default function RecapInsights({ insights }) {
  return (
    <section className="rounded-3xl border border-passport bg-passport/50 p-4">
      <h2 className="flex items-center gap-2 font-heading text-xs font-extrabold text-passport-foreground">
        <Sparkles className="h-4 w-4" /> What I learned
      </h2>
      {insights.length ? (
        <ul className="mt-2 space-y-1.5">
          {insights.map((item) => (
            <li key={item.id} className="flex gap-2 text-sm leading-relaxed text-passport-foreground">
              <span aria-hidden="true">·</span>
              {item.insight}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-passport-foreground">
          No lasting lessons from this one yet — add a note below and refresh them.
        </p>
      )}
    </section>
  );
}