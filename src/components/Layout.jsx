import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppNavbar from "@/components/AppNavbar";
import BottomTabBar from "@/components/BottomTabBar";
import ThemeSwapToggle from "@/components/ThemeSwapToggle";
import OfflineBanner from "@/components/OfflineBanner";

export default function Layout() {
  const location = useLocation();
  // Track the last route visited on each tab so switching back restores it.
  const [tabPaths, setTabPaths] = useState({});

  useEffect(() => {
    const tab = location.pathname.startsWith("/settings")
      ? "/settings"
      : location.pathname.startsWith("/closet")
        ? "/closet"
        : "/";
    setTabPaths((prev) =>
      prev[tab] === location.pathname ? prev : { ...prev, [tab]: location.pathname }
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AppNavbar />
      <OfflineBanner />
      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-8">
        <Outlet />
      </main>
      <BottomTabBar tabPaths={tabPaths} />
      <ThemeSwapToggle />
    </div>
  );
}