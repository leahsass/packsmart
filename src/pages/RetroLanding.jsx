import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plane, Menu, X, ArrowRight, CloudSun, ListChecks, Repeat,
  MapPin, Instagram, Twitter, Facebook,
} from "lucide-react";
import "@/components/retro/retro.css";
import RetroThemeToggle from "@/components/retro/RetroThemeToggle";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Travelers", href: "#travelers" },
];

const FEATURES = [
  {
    icon: CloudSun,
    color: "#A83E36",
    title: "Weather-aware lists",
    body: "Your list is drafted from live forecasts at your destination — no guesswork about layers, rain shells, or sunscreen.",
  },
  {
    icon: ListChecks,
    color: "#5B8A72",
    title: "Built around your trip",
    body: "Beach week or bike race? Pick your dates, activities, and bag type, and the list shapes itself to the plan.",
  },
  {
    icon: Repeat,
    color: "#D4A574",
    title: "Smarter every trip",
    body: "Unpack, tell us what you never used, and the next list quietly drops it. Your packing improves with every journey.",
  },
];

const STEPS = [
  { n: "01", title: "Name the destination", body: "City, dates, and how you're getting there. That's all we need." },
  { n: "02", title: "Get your list", body: "A weather-aware packing list in seconds, ready to check off item by item." },
  { n: "03", title: "Unpack and improve", body: "Rate what you actually used. Every trip makes the next list sharper." },
];

function RetroNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#3E2F26] bg-[#F3EAD3]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex cursor-pointer items-center gap-2.5 transition-all hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#A83E36] text-[#F3EAD3]">
            <Plane className="h-5 w-5" />
          </span>
          <span className="retro-display text-lg text-[#3E2F26]">PackSmart</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" style={{ fontFamily: "'Oswald', sans-serif" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="cursor-pointer uppercase tracking-widest transition-all hover:text-[#A83E36]">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link to="/register" className="retro-btn retro-btn-primary">Start packing</Link>
        </div>

        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#3E2F26]/20 px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="cursor-pointer uppercase tracking-widest transition-all hover:text-[#A83E36]">
                {l.label}
              </a>
            ))}
            <Link to="/register" className="retro-btn retro-btn-primary mt-2 w-full">Start packing</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function PosterArt() {
  return (
    <div className="retro-poster-frame">
      <svg viewBox="0 0 600 440" className="block h-auto w-full" role="img" aria-label="Retro travel poster landscape with sun, mountains, and dunes">
        <rect width="600" height="440" fill="#E8B67C" />
        <circle cx="440" cy="120" r="72" fill="#A83E36" />
        <g fill="#F3EAD3">
          <rect x="70" y="90" width="120" height="24" rx="12" />
          <rect x="110" y="120" width="90" height="20" rx="10" />
        </g>
        <path d="M0 260 L140 140 L290 260 Z" fill="#5B8A72" />
        <path d="M170 260 L350 95 L540 260 Z" fill="#3E2F26" />
        <rect y="260" width="600" height="180" fill="#D4A574" />
        <path d="M0 300 Q300 265 600 300 L600 330 Q300 295 0 330 Z" fill="#C99A5F" />
        <rect y="392" width="600" height="48" fill="#3E2F26" />
      </svg>
      <div className="border-t-6 border-[#3E2F26] bg-[#A83E36] px-4 py-3 text-center" style={{ borderTopWidth: 6 }}>
        <p className="retro-display text-sm text-[#F3EAD3]">Pack light · Travel far</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <p className="retro-kicker">The travel bureau of packing · Est. 2026</p>
          <h1 className="retro-display mt-4 text-4xl leading-[1.05] text-[#3E2F26] md:text-6xl">
            Pack once.<br />See the world.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#3E2F26]/90 md:text-lg">
            PackSmart drafts your packing list from real forecasts, your activities, and what
            you actually used last time — so every bag is packed right the first time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="retro-btn retro-btn-primary">
              Start packing free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="retro-btn retro-btn-ghost">See how it works</a>
          </div>
        </div>
        <PosterArt />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-8">
      <div className="text-center">
        <p className="retro-kicker">Why travelers switch</p>
        <h2 className="retro-display mt-3 text-3xl text-[#3E2F26] md:text-4xl">Everything a good list needs</h2>
      </div>
      <div className="mt-12 space-y-12">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`flex flex-col items-center gap-8 md:gap-14 ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}>
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-4 border-[#3E2F26]" style={{ background: f.color }}>
              <f.icon className="h-16 w-16 text-[#F3EAD3]" strokeWidth={1.75} />
            </div>
            <div className="max-w-md text-center md:text-left">
              <h3 className="retro-display text-2xl text-[#3E2F26]">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-[#3E2F26]/90">{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-8">
      <div className="text-center">
        <p className="retro-kicker">Three steps, no stress</p>
        <h2 className="retro-display mt-3 text-3xl text-[#3E2F26] md:text-4xl">From ticket to packed bag</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="retro-card p-6">
            <span className="retro-display inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8B67C] text-lg text-[#3E2F26]">
              {s.n}
            </span>
            <h3 className="retro-display mt-4 text-xl text-[#3E2F26]">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3E2F26]/90">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section id="travelers" className="mx-auto max-w-4xl px-5 py-8">
      <div className="retro-card p-8 text-center md:p-12">
        <span className="retro-stamp">Verified traveler</span>
        <blockquote className="mt-6 text-xl italic leading-relaxed text-[#3E2F26] md:text-2xl">
          “It's like a trusted travel agent lives in my pocket — my list knew about the rain
          in Lisbon before I did.”
        </blockquote>
        <p className="retro-kicker mt-6 flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4" /> Maya R. · 14 countries packed
        </p>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="rounded-lg bg-[#3E2F26] px-6 py-14 text-center md:px-12">
        <h2 className="retro-display text-3xl text-[#F3EAD3] md:text-5xl">Your next trip deserves a proper list</h2>
        <p className="mx-auto mt-4 max-w-lg text-[#F3EAD3]/85">
          Join travelers who pack once, forget nothing, and get smarter with every journey.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="retro-btn retro-btn-primary">
            Start packing free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/" className="retro-btn border-[#F3EAD3] text-[#F3EAD3] hover:bg-[#F3EAD3]/10" style={{ border: "1.5px solid #F3EAD3" }}>
            Open the app
          </Link>
        </div>
      </div>
    </section>
  );
}

function RetroFooter() {
  return (
    <footer className="border-t-4 border-[#A83E36] bg-[#3E2F26] pb-24 pt-10 text-[#F3EAD3]">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          <Link to="/" className="flex cursor-pointer items-center gap-2.5 transition-all hover:opacity-80">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#A83E36] text-[#F3EAD3]">
              <Plane className="h-5 w-5" />
            </span>
            <span className="retro-display text-lg">PackSmart</span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="cursor-pointer uppercase tracking-widest transition-all hover:text-[#E8B67C]">
                {l.label}
              </a>
            ))}
            <Link to="/brand-book" className="cursor-pointer uppercase tracking-widest transition-all hover:text-[#E8B67C]">
              Brand book
            </Link>
          </nav>

          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="cursor-pointer rounded-md border border-[#F3EAD3]/40 p-2 transition-all hover:bg-[#F3EAD3]/10">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="cursor-pointer rounded-md border border-[#F3EAD3]/40 p-2 transition-all hover:bg-[#F3EAD3]/10">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="cursor-pointer rounded-md border border-[#F3EAD3]/40 p-2 transition-all hover:bg-[#F3EAD3]/10">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="mt-10 text-center text-xs tracking-widest text-[#F3EAD3]/60">
          © 2026 PackSmart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function RetroLanding() {
  return (
    <div className="retro">
      <RetroNav />
      <main>
        <Hero />
        <div className="retro-band" aria-hidden="true" />
        <Features />
        <HowItWorks />
        <Testimonial />
        <CtaBand />
      </main>
      <RetroFooter />
      <RetroThemeToggle to="/landing" label="Passport preview" />
    </div>
  );
}