import React from "react";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { COLOR_OPTIONS } from "@/lib/closet";

const MULTI_SWATCH = "conic-gradient(#c03434, #e8c22a, #2f7d4f, #2f6bd8, #6a4c93, #c03434)";

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label>Color</Label>
      <div className="flex flex-wrap gap-2">
        {COLOR_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? "" : option.value)}
              className={`flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-full border border-black/20"
                style={{ background: option.hex || MULTI_SWATCH }}
              />
              {option.label}
              {active && <Check className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}