import React, { useEffect, useState } from "react";
import { LogOut, Sparkles, Thermometer, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import PullToRefresh from "@/components/PullToRefresh";
import PackingDashboard from "@/components/settings/PackingDashboard";

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [homeLabel, setHomeLabel] = useState("");
  const [homeCountry, setHomeCountry] = useState("");
  const [units, setUnits] = useState("c");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    setHomeLabel(user?.home_location || user?.home_country || "");
    setHomeCountry(user?.home_country || "");
    setUnits(user?.weather_units === "f" ? "f" : "c");
  }, [user]);

  const [dashboardKey, setDashboardKey] = useState(0);

  const loadInsights = () => {
    base44.entities.LearnedPreference.list("-created_date", 30).then(setInsights).catch(() => setInsights([]));
    setDashboardKey((k) => k + 1);
  };

  useEffect(() => {
    base44.entities.LearnedPreference.list("-created_date", 30).then(setInsights).catch(() => setInsights([]));
  }, []);

  const changeUnits = async (unit) => {
    const previous = units;
    setUnits(unit);
    try {
      await base44.auth.updateMe({ weather_units: unit });
    } catch {
      setUnits(previous);
      toast({ variant: "destructive", title: "Couldn't save — try again." });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const label = homeLabel.trim();
    if (!label) return;
    setSaving(true);
    try {
      const country = homeCountry.trim() || label.split(",").pop().trim();
      await base44.auth.updateMe({ home_location: label, home_country: country });
      toast({ title: "Home saved" });
    } catch {
      toast({ variant: "destructive", title: "Couldn't save — try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PullToRefresh onRefresh={loadInsights}>
      <div className="space-y-8">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight">Settings</h1>

      <form onSubmit={save} className="rounded-3xl border border-border bg-card p-5">
        <div className="max-w-lg space-y-2.5">
          <LocationAutocomplete
            label="Home"
            placeholder="Start typing a city or place…"
            value={homeLabel}
            onSelect={({ label, country }) => {
              setHomeLabel(label);
              setHomeCountry(country || "");
            }}
            onChange={setHomeLabel}
          />
          <p className="text-xs leading-snug text-muted-foreground">
            I use your home to know when a trip is international (passport!), which power adapter you&apos;ll need,
            and the time difference at your destination.
          </p>
          <Button type="submit" disabled={saving || !homeLabel.trim()} className="rounded-full px-5 font-bold">
            Save
          </Button>
        </div>
      </form>

      <section className="rounded-3xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold text-muted-foreground">
          <Thermometer className="h-4 w-4" /> Weather units
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">How I show temperatures across your trips.</p>
        <div className="mt-3 inline-flex rounded-full border border-border bg-muted p-1">
          {[
            { value: "c", label: "°C Celsius" },
            { value: "f", label: "°F Fahrenheit" }
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => changeUnits(opt.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                units === opt.value ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold text-muted-foreground">
          <Sparkles className="h-4 w-4" /> What I&apos;ve learned about your packing
        </h2>
        {insights === null ? (
          <div className="mt-4 h-6 w-40 animate-pulse rounded-full bg-muted" />
        ) : insights.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing yet — unpack a trip and I&apos;ll start picking up your habits.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {insights.map((p) => (
              <li key={p.id} className="flex items-start gap-2 rounded-2xl bg-muted px-3.5 py-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{p.insight}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PackingDashboard refreshKey={dashboardKey} />

      <div className="flex flex-col items-start gap-1">
        <Button variant="ghost" className="rounded-full font-semibold text-muted-foreground" onClick={() => logout()}>
          <LogOut className="mr-1.5 h-4 w-4" /> Sign out
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="rounded-full font-semibold text-destructive">
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes your account and every trip, packing list, and packing insight you&apos;ve
                saved. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleting}
                onClick={async (e) => {
                  e.preventDefault();
                  setDeleting(true);
                  try {
                    await base44.functions.invoke("deleteAccount", {});
                    logout();
                  } catch {
                    toast({ variant: "destructive", title: "Couldn't delete your account — try again." });
                    setDeleting(false);
                  }
                }}
              >
                {deleting ? "Deleting…" : "Yes, delete everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      </div>
    </PullToRefresh>
  );
}