import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home as HomeIcon, Settings as SettingsIcon, Shirt } from "lucide-react";

const TABS = [
  { to: "/", label: "Trips", icon: HomeIcon },
  { to: "/closet", label: "Closet", icon: Shirt },
  { to: "/settings", label: "Settings", icon: SettingsIcon }
];

export const tabForPath = (pathname) => {
  if (pathname.startsWith("/settings")) return "/settings";
  if (pathname.startsWith("/closet")) return "/closet";
  return "/";
};

const ownsPath = (tab, pathname) => tabForPath(pathname) === tab.to;

export default function BottomTabBar({ tabPaths = {} }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleTab = (tab) => {
    if (ownsPath(tab, pathname)) {
      // Re-selecting the active tab resets it to its root route.
      if (pathname !== tab.to) navigate(tab.to);
      return;
    }
    // Returning to an inactive tab restores its previous nested route.
    navigate(tabPaths[tab.to] || tab.to);
  };

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex h-16 w-full max-w-3xl items-stretch justify-around">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = ownsPath({ to }, pathname);
          return (
            <button
              key={to}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => handleTab({ to })}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-t-xl text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}