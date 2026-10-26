import React from "react";
import { Link } from "react-router-dom";
import { Stamp, ArrowLeft } from "lucide-react";

export default function BrandBookNav() {
  return (
    <header className="dashed-b bg-paper sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-2.5 text-base font-bold tracking-[0.2em] text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-white">
            <Stamp className="h-5 w-5" />
          </span>
          Brand book
        </div>
        <Link to="/landing" className="btn-outline !px-4 !py-2 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" /> PackSmart
        </Link>
      </div>
    </header>
  );
}