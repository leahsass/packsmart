import React from "react";
import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange, min = 0, max = 30, ariaLabel }) {
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors disabled:opacity-30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  return (
    <div
      role="group"
      aria-label={ariaLabel || "quantity"}
      className="flex items-center gap-0.5 rounded-full border border-border bg-card px-0.5"
    >
      <button type="button" aria-label={`${ariaLabel} decrease`} className={btn} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label={`${ariaLabel} increase`} className={btn} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}