import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, ShoppingBag, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import UnpackRow from "@/components/packing/UnpackRow";
import ExtraItemLog from "@/components/packing/ExtraItemLog";
import { CATEGORY_META, CATEGORY_ORDER, TRACKED_CATEGORIES } from "@/lib/categories";

export default function Unpack() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    base44.entities.Trip.get(id).then(setTrip).catch(() => setTrip(undefined));
    base44.entities.PackingItem
      .filter({ trip_id: id })
      .then((list) => setItems(list.filter((i) => i.quantity > 0)))
      .catch(() => setItems([]));
  }, [id]);

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

  const updateItem = (itemId, value) => setFeedback((prev) => ({ ...prev, [itemId]: value }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const records = items
        .filter((i) => (feedback[i.id]?.unused || 0) > 0 || (feedback[i.id]?.repeated || 0) > 0)
        .map((i) => ({
          trip_id: id,
          item_name: i.name,
          category: i.category,
          is_sports: !!i.is_sports,
          packed_quantity: i.quantity,
          quantity_unused: feedback[i.id]?.unused || 0,
          quantity_repeated: feedback[i.id]?.repeated || 0,
          reason: (feedback[i.id]?.reason || "").slice(0, 300)
        }));
      if (records.length) {
        await base44.entities.UnpackFeedback.bulkCreate(records);
      }
      await base44.functions.invoke("unpackInsights", { trip_id: id });
      await base44.entities.Trip.update(id, { unpacked: true, status: "completed" });
      navigate(`/trip/${id}/recap`);
    } catch (err) {
      toast({ variant: "destructive", title: "Couldn't save your unpack notes — try again." });
      setSubmitting(false);
    }
  };

  const sections = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    meta: CATEGORY_META[cat],
    items: items.filter((i) => i.category === cat && !i.is_sports && TRACKED_CATEGORIES.includes(cat))
  })).filter((s) => s.items.length > 0);
  const sportsItems = items.filter((i) => i.is_sports);

  return (
    <div className="space-y-7 pb-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the list
      </button>

      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Unpack {trip.destination}</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          What did you actually wear? Pick one per item: <span className="font-bold text-foreground">didn&apos;t use</span>,{" "}
          <span className="font-bold text-foreground">used once</span> or{" "}
          <span className="font-bold text-foreground">used often</span>. Shoes just need a simple
          used-or-not, and I skip accessories and toiletries — you always pack toiletries, so I keep them on every list.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nothing was packed on this list.
        </p>
      ) : (
        <div className="space-y-7">
          {sections.map(({ key, meta, items: sectionItems }) => (
            <section key={key}>
              <h3 className="mb-2.5 flex items-center gap-2 font-heading text-xs font-extrabold text-muted-foreground">
                <meta.icon className="h-4 w-4" />
                {meta.label}
              </h3>
              <div className="space-y-2">
                {sectionItems.map((item) => (
                  <UnpackRow
                    key={item.id}
                    item={item}
                    value={feedback[item.id] || { unused: 0, repeated: 0, reason: "" }}
                    onChange={(value) => updateItem(item.id, value)}
                  />
                ))}
              </div>
            </section>
          ))}
          {sportsItems.length > 0 && (
            <section>
              <h3 className="mb-2.5 flex items-center gap-2 font-heading text-xs font-extrabold text-muted-foreground">
                <Sparkles className="h-4 w-4" /> Sports — counted separately
              </h3>
              <div className="space-y-2">
                {sportsItems.map((item) => (
                  <UnpackRow
                    key={item.id}
                    item={item}
                    value={feedback[item.id] || { unused: 0, repeated: 0, reason: "" }}
                    onChange={(value) => updateItem(item.id, value)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <section>
        <h3 className="mb-2.5 flex items-center gap-2 font-heading text-xs font-extrabold text-muted-foreground">
          <ShoppingBag className="h-4 w-4" /> Extra items
        </h3>
        <ExtraItemLog tripId={id} />
      </section>

      <Button
        size="lg"
        className="w-full rounded-full py-6 text-base font-bold"
        disabled={submitting || items.length === 0}
        onClick={submit}
      >
        {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
        {submitting ? "Learning from your trip…" : "Done — learn from this trip"}
      </Button>
    </div>
  );
}