import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle2, CloudSun, Luggage, MapPin, Briefcase, WashingMachine } from "lucide-react";
import { formatDate, getTripPhase, tripDayCount, tripDayNumber } from "@/lib/categories";
import { normalizeUnits, tempValue } from "@/lib/temperature";
import { useAuth } from "@/lib/AuthContext";

export default function TripCard({ trip }) {
  const { user } = useAuth();
  const units = normalizeUnits(user?.weather_units);
  const phase = getTripPhase(trip);

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="group block rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-bold leading-tight">{trip.destination}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{trip.country}</span>
            <span>· {formatDate(trip.start_date)}–{formatDate(trip.end_date)} · {tripDayCount(trip)} days</span>
          </p>
        </div>
        {trip.weather_high != null && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            <CloudSun className="h-3.5 w-3.5" />
            {tempValue(trip.weather_high, units)}°{units === "f" ? "F" : "C"}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
        {phase === "active" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-bold text-primary">
            <CalendarDays className="h-3 w-3" /> Day {tripDayNumber(trip)} of {tripDayCount(trip)}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
          <Luggage className="h-3 w-3" /> Carry-on
        </span>
        {trip.bag_type !== "carry_on" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
            <Briefcase className="h-3 w-3" /> {trip.bag_type === "bike_case" ? "Bike case" : "Checked suitcase"}
          </span>
        )}
        {trip.laundry && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
            <WashingMachine className="h-3 w-3" /> Laundry
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end">
        {trip.unpacked ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Unpacked — I learned from this one
          </span>
        ) : phase === "return_ready" ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-passport-foreground">
            <span className="rounded-full bg-passport px-3 py-1">Welcome home — unpack</span>
            <ArrowRight className="h-4 w-4 animate-pulse" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
            Open packing list <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Link>
  );
}