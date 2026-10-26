import React, { useState } from "react";
import { Plus, Trophy } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import PackingItemRow from "./PackingItemRow";
import AddItemForm from "./AddItemForm";

function SectionHeader({ icon: Icon, title, onAdd }) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h3 className="flex items-center gap-2 font-heading text-xs font-extrabold text-muted-foreground">
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      {onAdd && (
        <button
          type="button"
          aria-label={`add item to ${title}`}
          onClick={onAdd}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function PackingList({ items, onToggle, onQuantityChange, onDelete, onAdd }) {
  const [addingSection, setAddingSection] = useState(null);

  const sections = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    meta: CATEGORY_META[cat],
    items: items.filter((i) => i.category === cat && !i.is_sports)
  })).filter((s) => s.items.length > 0);

  const sportsItems = items.filter((i) => i.is_sports);

  if (!items.length) {
    return (
      <p className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nothing on your list yet — add items with the + buttons below.
      </p>
    );
  }

  return (
    <div className="space-y-7">
      {sections.map(({ key, meta, items: sectionItems }) => (
        <section key={key}>
          <SectionHeader icon={meta.icon} title={meta.label} onAdd={() => setAddingSection(addingSection === key ? null : key)} />
          <div className="space-y-2">
            {sectionItems.map((item) => (
              <PackingItemRow
                key={item.id}
                item={item}
                onToggle={(packed) => onToggle(item, packed)}
                onQuantityChange={(q) => onQuantityChange(item, q)}
                onDelete={() => onDelete(item)}
              />
            ))}
            {addingSection === key && (
              <AddItemForm
                defaultCategory={key}
                onAdd={(data) => onAdd(data)}
                onCancel={() => setAddingSection(null)}
              />
            )}
          </div>
        </section>
      ))}

      {sportsItems.length > 0 && (
        <section>
          <SectionHeader icon={Trophy} title="Sports — packed separately" />
          <div className="space-y-2">
            {sportsItems.map((item) => (
              <PackingItemRow
                key={item.id}
                item={item}
                onToggle={(packed) => onToggle(item, packed)}
                onQuantityChange={(q) => onQuantityChange(item, q)}
                onDelete={() => onDelete(item)}
              />
            ))}
            {addingSection === "sports" && (
              <AddItemForm
                defaultCategory="sports_gear"
                onAdd={(data) => onAdd({ ...data, is_sports: true })}
                onCancel={() => setAddingSection(null)}
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setAddingSection(addingSection === "sports" ? null : "sports")}
            className="mt-2 min-h-[36px] py-2 text-xs font-semibold text-primary hover:underline"
          >
            + Add sports item
          </button>
        </section>
      )}
    </div>
  );
}