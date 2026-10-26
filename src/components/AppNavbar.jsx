import React from "react";
import { NavLink } from "react-router-dom";
import { Luggage } from "lucide-react";

export default function AppNavbar() {
  return (
    <header className="safe-top sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center px-4">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Luggage className="h-5 w-5" />
          </span>
          <span className="font-heading text-lg font-extrabold tracking-tight">Packlight</span>
        </NavLink>
      </div>
    </header>
  );
}