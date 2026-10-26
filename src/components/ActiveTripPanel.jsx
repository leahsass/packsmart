import React from "react";
import { CloudSun, ListChecks, Plane } from "lucide-react";
import { tripDayCount, tripDayNumber } from "@/lib/categories";
import { normalizeUnits, tempRange } from "@/lib/temperature";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import ExtraItemLog from "@/components/packing/ExtraItemLog";

export default function ActiveTripPanel({ trip, onViewList, onUnpackEarly }) {
  const { user } = useAuth();
  const units = normalizeUnits(user?.weather_units);
  const day = tripDayNumber(trip);
  const total = tripDayCount(trip);

  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Plane className="h-6 w-6" />
      </span>
      <p className="mt-4 text-xs font-bold text-primary">
        Day {day} of {total}
      </p>
      <h2 className="mt-1 font-heading text-2xl font-extrabold">You&apos;re in {trip.destination}</h2>
      {trip.weather_high != null && (
        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <CloudSun className="h-4 w-4" />
          {tempRange(trip.weather_low, trip.weather_high, units)} · {trip.weather_conditions}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" className="rounded-full" onClick={onViewList}>
          <ListChecks className="mr-1.5 h-4 w-4" /> View packing list
        </Button>
        <Button variant="ghost" className="rounded-full text-muted-foreground" onClick={onUnpackEarly}>
          Back early? Unpack now
        </Button>
      </div>

      <div className="mt-5 border-t border-primary/20 pt-4 text-left">
        <ExtraItemLog tripId={trip.id} />
      </div>
    </div>
  );
}