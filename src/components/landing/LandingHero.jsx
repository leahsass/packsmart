import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const VISAS = [
  { city: "Rio de Janeiro", date: "03/15/2026", tone: "tone-red", tilt: -3 },
  { city: "Paris", date: "06/22/2026", tone: "tone-navy", tilt: 2 },
  { city: "Tokyo", date: "09/08/2026", tone: "tone-coral", tilt: -2 },
  { city: "New York", date: "12/11/2026", tone: "tone-ink", tilt: 3 },
];

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 md:grid-cols-2 md:pt-20">
        <div className="rise">
          <span className="stamp-badge">List Issued</span>
          <h1 className="serif mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Your Next Trip, <span className="text-navy">Officially Packed</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
            PackSmart drafts a personalized, weather-aware packing list for your destination, dates, and
            activities — then learns from every unpack what you actually use.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-ink">
              Get Your Packing List <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-outline">Sign In</Link>
          </div>
          <div className="mt-10 flex items-end gap-4">
            <div className="barcode w-40" />
            <p className="pb-1 text-[10px] tracking-[0.3em] text-ink-muted">PS-2026-TRV</p>
          </div>
        </div>

        <div className="rise" style={{ animationDelay: "140ms" }}>
          <div className="booklet card-shadow relative mx-auto max-w-md rotate-1">
            <div className="booklet-frame" />
            <div className="border-navy border-b-2 px-5 py-3 text-center text-[11px] font-bold tracking-[0.28em] text-navy">
              REPUBLIC OF PACKING · TRAVEL DOCUMENT
            </div>
            <div className="relative grid grid-cols-2 gap-4 p-5">
              {VISAS.map((v) => (
                <div
                  key={v.city}
                  className={`visa ${v.tone} px-3 py-4 text-center`}
                  style={{ transform: `rotate(${v.tilt}deg)` }}
                >
                  <p className="serif text-sm font-semibold">{v.city}</p>
                  <p className="mt-1 text-[10px] tracking-widest opacity-75">{v.date}</p>
                </div>
              ))}
              <div className="postmark absolute -right-4 -top-7 flex h-24 w-24 rotate-12 items-center justify-center text-center text-[10px] font-bold tracking-widest">
                <span>PACKED<br />OK</span>
              </div>
            </div>
            <div className="flex items-end justify-between px-5 pb-5">
              <div className="barcode w-32" />
              <p className="text-[10px] tracking-[0.3em] text-ink-muted">N° 4429-OPEN</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}