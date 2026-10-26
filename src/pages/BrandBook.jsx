import React from "react";
import { Stamp } from "lucide-react";
import "@/components/landing/landing.css";
import "@/components/brandbook/brandbook.css";
import BrandBookNav from "@/components/brandbook/BrandBookNav";
import BrandPalette from "@/components/brandbook/BrandPalette";
import BrandEffects from "@/components/brandbook/BrandEffects";
import Playground from "@/components/brandbook/Playground";
import BrandAccessibility from "@/components/brandbook/BrandAccessibility";

export default function BrandBook() {
  return (
    <div className="landing brandbook min-h-[100dvh]">
      <BrandBookNav />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-12">
        <div className="rise text-center">
          <span className="stamp-badge mx-auto">Design System v1.1</span>
          <h1 className="serif mt-6 text-4xl font-bold md:text-6xl">
            PackSmart <span className="text-navy">Brand Book</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
            The Passport Travel design language — paper, ink, and stamps — documented as living,
            interactive tokens and components.
          </p>
        </div>

        <div className="mt-14 space-y-16">
          <Playground />
          <BrandPalette />
          <BrandEffects />
          <BrandAccessibility />
        </div>
      </main>
      <footer className="bg-navy py-6 text-center text-xs tracking-widest text-white/70">
        © 2026 PackSmart · Passport Travel Design System
        <Stamp className="ml-2 inline h-3.5 w-3.5" />
      </footer>
    </div>
  );
}