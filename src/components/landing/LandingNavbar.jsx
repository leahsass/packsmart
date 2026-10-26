import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Stamp, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Travelers", href: "#travelers" },
  { label: "Plans", href: "#plans" },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="dashed-b bg-paper sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5 text-base font-bold tracking-[0.2em] text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-white">
            <Stamp className="h-5 w-5" />
          </span>
          PACKSMART
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium tracking-wider md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-all hover:text-coral">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link to="/register" className="btn-ink">Start Packing</Link>
        </div>

        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="dashed-b border-t border-stamp/20 px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium tracking-wider">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="transition-all hover:text-coral">
                {l.label}
              </a>
            ))}
            <Link to="/register" className="btn-ink mt-2 w-full">Start Packing</Link>
          </nav>
        </div>
      )}
    </header>
  );
}