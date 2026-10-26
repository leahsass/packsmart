import React from "react";

const TILES = [
  { key: "packed", label: "Packed" },
  { key: "unused", label: "Never worn" },
  { key: "rewore", label: "Reworn" },
  { key: "bought", label: "Bought" }
];

export default function RecapStats({ packed, unused, rewore, bought }) {
  const values = { packed, unused, rewore, bought };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {TILES.map((tile) => (
        <div key={tile.key} className="rounded-2xl border border-border bg-card px-3 py-3">
          <p className="font-heading text-2xl font-extrabold leading-none">{values[tile.key]}</p>
          <p className="mt-1 text-[11px] font-bold text-muted-foreground">{tile.label}</p>
        </div>
      ))}
    </div>
  );
}