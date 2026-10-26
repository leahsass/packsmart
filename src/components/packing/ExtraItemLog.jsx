import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const REASONS = [
  { id: "forgot_to_pack", label: "Forgot to pack it" },
  { id: "bought_for_fun", label: "Bought for fun" },
  { id: "other", label: "Other" }
];

const reasonLabel = (id) => REASONS.find((r) => r.id === id)?.label || "Other";

export default function ExtraItemLog({ tripId }) {
  const [extras, setExtras] = useState(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [reason, setReason] = useState("forgot_to_pack");
  const [saving, setSaving] = useState(false);

  const load = () =>
    base44.entities.UnpackFeedback.filter({ trip_id: tripId, is_extra: true })
      .then((page) => setExtras(page.items))
      .catch(() => setExtras([]));

  useEffect(() => {
    load();
  }, [tripId]);

  const add = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const created = await base44.entities.UnpackFeedback.create({
        trip_id: tripId,
        item_name: name.trim().slice(0, 120),
        category: "extra",
        is_extra: true,
        extra_reason: reason,
        packed_quantity: 0,
        quantity_unused: 0,
        quantity_repeated: 0
      });
      setExtras((prev) => [...(prev || []), created]);
      setName("");
      setReason("forgot_to_pack");
      setAdding(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (extra) => {
    setExtras((prev) => prev.filter((e) => e.id !== extra.id));
    try {
      await base44.entities.UnpackFeedback.delete(extra.id);
    } catch {
      load();
    }
  };

  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">Extra items</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Something you forgot to pack or bought along the way? Log it and I&apos;ll learn for next time.
      </p>

      {(extras || []).map((extra) => (
        <div key={extra.id} className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span className="min-w-0 truncate text-sm font-semibold">{extra.item_name}</span>
          <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            {reasonLabel(extra.extra_reason)}
            <button type="button" aria-label={`Remove ${extra.item_name}`} onClick={() => remove(extra)} className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full p-2 hover:bg-muted">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      ))}

      {adding ? (
        <div className="mt-2 space-y-2 rounded-xl border border-border bg-card p-3">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); add(); }
              if (e.key === "Escape") { setAdding(false); setName(""); }
            }}
            placeholder="e.g. Umbrella"
            className="h-9 text-sm"
          />
          <div className="flex flex-wrap gap-1.5">
            {REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(r.id)}
                aria-pressed={reason === r.id}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  reason === r.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => { setAdding(false); setName(""); }}>
              Cancel
            </Button>
            <Button size="sm" className="rounded-full font-bold" disabled={!name.trim() || saving} onClick={add}>
              {saving ? "Logging…" : "Log it"}
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="mt-2 rounded-full" onClick={() => setAdding(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Log an extra item
        </Button>
      )}
    </div>
  );
}