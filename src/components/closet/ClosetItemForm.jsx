import React, { useEffect, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORY_META } from "@/lib/categories";
import { CLOSET_CATEGORIES, FORMALITY_OPTIONS, normalizeFormality, WARMTH_OPTIONS } from "@/lib/closet";
import ColorPicker from "./ColorPicker";
import ClosetPhoto from "./ClosetPhoto";

function OptionRow({ options, value, onChange, label, allowClear = true }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active && allowClear ? "" : option.value)}
              className={`min-h-[36px] rounded-full border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ClosetItemForm({ open, item, onClose, onSave, onDelete }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("clothing");
  const [color, setColor] = useState("");
  const [warmth, setWarmth] = useState("");
  const [formality, setFormality] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(item?.name || "");
    setCategory(item?.category || "clothing");
    setColor(item?.color || "");
    setWarmth(item?.warmth || "");
    setFormality(normalizeFormality(item?.formality));
    setPhoto(item?.photo_uri || null);
  }, [open, item]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      setPhoto(file_uri);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        category,
        color: color.trim(),
        warmth: warmth || undefined,
        formality: formality || undefined,
        photo_uri: photo || undefined,
        favorite: !!item?.favorite
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{item ? "Edit closet item" : "Add to your closet"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-start gap-3">
            <label className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-input bg-muted text-muted-foreground">
              {photo ? (
                <ClosetPhoto fileUri={photo} alt="Item photo" className="h-20 w-20" />
              ) : uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
              <input type="file" accept="image/*" onChange={upload} className="sr-only" aria-label="Add a photo" />
            </label>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-xs font-semibold">Photo (optional)</p>
              <p className="text-xs text-muted-foreground">
                A picture helps you spot the piece. Stored privately — only you can see it.
              </p>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <X className="h-3 w-3" /> Remove photo
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="closet-name">Name</Label>
            <Input
              id="closet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Navy blazer, midwash skinny jeans…"
              autoFocus
            />
          </div>

          <OptionRow
            label="Category"
            value={category}
            allowClear={false}
            onChange={setCategory}
            options={CLOSET_CATEGORIES.map((cat) => ({ value: cat, label: CATEGORY_META[cat].label }))}
          />

          <ColorPicker value={color} onChange={setColor} />

          <OptionRow label="Warmth" value={warmth} onChange={setWarmth} options={WARMTH_OPTIONS} />
          <OptionRow label="Formality" value={formality} onChange={setFormality} options={FORMALITY_OPTIONS} />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button type="submit" className="rounded-full px-5 font-bold" disabled={!name.trim() || saving}>
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
              {item ? "Save changes" : "Add item"}
            </Button>
            <Button type="button" variant="ghost" className="rounded-full" onClick={onClose}>
              Cancel
            </Button>
            {item && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="ml-auto text-xs font-semibold text-destructive hover:underline"
              >
                Remove from closet
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}