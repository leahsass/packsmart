import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Day Tripper",
    price: "$0",
    period: "forever",
    blurb: "For quick getaways.",
    features: ["3 packing lists", "Weather-aware items", "Standard categories"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "World Traveler",
    price: "$6",
    period: "per month",
    blurb: "For the always-packed.",
    features: ["Unlimited lists", "Unpack insights & learning", "Sport-specific gear modes", "Carry-on vs. checked tagging"],
    cta: "Go Traveler",
    featured: true,
  },
  {
    name: "Expedition Crew",
    price: "$12",
    period: "per month",
    blurb: "For families & teams.",
    features: ["Everything in World Traveler", "Shared lists for up to 5", "Bike case & gear manifests", "Priority list generation"],
    cta: "Assemble Crew",
    featured: false,
  },
];

export default function LandingPricing() {
  return (
    <section id="plans" className="mx-auto max-w-6xl px-5 py-20">
      <div className="rise text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-stamp">Article III · Tariffs</p>
        <h2 className="serif mt-3 text-3xl font-bold md:text-4xl">Choose your travel class</h2>
      </div>
      <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <div
            key={t.name}
            className={`card-shadow rise relative rounded-lg p-7 ${
              t.featured ? "bg-navy text-paper md:-mt-4 md:scale-105" : "soft-border bg-paper-white"
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {t.featured && (
              <span className="stamp-badge absolute -top-4 right-6 bg-paper-white" style={{ borderColor: "var(--coral)", color: "var(--stamp-red)" }}>
                Most Packed
              </span>
            )}
            <h3 className={`serif text-xl font-semibold ${t.featured ? "text-paper" : ""}`}>{t.name}</h3>
            <p className={`mt-1 text-xs tracking-wider ${t.featured ? "text-white/70" : "text-ink-muted"}`}>{t.blurb}</p>
            <p className="mt-5">
              <span className="serif text-4xl font-bold">{t.price}</span>
              <span className={`ml-2 text-xs tracking-wider ${t.featured ? "text-white/70" : "text-ink-muted"}`}>{t.period}</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.featured ? "text-coral" : "text-stamp"}`} />
                  <span className={t.featured ? "text-white/90" : ""}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className={`mt-8 w-full ${t.featured ? "btn-ink" : "btn-outline"}`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}