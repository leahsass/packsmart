import React from "react";
import "@/components/landing/landing.css";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import RetroThemeToggle from "@/components/retro/RetroThemeToggle";

export default function Landing() {
  return (
    <div className="landing min-h-[100dvh]">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingPricing />
        <LandingCTA />
      </main>
      <LandingFooter />
      <RetroThemeToggle to="/retro-landing" label="Retro preview" />
    </div>
  );
}