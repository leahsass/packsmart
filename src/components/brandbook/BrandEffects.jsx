import React from "react";
import { CloudSun, Dumbbell, Brain } from "lucide-react";

export default function BrandEffects() {
  return (
    <section>
      <h2 className="serif text-2xl font-bold md:text-3xl">Signature Effects</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="soft-border card-shadow rounded-lg bg-paper-white p-6">
          <p className="text-[10px] font-bold tracking-[0.2em] text-stamp">Ink stamp</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="stamp-badge">List Issued</span>
            <span className="stamp-badge" style={{ borderColor: "var(--passport-blue)", color: "var(--passport-blue)", boxShadow: "inset 0 0 0 1px rgba(26,35,126,.25)" }}>
              Verified
            </span>
          </div>
        </div>

        <div className="soft-border card-shadow rounded-lg bg-paper-white p-6">
          <p className="text-[10px] font-bold tracking-[0.2em] text-stamp">Postmark</p>
          <div className="postmark mt-4 flex h-24 w-24 rotate-12 items-center justify-center text-center text-[10px] font-bold tracking-widest">
            <span>Packed<br />OK</span>
          </div>
        </div>

        <div className="soft-border card-shadow rounded-lg bg-paper-white p-6">
          <p className="text-[10px] font-bold tracking-[0.2em] text-stamp">Barcode</p>
          <div className="mt-4 flex items-end gap-3">
            <div className="barcode w-40" />
            <p className="pb-1 text-[10px] tracking-[0.3em] text-ink-muted">PS-2026-TRV</p>
          </div>
        </div>

        <div className="soft-border card-shadow rounded-lg bg-paper-white p-6">
          <p className="text-[10px] font-bold tracking-[0.2em] text-stamp">Dashed official border</p>
          <div className="dashed-card mt-4 rounded-lg p-5">
            <p className="serif text-lg font-semibold">Republic of Packing</p>
            <p className="mt-1 text-xs text-ink-muted">Travel document · N° 4429-OPEN</p>
          </div>
        </div>

        <div className="soft-border card-shadow rounded-lg bg-paper-white p-6 sm:col-span-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-stamp">Paper grain overlay</p>
          <div className="mt-4 rounded-lg p-6" style={{ backgroundImage: "radial-gradient(rgba(45,45,45,0.08) 1px, transparent 1px)", backgroundSize: "3px 3px" }}>
            <p className="serif text-xl font-semibold">Matte paper texture</p>
            <p className="mt-1 text-sm text-ink-muted">A subtle dot-grain layer sits over every page for a porous, printed feel.</p>
          </div>
        </div>

        <div className="soft-border card-shadow rounded-lg bg-paper-white p-6 sm:col-span-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-stamp">Icon style · Lucide, never emoji</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {[CloudSun, Dumbbell, Brain].map((Icon, i) => (
              <span key={i} className={`flex h-11 w-11 items-center justify-center rounded-md text-white ${["bg-coral", "bg-navy", "bg-stamp"][i]}`}>
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}