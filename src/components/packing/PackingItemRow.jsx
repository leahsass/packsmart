import React from "react";
import { Check, Briefcase, Trophy, Trash2 } from "lucide-react";
import QuantityStepper from "./QuantityStepper";

export default function PackingItemRow({ item, onToggle, onQuantityChange, onDelete }) {
  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
        item.packed ? "border-primary/20 bg-secondary/50" : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <button
        type="button"
        aria-label={item.packed ? "mark unpacked" : "mark packed"}
        onClick={() => onToggle(!item.packed)}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          item.packed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 text-transparent hover:border-primary"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
      aria-pressed={item.packed}
      >
        <Check className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className={`text-sm font-semibold ${item.packed ? "text-muted-foreground line-through" : ""}`}>
            {item.name}
          </p>
          {item.checked_bag_only && (
            <span className="inline-flex items-center gap-1 rounded-full bg-passport px-2 py-0.5 text-[11px] font-bold text-passport-foreground">
              <Briefcase className="h-3 w-3" /> Checked bag only
            </span>
          )}
          {item.is_sports && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
              <Trophy className="h-3 w-3" /> Sports
            </span>
          )}
        </div>
        {item.note && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{item.note}</p>}
      </div>
      <QuantityStepper value={item.quantity} min={0} onChange={onQuantityChange} ariaLabel={`${item.name} quantity`} />
      <button
        type="button"
        aria-label={`remove ${item.name}`}
        onClick={onDelete}
        className="-m-1.5 p-2 text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}