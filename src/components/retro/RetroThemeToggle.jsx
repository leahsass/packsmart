import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

export default function RetroThemeToggle({ to, label }) {
  return (
    <Link
      to={to}
      className="fixed bottom-4 right-4 z-[100] inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#3E2F26] bg-[#F3EAD3] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#3E2F26] shadow-md transition-all hover:bg-[#E8B67C]"
      style={{ fontFamily: "'Oswald', 'Arial Narrow', sans-serif" }}
    >
      <ArrowLeftRight className="h-3.5 w-3.5" /> {label}
    </Link>
  );
}