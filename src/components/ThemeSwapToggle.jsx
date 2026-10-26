import React, { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

const KEY = "packsmart-theme";

export default function ThemeSwapToggle() {
  const [retro, setRetro] = useState(() => {
    try {
      return localStorage.getItem(KEY) === "retro";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("retro-theme", retro);
  }, [retro]);

  const flip = () => {
    const next = !retro;
    setRetro(next);
    try {
      localStorage.setItem(KEY, next ? "retro" : "passport");
    } catch {
      /* storage unavailable — theme just won't persist */
    }
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={retro}
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom)+0.75rem)] right-4 z-[100] inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#3E2F26] bg-[#F3EAD3] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#3E2F26] shadow-md transition-all hover:bg-[#E8B67C]"
      style={{ fontFamily: "'Oswald', 'Arial Narrow', sans-serif" }}
    >
      <ArrowLeftRight className="h-3.5 w-3.5" /> {retro ? "Passport UI" : "Retro UI"}
    </button>
  );
}