import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, CloudSun, Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import RecapStats from "@/components/recap/RecapStats";
import RecapInsights from "@/components/recap/RecapInsights";
import RecapItemRow from "@/components/recap/RecapItemRow";
import { useAuth } from "@/lib/AuthContext";
import { formatDate, tripDayCount } from "@/lib/categories";
import { normalizeUnits, tempRange } from "@/lib/temperature";

const EXTRA_REASONS = {
  forgot_to_pack: "forgot to pack it",
  bought_for_fun: "bought for fun",
  other: "picked up on the trip"
};

export default function TripRecap() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const units = normalizeUnits(user?.weather_units);
  const [trip, setTrip] = useState(null);
  const [records, setRecords] = useState(null);
  const [insights, setInsights] = useState(null);
  const [packedCount, setPackedCount] = useState(0);
  const [notesChanged, setNotesChanged] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    base44.entities.Trip.get(id).then(setTrip).catch(() => setTrip(undefined));
    base44.entities.UnpackFeedback.filter({ trip_id: id }).then(setRecords).catch(() => setRecords([]));
    base44.entities.LearnedPreference
      .filter({ created_trip_id: id })
      .then(setInsights)
      .catch(() => setInsights([]));
    base44.entities.PackingItem.count({ trip_id: id }).then(setPackedCount).catch(() => setPackedCount(0));
  }, [id]);

  if (trip === null || records === null || insights === null) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }
  if (trip === undefined) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-xl font-bold">Trip not found.</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/">Back to your trips</Link>
        </Button>
      </div>
    );
  }

  const extras = records.filter((r) => r.is_extra);
  const tracked = records.filter((r) => !r.is_extra);
  const neverWorn = tracked.filter((r) => (r.quantity_unused || 0) > 0);
  const reworn = tracked.filter((r) => (r.quantity_unused || 0) === 0 && (r.quantity_repeated || 0) > 0);
  const unusedTotal = tracked.reduce((sum, r) => sum + (r.quantity_unused || 0), 0);
  const reworeTotal = tracked.reduce((sum, r) => sum + (r.quantity_repeated || 0), 0);

  const onSaved = (updated) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setNotesChanged(true);
  };

  const refreshLessons = async () => {
    setRefreshing(true);
    try {
      const res = await base44.functions.invoke("unpackInsights", { trip_id: id, replace: true });
      const fresh = (res.data?.insights || []).map((i, index) => ({ id: `${i.insight}-${index}`, ...i }));
      setInsights(fresh);
      setNotesChanged(false);
      toast({ title: "Lessons updated", description: "Your notes are part of what I know now." });
    } catch {
      toast({ variant: "destructive", title: "Couldn't update your lessons — try again." });
    } finally {
      setRefreshing(false);
    }
  };

  const sections = [
    { key: "unused", title: "Packed but never worn", rows: neverWorn, empty: "Nothing went unworn — nice packing." },
    { key: "reworn", title: "Worth rewearing", rows: reworn, empty: "Nothing got reworn on this one." }
  ];

  return (
    <div className="space-y-6 pb-4">
      <Link
        to={`/trip/${trip.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the trip
      </Link>

      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">{trip.destination}, recapped</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {formatDate(trip.start_date)}–{formatDate(trip.end_date)} · {tripDayCount(trip)} days · {trip.country}
        </p>
        {trip.weather_high != null && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
            <CloudSun className="h-3.5 w-3.5 text-muted-foreground" />
            Forecast on file: {tempRange(trip.weather_low, trip.weather_high, units)} · {trip.weather_conditions}
          </p>
        )}
      </div>

      <RecapStats packed={packedCount} unused={unusedTotal} rewore={reworeTotal} bought={extras.length} />

      <RecapInsights insights={insights} />

      {notesChanged && (
        <Button
          className="w-full rounded-full font-bold"
          variant="outline"
          disabled={refreshing}
          onClick={refreshLessons}
        >
          {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          {refreshing ? "Updating lessons…" : "Update my lessons with these notes"}
        </Button>
      )}

      <p className="rounded-2xl bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-secondary-foreground">
        Why you skipped something matters — weather, plans, dress codes. Add a note and I&apos;ll weigh it when I
        pack your next trip.
      </p>

      {sections.map(({ key, title, rows, empty }) => (
        <section key={key}>
          <h2 className="mb-2.5 font-heading text-xs font-extrabold text-muted-foreground">{title}</h2>
          {rows.length ? (
            <div className="space-y-2">
              {rows.map((record) => (
                <RecapItemRow key={record.id} record={record} onSaved={onSaved} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              {empty}
            </p>
          )}
        </section>
      ))}

      {extras.length > 0 && (
        <section>
          <h2 className="mb-2.5 flex items-center gap-2 font-heading text-xs font-extrabold text-muted-foreground">
            <ShoppingBag className="h-4 w-4" /> Bought along the way
          </h2>
          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {extras.map((extra) => (
              <div key={extra.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate text-sm font-semibold">{extra.item_name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {EXTRA_REASONS[extra.extra_reason] || EXTRA_REASONS.other}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Button asChild size="lg" className="w-full rounded-full py-6 text-base font-bold">
        <Link to="/new">
          Plan the next trip <ArrowRight className="ml-1.5 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}