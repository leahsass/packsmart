import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { base44 } from "@/api/base44Client";

const CATEGORY_LABELS = {
  clothing: "Clothing",
  shoes: "Shoes",
  accessories: "Accessories",
  toiletries: "Toiletries",
  electronics: "Electronics",
  documents: "Documents",
  sports_gear: "Sports gear",
  nutrition: "Nutrition",
  other: "Other",
};

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
];

export default function PackingDashboard({ refreshKey = 0 }) {
  const [unused, setUnused] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.UnpackFeedback.aggregate({
      groupBy: "item_name",
      sum: "quantity_unused",
      sort: "-sum_quantity_unused",
      limit: 5,
    })
      .then((r) => {
        if (active) setUnused((r.rows || []).filter((row) => row.sum_quantity_unused > 0).slice(0, 5));
      })
      .catch(() => active && setUnused([]));

    base44.entities.UnpackFeedback.aggregate({
      groupBy: "category",
      sum: "packed_quantity",
      sort: "-sum_packed_quantity",
    })
      .then((r) => {
        if (active) {
          setCategories(
            (r.rows || [])
              .filter((row) => row.sum_packed_quantity > 0)
              .map((row, i) => ({
                name: CATEGORY_LABELS[row.category] || row.category,
                value: row.sum_packed_quantity,
                fill: PIE_COLORS[i % PIE_COLORS.length],
              }))
          );
        }
      })
      .catch(() => active && setCategories([]));
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const loading = unused === null || categories === null;
  const empty = !loading && unused.length === 0 && categories.length === 0;

  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold text-muted-foreground">
        <BarChart3 className="h-4 w-4" /> Packing dashboard
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">What your unpack feedback history says.</p>

      {loading ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div className="h-56 animate-pulse rounded-2xl bg-muted" />
          <div className="h-56 animate-pulse rounded-2xl bg-muted" />
        </div>
      ) : empty ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Nothing yet — unpack a trip and your charts will fill in.
        </p>
      ) : (
        <div className="mt-5 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground">Most unused items</h3>
            {unused.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No unused items recorded — nicely packed!</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={unused} layout="vertical" margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="item_name"
                    width={110}
                    tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                  />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="sum_quantity_unused" name="Left unused" fill="hsl(var(--chart-3))" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground">Categories packed</h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>
                    {categories.map((c) => (
                      <Cell key={c.name} fill={c.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-2 text-sm">
                {categories.map((c) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.fill }} />
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">({c.value})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}