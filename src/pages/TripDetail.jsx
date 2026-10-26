import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, CloudSun, Globe, Luggage, Plug, WashingMachine, Sparkles, CalendarDays, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DateInput from "@/components/DateInput";
import PackingList from "@/components/packing/PackingList";
import ActiveTripPanel from "@/components/ActiveTripPanel";
import { formatDate, getTripPhase, tripDayCount } from "@/lib/categories";
import { normalizeUnits, tempRange } from "@/lib/temperature";
import { useAuth } from "@/lib/AuthContext";
import PullToRefresh from "@/components/PullToRefresh";
import ClosetSuggestions from "@/components/closet/ClosetSuggestions";
import {
  cacheItems,
  cacheTrip,
  flushOutbox,
  makeTempId,
  queueOp,
  readCachedItems,
  readCachedTrip
} from "@/lib/offline";

const Chip = ({ icon: Icon, children, title }) => (
  <span
    title={title}
    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground"
  >
    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    {children}
  </span>
);

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const units = normalizeUnits(user?.weather_units);
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState(null);
  const [view, setView] = useState("trip");
  const [extendOpen, setExtendOpen] = useState(false);
  const [newEnd, setNewEnd] = useState("");

  const updateItems = (updater) =>
    setItems((prev) => {
      const next = updater(prev || []);
      cacheItems(id, next);
      return next;
    });

  const loadTrip = () =>
    base44.entities.Trip.get(id)
      .then((loaded) => {
        cacheTrip(loaded);
        setTrip(loaded);
      })
      .catch(() => setTrip(readCachedTrip(id) || undefined));

  const loadItems = () =>
    base44.entities.PackingItem.filter({ trip_id: id })
      .then((loaded) => {
        cacheItems(id, loaded);
        setItems(loaded);
      })
      .catch(() => setItems(readCachedItems(id) || []));

  useEffect(() => {
    loadTrip();
    loadItems();
    flushOutbox().catch(() => {});
  }, [id]);

  useEffect(() => {
    const onSynced = () => loadItems();
    window.addEventListener("packsmart:synced", onSynced);
    return () => window.removeEventListener("packsmart:synced", onSynced);
  }, [id]);

  const refresh = async () => {
    await flushOutbox().catch(() => {});
    await Promise.all([loadTrip(), loadItems()]);
  };

  if (trip === null || items === null) {
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

  const phase = getTripPhase(trip);
  const showInterstitial = phase === "active" && view === "trip";
  const packedCount = items.filter((i) => i.packed).length;
  const total = items.length;
  const pct = total ? Math.round((packedCount / total) * 100) : 0;

  const toggleItem = async (item, packed) => {
    updateItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, packed } : i)));
    if (!navigator.onLine) {
      queueOp({ type: "packing_update", id: item.id, data: { packed } });
      return;
    }
    try {
      await base44.entities.PackingItem.update(item.id, { packed });
    } catch {
      loadItems();
      toast({ variant: "destructive", title: "Couldn't save — check your connection." });
    }
  };

  const changeQuantity = async (item, quantity) => {
    updateItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity } : i)));
    if (!navigator.onLine) {
      queueOp({ type: "packing_update", id: item.id, data: { quantity } });
      return;
    }
    try {
      await base44.entities.PackingItem.update(item.id, { quantity });
    } catch {
      loadItems();
      toast({ variant: "destructive", title: "Couldn't save — check your connection." });
    }
  };

  const deleteItem = async (item) => {
    updateItems((prev) => prev.filter((i) => i.id !== item.id));
    if (!navigator.onLine) {
      queueOp({ type: "packing_delete", id: item.id });
      return;
    }
    try {
      await base44.entities.PackingItem.delete(item.id);
    } catch {
      loadItems();
    }
  };

  const addItem = async (data) => {
    const tempId = makeTempId();
    updateItems((prev) => [...prev, { id: tempId, trip_id: id, packed: false, quantity: 1, ...data }]);

    if (!navigator.onLine) {
      queueOp({ type: "packing_create", tempId, data: { trip_id: id, packed: false, ...data } });
      return;
    }
    try {
      const created = await base44.entities.PackingItem.create({ trip_id: id, packed: false, ...data });
      updateItems((prev) => prev.map((i) => (i.id === tempId ? created : i)));
    } catch {
      updateItems((prev) => prev.filter((i) => i.id !== tempId));
      toast({ variant: "destructive", title: "Couldn't add that item." });
    }
  };

  const addClosetItems = async (payloads) => {
    try {
      const created = await base44.entities.PackingItem.bulkCreate(
        payloads.map((payload) => ({ trip_id: id, packed: false, quantity: 1, ...payload }))
      );
      updateItems((prev) => [...prev, ...created]);
    } catch {
      toast({ variant: "destructive", title: "Couldn't add those items — try again." });
    }
  };

  const saveExtension = async () => {
    if (!newEnd || newEnd <= trip.end_date) return;
    try {
      const updated = await base44.entities.Trip.update(id, { end_date: newEnd });
      setTrip(updated);
      setExtendOpen(false);
      setNewEnd("");
      setView("trip");
    } catch {
      toast({ variant: "destructive", title: "Couldn't save the new date — try again." });
    }
  };

  return (
    <PullToRefresh onRefresh={refresh}>
      <div className="space-y-7">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Your trips
      </button>

      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">{trip.destination}</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {formatDate(trip.start_date)}–{formatDate(trip.end_date)} · {tripDayCount(trip)} days · {trip.country}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {trip.weather_high != null && (
            <Chip icon={CloudSun} title={trip.weather_summary}>
              {tempRange(trip.weather_low, trip.weather_high, units)} · {trip.weather_conditions}
            </Chip>
          )}
          {trip.adapter_type && <Chip icon={Plug}>Adapter: {trip.adapter_type} · {trip.voltage}</Chip>}
          {trip.time_difference && <Chip icon={Clock}>Time zone: {trip.time_difference}</Chip>}
          {trip.is_international && <Chip icon={Globe}>International — bring your passport</Chip>}
          <Chip icon={Luggage}>Carry-on</Chip>
          {trip.bag_type !== "carry_on" && (
            <Chip icon={Briefcase}>{trip.bag_type === "bike_case" ? "Bike case checked" : "Suitcase checked"}</Chip>
          )}
          {trip.laundry && <Chip icon={WashingMachine}>Laundry available</Chip>}
        </div>
      </div>

      {!showInterstitial && (
        <div className="rounded-3xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-bold">
              {packedCount} of {total} packed
            </span>
            <span className="font-semibold text-muted-foreground">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {phase === "unpacked" && (
        <Link
          to={`/trip/${trip.id}/recap`}
          className="flex items-center justify-between gap-3 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" /> You unpacked this trip — see the recap.
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      )}

      {phase === "return_ready" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-passport bg-passport/60 p-5">
          <div>
            <p className="font-heading text-lg font-bold text-passport-foreground">Welcome home!</p>
            <p className="text-sm text-passport-foreground">Tell me what you didn&apos;t use and I&apos;ll pack you smarter next time.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full border-passport-foreground/30 font-bold text-passport-foreground hover:bg-passport"
              onClick={() => setExtendOpen((o) => !o)}
            >
              Still traveling? Extend trip
            </Button>
            <Button onClick={() => navigate(`/trip/${trip.id}/unpack`)} className="rounded-full px-5 font-bold">
              Unpack this trip <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {phase === "return_ready" && extendOpen && (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <Label htmlFor="extend_end">New return date</Label>
            <DateInput id="extend_end" value={newEnd} onChange={setNewEnd} min={trip.start_date} />
          </div>
          <div className="flex gap-2">
            <Button className="rounded-full font-bold" disabled={!newEnd || newEnd <= trip.end_date} onClick={saveExtension}>
              Save new date
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => { setExtendOpen(false); setNewEnd(""); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showInterstitial && (
        <ActiveTripPanel
          trip={trip}
          onViewList={() => setView("list")}
          onUnpackEarly={() => navigate(`/trip/${trip.id}/unpack`)}
        />
      )}

      {phase === "active" && view === "list" && (
        <button
          type="button"
          onClick={() => setView("trip")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to trip
        </button>
      )}

      {!showInterstitial && (
        <>
          <ClosetSuggestions trip={trip} items={items} onAddItems={addClosetItems} />
          <PackingList items={items} onToggle={toggleItem} onQuantityChange={changeQuantity} onDelete={deleteItem} onAdd={addItem} />
        </>
      )}
      </div>
    </PullToRefresh>
  );
}