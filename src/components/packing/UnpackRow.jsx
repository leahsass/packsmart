import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Clothing gets the full frequency scale. Shoes are never "reworn", so they
// only need a wore-them / didn't-use choice.
const CLOTHING_CHOICES = [
  { id: "unused", label: "Didn't use" },
  { id: "once", label: "Used once" },
  { id: "often", label: "Used often" }
];

const SHOE_CHOICES = [
  { id: "unused", label: "Didn't use" },
  { id: "once", label: "Wore them" }
];

export default function UnpackRow({ item, value, onChange }) {
  const choices = item.category === "shoes" ? SHOE_CHOICES : CLOTHING_CHOICES;
  const update = (patch) => onChange({ unused: 0, repeated: 0, reason: "", ...value, ...patch });

  const choose = (id) => {
    if (id === "unused") return update({ choice: id, unused: item.quantity, repeated: 0 });
    if (id === "often") return update({ choice: id, unused: 0, repeated: 2 });
    return update({ choice: id, unused: 0, repeated: 0 });
  };

  return (
    <div className="flex flex-col gap-[14px] rounded-[20px] border border-[#30435d] bg-[#17263D] p-[18px] text-[#F7F0E4] shadow-[0_12px_28px_rgba(23,38,61,0.18)] animate-[arrive_0.38s_cubic-bezier(0.2,0.8,0.2,1)_both]">
      <div>
        <p className="font-heading text-lg font-semibold leading-tight">{item.name}</p>
        <p className="mt-1 font-mono text-[12px] leading-[1.4] tracking-[0.02em] text-[#aeb9c8]">
          Packed {item.quantity}
        </p>
      </div>

      <div className={cn("grid gap-[9px]", choices.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {choices.map(({ id, label }) => (
          <label
            key={id}
            className={cn(
              "relative flex min-h-[56px] cursor-pointer items-center justify-center rounded-xl border bg-[#1e304a] border-[#526176] p-[10px] text-center font-mono text-xs font-semibold leading-[1.3] text-[#d9e0e8]",
              "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out",
              "hover:border-[#79C6B4] active:bg-[#30435d]",
              "has-[:checked]:border-[#E7A84B] has-[:checked]:bg-[#263951] has-[:checked]:text-[#F7F0E4] has-[:checked]:shadow-[inset_0_0_0_2px_#E7A84B]",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-[#79C6B4]"
            )}
          >
            <input
              type="radio"
              name={`unpack-${item.id}`}
              value={id}
              checked={value.choice === id}
              onChange={() => choose(id)}
              className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
            />
            {value.choice === id && (
              <span aria-hidden="true" className="mr-1.5 font-sans text-[13px] font-bold leading-none">
                ✓
              </span>
            )}
            {label}
          </label>
        ))}
      </div>

      {value.choice && (
        <Input
          value={value.reason}
          onChange={(e) => update({ reason: e.target.value })}
          placeholder="Tell me more (optional)"
          className="h-11 rounded-xl border-[#526176] bg-[#1e304a] font-mono text-sm text-[#F7F0E4] placeholder:text-[#aeb9c8] focus-visible:ring-[#79C6B4]"
        />
      )}
    </div>
  );
}