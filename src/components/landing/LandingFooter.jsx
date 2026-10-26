import React from "react";
import { Link } from "react-router-dom";
import { Stamp, Instagram, Facebook, Twitter } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Plans", href: "#plans" },
      { label: "Sign Up", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
];

export default function LandingFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 text-base font-bold tracking-[0.2em]">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
              <Stamp className="h-5 w-5" />
            </span>
            PACKSMART
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            AI-powered packing lists tailored to your destination, weather, and activities — refined by every trip you take.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-coral">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("/") ? (
                    <Link to={l.href} className="transition-all hover:text-white">{l.label}</Link>
                  ) : (
                    <a href={l.href} className="transition-all hover:text-white">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-5 text-xs tracking-wider text-white/70 md:flex-row">
          <p>© 2026 PackSmart. All rights reserved.</p>
          <p>N° PS-2026 · Issued in New York</p>
          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="transition-all hover:text-coral">
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}