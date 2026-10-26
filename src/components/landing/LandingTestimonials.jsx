import React from "react";

const QUOTES = [
  {
    quote: "I packed for a week in Oslo and never touched the 'just in case' pile. Everything earned its spot.",
    name: "Maya R.",
    role: "Backpacker · 23 countries",
  },
  {
    quote: "The sports mode is unreal. It remembered my race kit, gels, and spare tube before I did.",
    name: "Dan K.",
    role: "Triathlete",
  },
  {
    quote: "After two trips of feedback, it stopped suggesting the hiking boots I never once wore.",
    name: "Priya S.",
    role: "Digital nomad",
  },
];

export default function LandingTestimonials() {
  return (
    <section id="travelers" className="bg-paper-white dashed-b border-t border-stamp/15 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rise">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-stamp">Article II · Testimony</p>
          <h2 className="serif mt-3 text-3xl font-bold md:text-4xl">Stamped by travelers</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <figure
              key={q.name}
              className="card-shadow soft-border rise rounded-lg bg-paper p-7"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <blockquote className="text-sm leading-relaxed">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 border-t border-dashed border-stamp/30 pt-4">
                <p className="serif text-base font-semibold">{q.name}</p>
                <p className="mt-0.5 text-xs tracking-wider text-ink-muted">{q.role}</p>
                <span className="stamp-badge mt-4 text-[0.6rem]">Verified Traveler</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}