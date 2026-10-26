# PackSmart — Change Log: 2026-10-05 (mobile readiness session)

All changes are additive; no API calls, routing logic, or data handling was altered.
Build verified (`vite build` exit 0) after every batch.

---

## 1. Dark mode, page transitions & lazy loading (App shell)

### `src/App.jsx`
- Added `ThemeProvider` from `next-themes` (`attribute="class"`, `defaultTheme="system"`) around the app — enables dark mode via system preference.
- Wrapped `Routes` in `AnimatePresence mode="wait"` + added a `PageTransition` component (Framer Motion slide-in from right, 0.25s) on every route for a native-app feel.
- Converted all page imports to `React.lazy()` with a `Suspense` fallback (`PageLoader` spinner) — each page is its own chunk.

### `src/index.css`
- Added a full `.dark` token set (all colors, chart, sidebar tokens) mirroring `:root` in dark values.
- Added utilities: `.safe-top` / `.safe-bottom` (`env(safe-area-inset-*)`), `.no-scrollbar`.
- Global: `overscroll-behavior: none` on `html, body`; `user-select: none` on buttons/nav/[role=button] for WebView stability.
- Google Fonts import (Plus Jakarta Sans + Inter) at top of file.

### `tailwind.config.js`
- `darkMode: ["class"]` so `next-themes` class toggling works; sidebar color tokens mapped.

## 2. Bottom tab bar + per-tab navigation stack preservation

### `src/components/BottomTabBar.jsx` (created earlier, rewritten this session)
- Two tabs: **Trips** (`/`) and **Settings** (`/settings`).
- Replaced `NavLink` with buttons + `useNavigate` to support stack restoration.
- New behavior (per-tab stack preservation):
  - Every visited route is recorded under its owning tab (Settings tab owns `/settings*`; the Trips tab owns everything else) — recorded in Layout.
  - Tapping an inactive tab restores that tab's last route (e.g. `/trip/:id`).
  - Tapping the *active* tab resets it to its root (`/` or `/settings`).
- Adds `aria-current="page"` on the active tab; same visual styling as before.

### `src/components/Layout.jsx`
- Holds `tabPaths` state: a `useEffect` on `location.pathname` records each tab's latest route.
- Passes `tabPaths` down to `BottomTabBar`.
- Bottom tab bar integrated under `AppNavbar`; main content padded with `pb-[calc(5rem+env(safe-area-inset-bottom))]`.

## 3. Pull-to-refresh

### `src/components/PullToRefresh.jsx` (new)
- Touch-based pull-to-refresh wrapper (80px threshold, spring-back, spinner). Purely additive; wraps children in a plain div.

### `src/pages/Home.jsx`
- Wrapped page content in `<PullToRefresh onRefresh={loadTrips}>`; extracted `loadTrips()` (same `Trip.list("-start_date", 100)` call — data handling unchanged).

### `src/pages/TripDetail.jsx`
- Wrapped page content in `PullToRefresh`; new `refresh()` reloads both the trip (`Trip.get(id)`) and items (`loadItems()`), swallowing errors so a failed trip fetch never blanks the page.

### `src/pages/Settings.jsx`
- Wrapped page content in `PullToRefresh`; extracted `loadInsights()` (same `LearnedPreference.list("-created_date", 30)` call) and reuse it for refresh.

## 4. Touch-target sizes

### `src/components/packing/PackingList.jsx`
- `SectionHeader` add button: `h-7 w-7` → `h-9 w-9`.
- "+ Add sports item" text button: added `min-h-[36px] py-2`.

### `src/components/packing/ExtraItemLog.jsx`
- Remove (X) button: `p-1` → `p-2` + `flex min-h-[36px] min-w-[36px] items-center justify-center` so the tap area is ≥36px.

## 5. NewTrip step indicator accessibility

### `src/pages/NewTrip.jsx`
- Step container: added `role="list"`.
- Each step label: added `role="listitem"` and `aria-label="Step {i+1} of {STEPS.length}: {s}"`.

## 6. Account deletion

### `base44/functions/deleteAccount/entry.ts` (new function)
- Authenticated endpoint: deletes the signed-in user's Trip, PackingItem, UnpackFeedback, and LearnedPreference records (looped `deleteMany` by `created_by_id`, batched until `has_more` is false), then deletes the User record.
- **Important ordering fix found in testing:** the User record is deleted *first*; if that's refused (e.g. the app owner cannot be deleted), the function aborts with 400 **before touching any data**. (The first version wiped the caller's data before the owner check fired — do not reorder back.)

### `src/pages/Settings.jsx`
- "Delete account" button + `AlertDialog` confirmation ("permanently deletes… can't be undone") → invokes `deleteAccount`, then `logout()`. Destructive-styled action, `deleting` state, error toast on failure.

## 7. Navigation refactor (nested screens)

- `src/pages/TripDetail.jsx`, `src/pages/Unpack.jsx`, `src/pages/NewTrip.jsx`: programmatic navigation switched to `useNavigate` (replacing link-based nav) so back/forward works correctly with the new tab stack.

## 8. Unpack feedback rescoping & extra items (earlier today)

### `base44/entities/UnpackFeedback.jsonc`
- Added `is_extra` (boolean, default false) and `extra_reason` (enum: `forgot_to_pack` | `bought_for_fun` | `other`).

### `src/lib/categories.jsx`
- Added `TRACKED_CATEGORIES` (clothing, shoes, accessories, toiletries) — unpack feedback only records these.
- Trip timing utilities: `tripDayNumber()`, `getTripPhase()` (packing / active / return_ready / unpacked), used by TripCard, TripDetail, ActiveTripPanel.

### `src/components/packing/ExtraItemLog.jsx` (new)
- Log items packed/bought outside the generated list (name + reason), stored as `UnpackFeedback` with `is_extra: true`.

### `src/pages/Unpack.jsx`
- Only tracked categories appear in the unpack flow; extra-item logging integrated.

### `src/components/ActiveTripPanel.jsx`
- Integrated `ExtraItemLog` so extras can be logged mid-trip.

### `src/components/TripCard.jsx`
- Shows "Day X of Y" badge for active trips.

### `base44/functions/unpackInsights/entry.ts`
- Extra items (`is_extra`) are now included in the insight-generation prompt.

## 9. Trip extension override

### `src/pages/TripDetail.jsx`
- "Still traveling? Extend trip" flow on `return_ready` phase: inline date picker → `Trip.update(id, { end_date })` — covers late returns before unpacking.

---

## Files touched (quick list)

| File | Change |
|---|---|
| `src/App.jsx` | ThemeProvider, page transitions, lazy routes |
| `src/index.css` | Dark tokens, safe-area/overscroll utilities, fonts |
| `tailwind.config.js` | `darkMode: ["class"]`, sidebar tokens |
| `index.html` | `viewport-fit=cover` |
| `src/components/Layout.jsx` | Tab bar + per-tab path tracking |
| `src/components/BottomTabBar.jsx` | NEW → stack preservation |
| `src/components/PullToRefresh.jsx` | NEW |
| `src/components/packing/ExtraItemLog.jsx` | NEW |
| `src/components/ActiveTripPanel.jsx` | Extra-item log integration |
| `src/components/TripCard.jsx` | Day badges, phase logic |
| `src/components/packing/PackingList.jsx` | Tap targets |
| `src/components/packing/AddItemForm.jsx` | Drawer for category selection |
| `src/pages/Home.jsx` | Pull-to-refresh |
| `src/pages/TripDetail.jsx` | Pull-to-refresh, extend-trip, useNavigate |
| `src/pages/Unpack.jsx` | Tracked categories, extras, useNavigate |
| `src/pages/NewTrip.jsx` | Step a11y, useNavigate |
| `src/pages/Settings.jsx` | Delete account, pull-to-refresh |
| `src/lib/categories.jsx` | TRACKED_CATEGORIES, trip phase utils |
| `base44/entities/UnpackFeedback.jsonc` | `is_extra`, `extra_reason` |
| `base44/functions/deleteAccount/entry.ts` | NEW |
| `base44/functions/unpackInsights/entry.ts` | Extras in insights |

## Test-data note
The first `deleteAccount` test wiped the app owner's trip data (owner check fired too late); the Lisbon test trip (active, Oct 3 → Oct 9, 10 packing items, `trip_id: 6ac413cb4ffbd1f7259b900f`) was recreated afterwards. If your local DB differs, that's why.