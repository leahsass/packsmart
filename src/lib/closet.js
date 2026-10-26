// Closet attributes and the suggestion logic that matches saved pieces to a trip.

export const CLOSET_CATEGORIES = ["clothing", "shoes", "accessories"];

export const WARMTH_OPTIONS = [
  { value: "light", label: "Light", hint: "Tees, linen, shorts" },
  { value: "medium", label: "Medium", hint: "Layers, light knits" },
  { value: "warm", label: "Warm", hint: "Coats, heavy knits" },
  { value: "winter", label: "Winter", hint: "Parkas, thermals" }
];

export const FORMALITY_OPTIONS = [
  { value: "athletic", label: "Athletic" },
  { value: "casual", label: "Casual" },
  { value: "dressy casual", label: "Dressy casual" },
  { value: "business casual", label: "Business casual" },
  { value: "business", label: "Business" },
  { value: "cocktail", label: "Cocktail" }
];

export const COLOR_OPTIONS = [
  { value: "black", label: "Black", hex: "#1a1a1a" },
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "gray", label: "Gray", hex: "#8a8a8a" },
  { value: "beige", label: "Beige / cream", hex: "#e8dcc8" },
  { value: "navy", label: "Navy blue", hex: "#1f2a44" },
  { value: "blue", label: "Blue", hex: "#2f6bd8" },
  { value: "green", label: "Green", hex: "#2f7d4f" },
  { value: "olive", label: "Olive", hex: "#6b7245" },
  { value: "red", label: "Red", hex: "#c03434" },
  { value: "orange", label: "Orange", hex: "#e07a2f" },
  { value: "yellow", label: "Yellow", hex: "#e8c22a" },
  { value: "burgundy", label: "Burgundy", hex: "#6d1f2c" },
  { value: "brown", label: "Brown", hex: "#6b4a33" },
  { value: "multi", label: "Multi", hex: null },
  { value: "purple", label: "Purple", hex: "#6a4c93" },
  { value: "pink", label: "Pink", hex: "#e39ab5" }
];

// Items saved before the six-step scale used "smart" and "formal".
const LEGACY_FORMALITY = { smart: "business casual", formal: "cocktail" };

export const normalizeFormality = (value) => LEGACY_FORMALITY[value] || value || "";

export const warmthLabel = (value) =>
  WARMTH_OPTIONS.find((option) => option.value === value)?.label || "";

export const formalityLabel = (value) =>
  FORMALITY_OPTIONS.find((option) => option.value === normalizeFormality(value))?.label || "";

export const colorLabel = (value) =>
  COLOR_OPTIONS.find((option) => option.value === value)?.label || value || "";

const WARMTH_RANK = { light: 0, medium: 1, warm: 2, winter: 3 };
const FORMALITY_RANK = {
  athletic: 0,
  casual: 1,
  "dressy casual": 2,
  "business casual": 3,
  business: 4,
  cocktail: 5
};

// Trips store temperatures in Celsius.
const targetWarmth = (highC) => {
  if (highC == null) return null;
  if (highC >= 24) return "light";
  if (highC >= 12) return "medium";
  return "warm";
};

const tripContext = (trip) =>
  `${trip.trip_purpose || ""} ${trip.event_details || ""} ${(trip.activities || []).join(" ")}`;

const targetFormality = (trip) => {
  const context = tripContext(trip);
  if (/wedding|gala|cocktail|black tie|formal/i.test(context)) return FORMALITY_RANK.cocktail;
  if (/business|work|conference|meeting|dinner/i.test(context)) return FORMALITY_RANK["business casual"];
  return FORMALITY_RANK.casual;
};

const normalize = (value) => (value || "").toLowerCase().trim();

const SPORTY_PLANS = /hiking|biking|running|gym|ski/i;

// Compact reasons a saved piece suits the trip, shown as chips before generation.
export function matchIndicators(item, trip) {
  if (!trip) return [];

  const indicators = [];
  const rank = FORMALITY_RANK[normalizeFormality(item.formality)];

  if (rank != null) {
    if (Math.abs(rank - targetFormality(trip)) <= 1) indicators.push("Fits your plans");
    indicators.push(formalityLabel(item.formality));
  }

  if (item.formality === "athletic" && SPORTY_PLANS.test(`${trip.activities || ""}`)) {
    indicators.push("Athletic plans");
  }

  if (item.favorite) indicators.push("Favorite");
  return indicators;
}

export function suggestClosetItems({ closet = [], trip, existing = [], limit = 10 }) {
  if (!trip) return [];

  const takenIds = new Set(existing.map((item) => item.closet_item_id).filter(Boolean));
  const takenNames = new Set(existing.map((item) => normalize(item.name)));
  const target = targetWarmth(trip.weather_high);
  const formalityTarget = targetFormality(trip);

  return closet
    .filter((item) => !takenIds.has(item.id) && !takenNames.has(normalize(item.name)))
    .map((item) => {
      let score = 0;
      score += { clothing: 3, shoes: 2, accessories: 1 }[item.category] || 0;

      if (target && item.warmth) {
        const gap = Math.abs(WARMTH_RANK[item.warmth] - WARMTH_RANK[target]);
        score += gap === 0 ? 3 : gap === 1 ? 1 : -2;
      }

      const rank = FORMALITY_RANK[normalizeFormality(item.formality)];
      if (rank != null) {
        const gap = Math.abs(rank - formalityTarget);
        score += gap === 0 ? 2 : gap <= 2 ? 1 : 0;
      }

      if (item.favorite) score += 1;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}