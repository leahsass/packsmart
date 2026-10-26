import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

const COLORS = [
  { name: "Paper Cream", hex: "#F5F2E9", usage: "Backgrounds, page canvas", text: "#2D2D2D" },
  { name: "Ink Charcoal", hex: "#2D2D2D", usage: "Body text, primary type", text: "#FFFFFF" },
  { name: "Terracotta", hex: "#C1451F", usage: "Primary actions, highlights (5.1:1 with white)", text: "#FFFFFF" },
  { name: "Passport Blue", hex: "#1A237E", usage: "Surfaces, official accents", text: "#FFFFFF" },
  { name: "Passport Teal", hex: "#1E5A54", usage: "Pills, badges, info highlights", text: "#FFFFFF" },
  { name: "Stamp Red", hex: "#B71C1C", usage: "Stamps, errors, borders", text: "#FFFFFF" },
  { name: "Paper White", hex: "#FFFFFF", usage: "Cards, stickers, forms", text: "#2D2D2D" },
];

const TYPE = [
  { label: "Display / H1", font: "Lora Semibold", sample: "Your Next Trip, Officially Packed", cls: "font-heading text-4xl font-bold" },
  { label: "Heading / H2", font: "Lora Medium", sample: "Built like a travel document", cls: "font-heading text-2xl font-semibold" },
  { label: "Body", font: "Courier Prime Regular", sample: "PackSmart drafts a personalized, weather-aware packing list for your destination, dates, and activities.", cls: "text-base leading-relaxed" },
  { label: "Label / Stamp", font: "Courier Prime Bold", sample: "List issued · Verified traveler", cls: "text-xs font-bold tracking-[0.22em]" },
];

export default function BrandPalette() {
  const [copied, setCopied] = useState(null);

  const copy = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="serif text-2xl font-bold md:text-3xl">Color Palette</h2>
          <p className="hidden text-xs text-ink-muted sm:block">Click a swatch to copy its hex</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => copy(c.hex)}
              className="swatch rounded-lg p-4 text-left"
              style={{ background: c.hex, color: c.text }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{c.name}</span>
                {copied === c.hex ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 opacity-50" />}
              </div>
              <p className="mt-1 text-xs font-bold tracking-widest">{c.hex}</p>
              <p className="mt-2 text-xs opacity-80">{c.usage}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="serif text-2xl font-bold md:text-3xl">Typography</h2>
        <div className="mt-6 space-y-5">
          {TYPE.map((t) => (
            <div key={t.label} className="soft-border card-shadow rounded-lg bg-paper-white p-5">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-stamp">
                <span>{t.label}</span>
                <span className="text-ink-muted">{t.font}</span>
              </div>
              <p className={`mt-3 text-ink ${t.cls}`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}