import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CATEGORY_META } from "@/lib/categories";

function summaryOf(record) {
  const parts = [];
  if ((record.quantity_unused || 0) > 0) {
    parts.push(`${record.quantity_unused} of ${record.packed_quantity || record.quantity_unused} unused`);
  }
  if ((record.quantity_repeated || 0) > 0) {
    parts.push(`rewore ${record.quantity_repeated}×`);
  }
  return parts.join(" · ");
}

export default function RecapItemRow({ record, onSaved }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(record.reason || "");
  const [saving, setSaving] = useState(false);
  const Icon = CATEGORY_META[record.category]?.icon;

  const save = async () => {
    setSaving(true);
    try {
      const updated = await base44.entities.UnpackFeedback.update(record.id, {
        reason: draft.slice(0, 300)
      });
      onSaved(updated);
      setEditing(false);
    } catch {
      toast({ variant: "destructive", title: "Couldn't save that note — try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <span className="truncate">{record.item_name}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{summaryOf(record)}</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(record.reason || "");
              setEditing(true);
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-primary hover:bg-secondary"
          >
            <Pencil className="h-3 w-3" />
            {record.reason ? "Edit" : "Add note"}
          </button>
        )}
      </div>

      {record.reason && !editing && (
        <p className="mt-2 rounded-xl bg-muted px-3 py-2 text-xs leading-relaxed">{record.reason}</p>
      )}

      {editing && (
        <div className="mt-2 space-y-2">
          <Textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="Optional — why was it unused or reworn? e.g. rain every afternoon, dinners got casual."
            className="text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" className="rounded-full font-bold" disabled={saving} onClick={save}>
              {saving ? "Saving…" : "Save note"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}