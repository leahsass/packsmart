import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Shirt } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClosetItemCard from "@/components/closet/ClosetItemCard";
import ClosetItemForm from "@/components/closet/ClosetItemForm";
import { CATEGORY_META } from "@/lib/categories";
import { CLOSET_CATEGORIES } from "@/lib/closet";

export default function Closet() {
  const { toast } = useToast();
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    base44.entities.ClosetItem.list("-created_date", 200)
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const save = async (data) => {
    if (editing?.id) {
      const updated = await base44.entities.ClosetItem.update(editing.id, data);
      setItems((prev) => (prev || []).map((i) => (i.id === editing.id ? updated : i)));
    } else {
      const created = await base44.entities.ClosetItem.create(data);
      setItems((prev) => [created, ...(prev || [])]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const remove = async (item) => {
    setFormOpen(false);
    setEditing(null);
    setItems((prev) => (prev || []).filter((i) => i.id !== item.id));
    try {
      await base44.entities.ClosetItem.delete(item.id);
    } catch {
      toast({ variant: "destructive", title: "Couldn't remove that item." });
    }
  };

  const toggleFavorite = async (item) => {
    const favorite = !item.favorite;
    setItems((prev) => (prev || []).map((i) => (i.id === item.id ? { ...i, favorite } : i)));
    try {
      await base44.entities.ClosetItem.update(item.id, { favorite });
    } catch {
      setItems((prev) => (prev || []).map((i) => (i.id === item.id ? { ...i, favorite: !favorite } : i)));
    }
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items || []).filter(
      (item) => !q || `${item.name} ${item.color || ""}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  if (items === null) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">My closet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Save the pieces you actually travel with — I&apos;ll suggest them for each trip.
          </p>
        </div>
        <Button className="rounded-full px-5 font-bold" onClick={openAdd}>
          <Plus className="mr-1.5 h-4 w-4" /> Add item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <Shirt className="mx-auto h-6 w-6 text-muted-foreground" />
          <h2 className="mt-3 font-heading text-xl font-extrabold">Your closet is empty</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Describe a piece in a few words — a photo is optional. Then packing lists start with what you
            already own.
          </p>
          <Button className="mt-6 rounded-full px-6 font-bold" onClick={openAdd}>
            Add your first item
          </Button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your closet…"
              aria-label="Search your closet"
              className="h-11 pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Nothing matches &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="space-y-7">
              {CLOSET_CATEGORIES.map((category) => {
                const group = filtered.filter((item) => item.category === category);
                if (!group.length) return null;
                return (
                  <section key={category}>
                    <h2 className="mb-2.5 flex items-center gap-2 font-heading text-xs font-extrabold text-muted-foreground">
                      {React.createElement(CATEGORY_META[category].icon, { className: "h-4 w-4" })}
                      {CATEGORY_META[category].label} · {group.length}
                    </h2>
                    <div className="space-y-2">
                      {group.map((item) => (
                        <ClosetItemCard
                          key={item.id}
                          item={item}
                          onEdit={openEdit}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}

      <ClosetItemForm
        open={formOpen}
        item={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={save}
        onDelete={remove}
      />
    </div>
  );
}