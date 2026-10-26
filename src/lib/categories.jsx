import { Shirt, Footprints, Glasses, Droplets, Cable, FileText, Bike, Zap, Package } from "lucide-react";

export const CATEGORY_META = {
  clothing: { label: "Clothes", icon: Shirt },
  shoes: { label: "Shoes", icon: Footprints },
  accessories: { label: "Accessories", icon: Glasses },
  toiletries: { label: "Toiletries", icon: Droplets },
  electronics: { label: "Electronics", icon: Cable },
  documents: { label: "Documents", icon: FileText },
  sports_gear: { label: "Sports gear", icon: Bike },
  nutrition: { label: "Nutrition", icon: Zap },
  other: { label: "Other", icon: Package }
};

export const CATEGORY_ORDER = ["documents", "clothing", "shoes", "accessories", "toiletries", "electronics", "sports_gear", "nutrition", "other"];

// Categories where "didn't use / rewore" tracking makes sense at unpack time.
// Toiletries and accessories aren't worth itemizing — toiletries are always
// packed (and always restocked), accessories are one-off pieces.
export const TRACKED_CATEGORIES = ["clothing", "shoes"];

export const ACTIVITIES = [
  { id: "nice dinner", label: "Nice dinner" },
  { id: "hiking", label: "Hiking" },
  { id: "biking", label: "Biking" },
  { id: "walking around the city", label: "City walking" },
  { id: "lounging by the pool or beach", label: "Pool or beach" },
  { id: "sightseeing and museums", label: "Sightseeing" },
  { id: "nightlife", label: "Nightlife" },
  { id: "business meetings", label: "Business meetings" },
  { id: "gym or workout", label: "Gym / workout" },
  { id: "running", label: "Running" },
  { id: "skiing or snow sports", label: "Skiing / snow" },
  { id: "working remotely", label: "Working remotely" }
];

export const tripDayCount = (trip) =>
  Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1);

export const isTripEnded = (trip) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(trip.end_date) < today;
};

// "upcoming" -> hasn't started yet · "active" -> happening right now ·
// "return_ready" -> ended but not unpacked yet · "unpacked" -> done and learned from
export const getTripPhase = (trip) => {
  if (trip.unpacked) return "unpacked";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(trip.start_date);
  start.setHours(0, 0, 0, 0);
  if (today < start) return "upcoming";
  if (isTripEnded(trip)) return "return_ready";
  return "active";
};

export const tripDayNumber = (trip) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.min(tripDayCount(trip), Math.max(1, Math.round((today - new Date(trip.start_date)) / 86400000) + 1));
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });