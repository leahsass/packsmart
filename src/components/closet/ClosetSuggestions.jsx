import React, { useEffect, useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORY_META } from "@/lib/categories";
import { formalityLabel, suggestClosetItems, warmthLabel } from "@/lib/closet";
import ClosetPhoto from "./ClosetPhoto";

export default function ClosetSuggestions({ trip, items, onAddItems }) {
  const [closet, setCloset] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.ClosetItem.list("-created_date", 200)
      .then(setCloset)
      .catch(() => setCloset([]));
  }, []);

  const suggestions = useMemo(
    () => (closet ? suggestClosetItems({ closet, trip, existing: items }) : []),
    [closet, trip, items]
  );

  if (!suggestions.length) return null;

  const openReview = () => {
    setSelectedIds(suggestions.map((item) => item.id));
    setOpen(true);
  };

  const toggle = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const confirm = async () => {
    const chosen = suggestions.filter((item) => selectedIds.includes(item.id));
    if (!chosen.length || saving) return;
    setSaving(true);
    try {
      await onAddItems(
        chosen.map((item) => ({
          name: item.name,
          category: item.category,
          closet_item_id: item.id,
          quantity: 1
        }))
      );
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-passport bg-passport/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-sm font-bold text-passport-foreground">From your closet</p>
            <p className="mt-0.5 text-xs text-passport-foreground">
              {suggestions.length} piece{suggestions.length === 1 ? "" : "s"} that suit this trip.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-passport-foreground/30 font-bold text-passport-foreground hover:bg-passport"
            onClick={openReview}
          >
            Review
          </Button>
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {suggestions.slice(0, 6).map((item) => {
            const Icon = CATEGORY_META[item.category]?.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={openReview}
                className="flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-xl p-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-card">
                  <ClosetPhoto
                    fileUri={item.photo_uri}
                    alt={item.name}
                    className="h-14 w-14"
                    fallback={Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
                  />
                </span>
                <span className="line-clamp-2 text-[11px] font-semibold text-passport-foreground">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Add from your closet</DialogTitle>
          </DialogHeader>

          <p className="-mt-2 text-xs text-muted-foreground">
            These match your destination weather and plans. Nothing is added until you confirm.
          </p>

          <div className="space-y-2">
            {suggestions.map((item) => {
              const active = selectedIds.includes(item.id);
              const Icon = CATEGORY_META[item.category]?.icon;
              const meta = [item.color, warmthLabel(item.warmth), formalityLabel(item.formality)]
                .filter(Boolean)
                .join(" · ");
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active ? "border-primary bg-secondary/40" : "border-border bg-card"
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
                    <span className="block truncate text-xs text-muted-foreground">
                      {meta || CATEGORY_META[item.category]?.label}
                    </span>
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-input"
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              className="rounded-full px-5 font-bold"
              disabled={!selectedIds.length || saving}
              onClick={confirm}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add {selectedIds.length || ""} to packing list
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}