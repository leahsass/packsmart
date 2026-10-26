import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const pad = (n) => String(n).padStart(2, "0");

const isoToMask = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};

const digitsToMask = (digits) => {
  const d = digits.slice(0, 8);
  let out = d.slice(0, 2);
  if (d.length > 2) out += "/" + d.slice(2, 4);
  if (d.length > 4) out += "/" + d.slice(4, 8);
  return out;
};

const maskToIso = (mask) => {
  const parts = mask.split("/").map(Number);
  if (parts.length !== 3) return "";
  const [m, d, y] = parts;
  if (!m || !d || !y || y < 1000) return "";
  const iso = `${y}-${pad(m)}-${pad(d)}`;
  const dt = new Date(`${iso}T00:00:00`);
  if (isNaN(dt.getTime()) || dt.getMonth() !== m - 1 || dt.getDate() !== d) return "";
  return iso;
};

export default function DateInput({ value, onChange, min, id }) {
  // When empty, open the calendar on the earliest allowed date (e.g. the departure date)
  const defaultMonth = !value && min ? new Date(`${min}T00:00:00`) : undefined;
  const [mask, setMask] = useState(isoToMask(value));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMask(isoToMask(value));
  }, [value]);

  const handleChange = (e) => {
    const newMask = digitsToMask(e.target.value.replace(/\D/g, ""));
    setMask(newMask);
    const iso = maskToIso(newMask);
    if (newMask.replace(/\D/g, "").length === 0) {
      onChange("");
    } else if (iso && iso !== value) {
      onChange(iso);
    }
  };

  const handleBlur = () => {
    if (!maskToIso(mask)) setMask(isoToMask(value));
  };

  const handlePick = (date) => {
    onChange(date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <input
          id={id}
          value={mask}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="MM/DD/YYYY"
          inputMode="numeric"
          autoComplete="off"
          className="h-11 w-full rounded-xl border border-input bg-card pl-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Pick a date"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={value ? new Date(`${value}T00:00:00`) : undefined}
          defaultMonth={defaultMonth}
          onSelect={handlePick}
          disabled={min ? { before: new Date(`${min}T00:00:00`) } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}