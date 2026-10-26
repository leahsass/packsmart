import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Shirt } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { CATEGORY_META } from "@/lib/categories";
import { matchIndicators, suggestClosetItems } from "@/lib/closet";
import ClosetPhoto from "@/components/closet/ClosetPhoto";

export default function ClosetStep({ draft, selected, onChange }) {
  const [closet, setCloset] = useState(null);

  useEffect(() => {
    base44.entities.ClosetItem.list("-created_date", 200)
      .then(setCloset)
      .catch(() => setCloset([]));
  }, []);

  const suggestions = useMemo(
    () => (closet ? suggestClosetItems({ closet, trip: draft, limit: 12 }) : []),
    [closet, draft]
  );

  const selectedIds = new Set(selected.map((item) => item.id));

  const toggle = (item) =>
    onChange(
      selectedIds.has(item.id) ? selected.filter((i) => i.id !== item.id) : [...selected, item]
    );

  if (closet === null) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-extrabold">Anything from your closet?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick pieces you already own and I&apos;ll build the rest of the list around them. Optional.
        </p>
      </div>

      {closet.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
          <Shirt className="mx-auto h-5 w-5 text-muted-foreground" />
          <p className="mt-2 text-sm font-semibold">Your closet is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You can add pieces any time — for now I&apos;ll pack everything from scratch.
          </p>
          <Link to="/closet" className="mt-3 inline-block text-xs font-bold text-primary hover:underline">
            Build my closet
          </Link>
        </div>
      ) : suggestions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Nothing in your closet matches this trip yet. Your list will still be built in full.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {suggestions.map((item) => {
              const active = selectedIds.has(item.id);
              const Icon = CATEGORY_META[item.category]?.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(item)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active ? "border-primary bg-secondary/50" : "border-border bg-card hover:border-muted-foreground/40"
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                    <ClosetPhoto
                      fileUri={item.photo_uri}
                      alt={item.name}
                      className="h-12 w-12"
                      fallback={Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.name}</span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {matchIndicators(item, draft).map((indicator) => (
                        <span
                          key={indicator}
                          className="rounded-full bg-passport px-2 py-0.5 text-[10px] font-bold text-passport-foreground"
                        >
                          {indicator}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-input"
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <p className="text-xs font-semibold text-primary">
              {selected.length} piece{selected.length === 1 ? "" : "s"} will come from your closet.
            </p>
          )}
        </>
      )}
    </div>
  );
}