import React, { useState } from "react";
import { Plane } from "lucide-react";

const ELEMENTS = [
  { id: "button", label: "Button" },
  { id: "input", label: "Input" },
  { id: "toggle", label: "Segmented" },
  { id: "stamp", label: "Stamp" },
  { id: "card", label: "Card" },
];

const VARIANTS = {
  button: [
    { id: "primary", label: "Primary" },
    { id: "outline", label: "Outline" },
    { id: "navy", label: "Navy" },
    { id: "ghost", label: "Ghost" },
  ],
  input: [
    { id: "standard", label: "Standard" },
    { id: "dashed", label: "Dashed" },
  ],
  toggle: [
    { id: "navy", label: "Navy" },
    { id: "coral", label: "Terracotta" },
  ],
  stamp: [
    { id: "red", label: "Stamp Red" },
    { id: "navy", label: "Passport Blue" },
    { id: "coral", label: "Terracotta" },
  ],
  card: [
    { id: "dashed", label: "Dashed" },
    { id: "solid", label: "Solid" },
  ],
};

const STAMP_COLORS = {
  red: { borderColor: "var(--stamp-red)", color: "var(--stamp-red)", boxShadow: "inset 0 0 0 1px rgba(183,28,28,.25)" },
  navy: { borderColor: "var(--passport-blue)", color: "var(--passport-blue)", boxShadow: "inset 0 0 0 1px rgba(26,35,126,.25)" },
  coral: { borderColor: "var(--coral)", color: "var(--coral)", boxShadow: "inset 0 0 0 1px rgba(193,69,31,.25)" },
};

const STAMP_SCALE = { sm: 0.85, md: 1, lg: 1.15 };

function OptionRow({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-16 text-[10px] font-bold tracking-[0.2em] text-ink-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} className={`chip ${value === o ? "on" : ""}`} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Playground() {
  const [element, setElement] = useState("button");
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("md");
  const [state, setState] = useState("default");
  const [segValue, setSegValue] = useState("Carry-on");

  const hasVariants = VARIANTS[element];
  const variantOptions = (hasVariants || []).map((v) => v.label);
  const showState = ["button", "input", "toggle"].includes(element);
  const showSize = ["button", "input", "stamp"].includes(element);

  const pickElement = (id) => {
    setElement(id);
    setVariant(VARIANTS[id][0].label);
    setState("default");
  };

  const hoverClass = state === "hover" ? "force-hover" : "";

  const renderPreview = () => {
    switch (element) {
      case "button": {
        const cls = VARIANTS.button.find((v) => v.label === variant)?.id || "primary";
        return (
          <button className={`pb-btn v-${cls} ${size} ${hoverClass}`} disabled={state === "disabled"}>
            <Plane className="h-4 w-4" /> Get Packing List
          </button>
        );
      }
      case "input": {
        const cls = VARIANTS.input.find((v) => v.label === variant)?.id || "standard";
        return (
          <div className="w-full max-w-sm">
            <label className="text-xs font-bold tracking-widest text-ink-muted">Destination</label>
            <input
              className={`pb-input v-${cls} ${size} mt-2 ${state === "hover" ? "force-hover" : ""}`}
              placeholder="Rio de Janeiro, Brazil…"
              disabled={state === "disabled"}
            />
          </div>
        );
      }
      case "toggle": {
        const cls = VARIANTS.toggle.find((v) => v.label === variant)?.id || "navy";
        return (
          <div className={`pb-seg v-${cls} pb-seg-${size}`}>
            {["Carry-on", "Checked"].map((opt) => (
              <button key={opt} className={segValue === opt ? "on" : ""} onClick={() => setSegValue(opt)}>
                {opt}
              </button>
            ))}
          </div>
        );
      }
      case "stamp":
        return (
          <span
            className="stamp-badge"
            style={{ ...STAMP_COLORS[variant === "Stamp Red" ? "red" : variant === "Passport Blue" ? "navy" : "coral"], transform: `rotate(-2deg) scale(${STAMP_SCALE[size]})` }}
          >
            List Issued
          </span>
        );
      case "card":
        return (
          <div className={`pb-card v-${VARIANTS.card.find((v) => v.label === variant)?.id} w-full max-w-sm p-6`}>
            <p className="text-[10px] font-bold tracking-[0.2em] text-stamp">Travel document</p>
            <p className="serif mt-2 text-xl font-semibold">Trip to Paris</p>
            <p className="mt-1 text-xs text-ink-muted">06/22/2026 – 06/29/2026 · Carry-on</p>
            <div className="mt-4 flex items-end justify-between">
              <div className="barcode w-28" />
              <span className="stamp-badge !text-[0.6rem] !px-2 !py-1">Packed</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section>
      <h2 className="serif text-2xl font-bold md:text-3xl">Interactive Playground</h2>
      <p className="mt-2 text-sm text-ink-muted">Pick an element, then dial in its variant, size, and state.</p>

      <div className="mt-6 space-y-4 rounded-3xl border border-stamp border-dashed bg-paper-white p-5">
        <OptionRow label="Element" options={ELEMENTS.map((e) => e.label)} value={ELEMENTS.find((e) => e.id === element)?.label || ""} onChange={(label) => pickElement(ELEMENTS.find((e) => e.label === label).id)} />
        {variantOptions.length > 0 && <OptionRow label="Variant" options={variantOptions} value={variant} onChange={setVariant} />}
        {showSize && <OptionRow label="Size" options={["sm", "md", "lg"]} value={size} onChange={setSize} />}
        {showState && <OptionRow label="State" options={["default", "hover", "disabled"]} value={state} onChange={setState} />}
      </div>

      <div className="playground-stage soft-border mt-6 flex items-center justify-center rounded-3xl p-8">
        {renderPreview()}
      </div>
    </section>
  );
}