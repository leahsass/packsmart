import React from "react";
import { CloudSun, Dumbbell, Brain } from "lucide-react";

const FEATURES = [
  {
    icon: CloudSun,
    tone: "bg-coral",
    title: "Weather-Aware Lists",
    body: "Live forecasts for your destination shape every item — layers for a cold front, reef-safe sunscreen for the tropics.",
  },
  {
    icon: Dumbbell,
    tone: "bg-navy",
    title: "Sport-Specific Gear",
    body: "Race kits, bike parts, jerseys, and nutrition planned as carefully as your socks — with event details baked in.",
  },
  {
    icon: Brain,
    tone: "bg-stamp",
    title: "Learns From Every Unpack",
    body: "Tell it what you never wore and what you had to buy — your next list comes back smarter.",
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20">
      <div className="rise">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-stamp">Article I · What&apos;s Inside</p>
        <h2 className="serif mt-3 text-3xl font-bold md:text-4xl">Built like a travel document</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="card-shadow soft-border rise rounded-lg bg-paper-white p-7"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-md text-white ${f.tone}`}>
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="serif mt-5 text-xl font-semibold">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}