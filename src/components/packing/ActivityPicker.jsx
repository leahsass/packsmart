import React, { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { ACTIVITIES } from "@/lib/categories";

export default function ActivityPicker({ tags = ACTIVITIES, selected, onToggle }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  // Always show anything already selected, even if it's not in the current tag list
  const extra = selected
    .filter((id) => !tags.some((t) => t.id === id))
    .map((id) => ({ id, label: id.replace(/\b\w/g, (c) => c.toUpperCase()), count: 0 }));
  const allTags = [...tags, ...extra];

  const addCustom = () => {
    const label = draft.trim();
    if (label) {
      const id = label.toLowerCase().slice(0, 60);
      if (!selected.includes(id)) onToggle(id);
    }
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((activity) => {
        const active = selected.includes(activity.id);
        return (
          <button
            key={activity.id}
            type="button"
            onClick={() => onToggle(activity.id)}
            aria-pressed={active}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
            }`}
          >
            {activity.label}
          </button>
        );
      })}
      {adding ? (
        <span className="flex items-center gap-1 rounded-full border border-primary/50 bg-card pl-3 pr-1 py-1">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addCustom(); }
              if (e.key === "Escape") { setDraft(""); setAdding(false); }
            }}
            placeholder="e.g. Rock climbing"
            className="w-32 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="button" aria-label="Add tag" onClick={addCustom} className="rounded-full p-1.5 hover:bg-muted">
            <Check className="h-4 w-4 text-primary" />
          </button>
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => { setDraft(""); setAdding(false); }}
            className="rounded-full p-1.5 hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-full border border-dashed border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      )}
    </div>
  );
}