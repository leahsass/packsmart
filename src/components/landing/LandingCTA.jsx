import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LandingCTA() {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-24">
      <div className="dashed-card card-shadow rise relative overflow-hidden rounded-lg bg-paper-white px-8 py-14 text-center">
        <span className="stamp-badge mx-auto">Boarding Soon</span>
        <h2 className="serif mt-6 text-3xl font-bold md:text-5xl">
          The gate is open.
          <br />
          <span className="text-navy">Your bag is waiting.</span>
        </h2>
        <p className="mt-4 text-sm text-ink-muted">Create your first packing list in under a minute.</p>
        <Link to="/register" className="btn-ink mx-auto mt-8">
          Start Packing <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}