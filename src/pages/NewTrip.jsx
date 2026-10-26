import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, Luggage, Sparkles, WashingMachine, Trophy, CloudSun, Bike } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DateInput from "@/components/DateInput";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ActivityPicker from "@/components/packing/ActivityPicker";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import ClosetStep from "@/components/newtrip/ClosetStep";
import { ACTIVITIES } from "@/lib/categories";

const STEPS = ["Where & when", "What's the plan?", "How are you packing?", "Your closet"];

function ToggleRow({ icon: Icon, title, description, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
    </div>
  );
}

export default function NewTrip() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activities, setActivities] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [availableTags, setAvailableTags] = useState(ACTIVITIES);
  const [carryOnOnly, setCarryOnOnly] = useState(true);
  const [bagType, setBagType] = useState("suitcase");
  const [laundry, setLaundry] = useState(false);
  const [sportsEvent, setSportsEvent] = useState(false);
  const [eventDetails, setEventDetails] = useState("");
  const [generating, setGenerating] = useState(false);
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState("");
  const [closetPicks, setClosetPicks] = useState([]);

  // Plans only — the live forecast arrives with generation.
  const closetDraft = useMemo(
    () => ({ activities, trip_purpose: purpose, event_details: eventDetails }),
    [activities, purpose, eventDetails]
  );

  const phases = [
    `Checking the live weather in ${destination.trim() || "your destination"}…`,
    "Planning outfits around your activities…",
    "Double-checking TSA carry-on rules…",
    "Counting socks so you don't have to…"
  ];

  useEffect(() => {
    if (!generating) return;
    const timer = setInterval(() => setPhase((p) => (p + 1) % phases.length), 7000);
    return () => clearInterval(timer);
  }, [generating]);

  // Load this traveler's curated activity tags (they adapt to their trip history)
  useEffect(() => {
    let active = true;
    base44.functions
      .invoke("getActivityTags", {})
      .then((res) => {
        if (active && res?.data?.tags?.length) setAvailableTags(res.data.tags);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const toggleActivity = (id) =>
    setActivities((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const step1Valid =
    destination.trim() && startDate && endDate && new Date(endDate) >= new Date(startDate);

  const generate = async () => {
    setGenerating(true);
    setError("");
    try {
      const homeCountry = user?.home_country || "";
      const homeLocation = user?.home_location || user?.home_country || "";
      const withBike = !carryOnOnly && bagType === "bike_case";
      const res = await base44.functions.invoke("generatePackingList", {
        destination: destination.trim(),
        country: country.trim(),
        start_date: startDate,
        end_date: endDate,
        home_country: homeCountry,
        home_location: homeLocation,
        activities,
        bag_type: carryOnOnly ? "carry_on" : bagType,
        laundry,
        sports_event: sportsEvent,
        event_details: eventDetails.trim(),
        traveling_with_bike: withBike,
        trip_purpose: purpose.trim(),
        closet_items: closetPicks.map((pick) => ({
          name: pick.name,
          category: pick.category,
          color: pick.color || "",
          warmth: pick.warmth || "",
          formality: pick.formality || ""
        }))
      });
      const data = res.data || {};
      const trip = await base44.entities.Trip.create({
        destination: destination.trim(),
        country: country.trim(),
        start_date: startDate,
        end_date: endDate,
        activities,
        bag_type: carryOnOnly ? "carry_on" : bagType,
        laundry,
        sports_event: sportsEvent,
        event_details: eventDetails.trim(),
        traveling_with_bike: withBike,
        trip_purpose: purpose.trim(),
        is_international: !!data.is_international,
        weather_summary: data.weather?.summary || "",
        weather_high: data.weather?.high_c ?? null,
        weather_low: data.weather?.low_c ?? null,
        weather_conditions: data.weather?.conditions || "",
        adapter_type: data.adapter_type || "",
        voltage: data.voltage || "",
        time_difference: data.time_difference || ""
      });
      const closetByName = new Map(
        closetPicks.map((pick) => [pick.name.trim().toLowerCase(), pick])
      );
      const items = (data.items || []).map((i) => ({
        trip_id: trip.id,
        name: i.name,
        category: i.category,
        quantity: i.quantity || 1,
        checked_bag_only: !!i.checked_bag_only,
        is_sports: !!i.is_sports,
        note: i.note || "",
        packed: false,
        closet_item_id: closetByName.get(String(i.name).trim().toLowerCase())?.id
      }));
      // Anything the list left out still gets packed from the closet.
      const coveredIds = new Set(items.map((i) => i.closet_item_id).filter(Boolean));
      const missing = closetPicks
        .filter((pick) => !coveredIds.has(pick.id))
        .map((pick) => ({
          trip_id: trip.id,
          name: pick.name,
          category: pick.category,
          quantity: 1,
          checked_bag_only: false,
          is_sports: false,
          note: "From your closet",
          packed: false,
          closet_item_id: pick.id
        }));
      if (items.length || missing.length) {
        await base44.entities.PackingItem.bulkCreate([...items, ...missing]);
      }
      navigate(`/trip/${trip.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Something went wrong.");
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 animate-bounce items-center justify-center rounded-3xl bg-primary text-primary-foreground">
          <Sparkles className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-heading text-2xl font-extrabold">Building your list</h2>
        <p className="mt-2 h-5 text-sm font-medium text-muted-foreground transition-all">{phases[phase]}</p>
        <p className="mt-1 text-xs text-muted-foreground">This usually takes about a minute.</p>
        {error ? (
          <div className="mt-8">
            <p className="text-sm font-semibold text-destructive">{error}</p>
            <Button variant="outline" className="mt-3 rounded-full" onClick={() => { setError(""); setGenerating(false); }}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Cancel
      </button>

      <div className="flex items-center gap-2" role="list">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <span
              role="listitem"
              aria-label={`Step ${i + 1} of ${STEPS.length}: ${s}`}
              className={`text-xs font-bold ${i === step ? "text-primary" : "text-muted-foreground"}`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
          </React.Fragment>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <LocationAutocomplete
                label="Where are you going?"
                placeholder="Search a city — e.g. Lisbon"
                value={destination}
                onSelect={({ label, country: c }) => {
                  setDestination(label);
                  setCountry(c);
                }}
                onChange={(text) => {
                  setDestination(text);
                  setCountry("");
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="start">Leaving</Label>
              <DateInput id="start" value={startDate} onChange={setStartDate} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">Coming home</Label>
              <DateInput id="end" value={endDate} onChange={setEndDate} min={startDate} />
            </div>
          </div>
          {startDate && endDate && !step1Valid && (
            <p className="text-xs font-semibold text-destructive">Your return date needs to be on or after your departure date.</p>
          )}
          <p className="flex items-center gap-2 rounded-2xl bg-secondary p-3 text-xs font-medium text-secondary-foreground">
            <CloudSun className="h-4 w-4 shrink-0" />
            I&apos;ll pull the live forecast for these dates and pack for the real weather.
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-extrabold">What&apos;s the itinerary?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tell me what this trip is about — the more detail, the better I pack.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="purpose">
              What&apos;s this trip for? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Attending a 3-day cycling race, one team dinner out, rest is casual sightseeing with lots of walking…"
              className="min-h-[110px] rounded-xl"
            />
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <Label>
              Anything else on the plan? <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <ActivityPicker tags={availableTags} selected={activities} onToggle={toggleActivity} />
            <p className="text-xs text-muted-foreground">Tags adapt to your trips — often-used ones stay, unused ones fade out.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <ToggleRow
            icon={Luggage}
            title="Carry-on only"
            description="My default. Everything on your list fits the cabin and follows TSA rules."
            checked={carryOnOnly}
            onCheckedChange={setCarryOnOnly}
          />
          {!carryOnOnly && (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setBagType("suitcase")}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${bagType === "suitcase" ? "border-primary bg-secondary/60" : "border-border bg-card hover:border-muted-foreground/40"}`}
              >
                <Briefcase className="h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-bold">Regular suitcase</p>
                  <p className="text-xs text-muted-foreground">Full-size toiletries OK — I&apos;ll flag what must be checked.</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setBagType("bike_case")}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${bagType === "bike_case" ? "border-primary bg-secondary/60" : "border-border bg-card hover:border-muted-foreground/40"}`}
              >
                <Bike className="h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-bold">Bike case</p>
                  <p className="text-xs text-muted-foreground">I&apos;ll pack your cycling kit, nutrition and spares.</p>
                </div>
              </button>
            </div>
          )}
          <ToggleRow
            icon={WashingMachine}
            title="I can do laundry"
            description="I'll cut your clothing by about a third and suggest fewer pieces."
            checked={laundry}
            onCheckedChange={setLaundry}
          />
          <ToggleRow
            icon={Trophy}
            title="I'm racing / athletic event"
            description="Adds event-day kit, nutrition and safety gear — counted separately from your regular clothes."
            checked={sportsEvent}
            onCheckedChange={setSportsEvent}
          />
          {sportsEvent && (
            <div className="space-y-1.5 rounded-2xl border border-border bg-card p-4">
              <Label htmlFor="event_details">Tell me about the event</Label>
              <Textarea
                id="event_details"
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
                placeholder="e.g. 3-day cycling stage race, about 80 miles a day, one evening awards dinner, cool mornings and warm afternoons…"
                className="min-h-[90px] rounded-xl"
              />
              <p className="text-xs text-muted-foreground">I&apos;ll tailor your event kit, nutrition and clothing to exactly this.</p>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <ClosetStep draft={closetDraft} selected={closetPicks} onChange={setClosetPicks} />
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" className="rounded-full font-semibold" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        {step < 3 ? (
          <Button
            className="rounded-full px-6 font-bold"
            disabled={(step === 0 && !step1Valid) || (step === 1 && !purpose.trim())}
            onClick={() => setStep((s) => s + 1)}
          >
            Next <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button className="rounded-full px-6 font-bold" onClick={() => { setGenerating(true); generate(); }}>
            <Sparkles className="mr-1.5 h-4 w-4" /> Generate my list
          </Button>
        )}
      </div>
    </div>
  );
}