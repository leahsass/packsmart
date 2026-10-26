import React from "react";
import { Star } from "lucide-react";
import { CATEGORY_META } from "@/lib/categories";
import { formalityLabel, warmthLabel } from "@/lib/closet";
import ClosetPhoto from "./ClosetPhoto";

export default function ClosetItemCard({ item, onEdit, onToggleFavorite }) {
  const Icon = CATEGORY_META[item.category]?.icon;
  const meta = [item.color, warmthLabel(item.warmth), formalityLabel(item.formality)].filter(Boolean).join(" · ");

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-border bg-card p-2">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
          <ClosetPhoto
            fileUri={item.photo_uri}
            alt={item.name}
            className="h-14 w-14"
            fallback={Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
          />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-heading text-sm font-bold">{item.name}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {meta || CATEGORY_META[item.category]?.label}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onToggleFavorite(item)}
        aria-pressed={!!item.favorite}
        aria-label={item.favorite ? `Remove ${item.name} from favorites` : `Favorite ${item.name}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Star className={`h-4 w-4 ${item.favorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>
    </div>
  );
}