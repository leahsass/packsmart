import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import TripCard from "@/components/TripCard";
import PullToRefresh from "@/components/PullToRefresh";
import ActiveTripPanel from "@/components/ActiveTripPanel";
import { isTripEnded, getTripPhase } from "@/lib/categories";
import { cacheTrips, readCachedTrips } from "@/lib/offline";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState(null);

  const loadTrips = () =>
    base44.entities.Trip.list("-start_date", 100)
      .then((loaded) => {
        cacheTrips(loaded);
        setTrips(loaded);
      })
      .catch(() => setTrips(readCachedTrips() || []));

  useEffect(() => {
    loadTrips();
  }, []);

  if (trips === null) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const activeTrips = trips
    .filter((t) => getTripPhase(t) === "active")
    .sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
  const activeTrip = activeTrips[0];
  const upcoming = trips.filter((t) => !isTripEnded(t));
  const past = trips
    .filter((t) => isTripEnded(t))
    .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
  const needUnpack = past.filter((t) => !t.unpacked);
  const firstName = user?.full_name?.split(" ")[0];

  return (
    <PullToRefresh onRefresh={loadTrips}>
      <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            {firstName ? `Hey ${firstName}.` : "Hey traveler."}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Pack light, look good, stress less.</p>
        </div>
        <Button asChild className="rounded-full px-5 font-bold">
          <Link to="/new">
            <Plus className="mr-1.5 h-4 w-4" /> New trip
          </Link>
        </Button>
      </div>

      {!user?.home_country && !user?.home_location && (
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-3xl border border-passport bg-passport/50 p-4 transition-colors hover:bg-passport"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-passport-foreground/10 text-passport-foreground">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold">Where&apos;s home?</p>
            <p className="text-xs text-passport-foreground">
              Tell me where home is so I know when you need your passport, which adapter to pack, and the time
              difference at your destination.
            </p>
          </div>
        </Link>
      )}

      {trips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <h2 className="font-heading text-2xl font-extrabold">Packing stress ends here.</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Tell me where you&apos;re going and what you&apos;re doing — I&apos;ll check the weather and build
            your carry-on checklist in about a minute.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full px-6 font-bold">
            <Link to="/new">Plan my first trip</Link>
          </Button>
        </div>
      ) : (
        <>
          {activeTrip && (
            <ActiveTripPanel
              trip={activeTrip}
              onViewList={() => navigate(`/trip/${activeTrip.id}`)}
              onUnpackEarly={() => navigate(`/trip/${activeTrip.id}/unpack`)}
            />
          )}

          {needUnpack.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-sm font-extrabold text-passport-foreground">
                Welcome home — unpack to teach me
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {needUnpack.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-sm font-extrabold text-muted-foreground">
                Upcoming
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {upcoming.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {past.filter((t) => t.unpacked).length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-sm font-extrabold text-muted-foreground">
                Past trips
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {past
                  .filter((t) => t.unpacked)
                  .map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
              </div>
            </section>
          )}
        </>
      )}
      </div>
    </PullToRefresh>
  );
}