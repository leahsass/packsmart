import React, { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import QuantityStepper from "./QuantityStepper";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";

export default function AddItemForm({ defaultCategory = "clothing", onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [quantity, setQuantity] = useState(1);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category, quantity });
    setName("");
    setQuantity(1);
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-muted-foreground/40 bg-card p-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add your own item…"
        className="h-9 min-w-[10rem] flex-1"
        autoFocus
      />
      <Drawer open={categoryOpen} onOpenChange={setCategoryOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            aria-label="category"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-input bg-card px-3 text-sm text-foreground"
          >
            {CATEGORY_META[category].label}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Category</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setCategoryOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    category === cat ? "bg-secondary text-secondary-foreground" : "text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {meta.label}
                  </span>
                  {category === cat && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
      <QuantityStepper value={quantity} min={1} onChange={setQuantity} ariaLabel="new item quantity" />
      <Button type="submit" size="sm" className="h-9 rounded-full px-4">
        <Plus className="mr-1 h-4 w-4" /> Add
      </Button>
      <button type="button" onClick={onCancel} className="px-2 text-sm text-muted-foreground hover:text-foreground">
        Cancel
      </button>
    </form>
  );
}