import { base44 } from "@/api/base44Client";

// Local cache + outbox: trips and packing lists can be read and edited offline,
// then synced back to the database once the connection returns.

const CACHE = "packsmart.cache.";
const OUTBOX = "packsmart.outbox";

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — the app keeps working from memory */
  }
};

export const cacheTrips = (trips) => writeJSON(`${CACHE}trips`, trips);
export const readCachedTrips = () => readJSON(`${CACHE}trips`, null);

export const cacheTrip = (trip) => {
  if (trip?.id) writeJSON(`${CACHE}trip.${trip.id}`, trip);
};
export const readCachedTrip = (tripId) => readJSON(`${CACHE}trip.${tripId}`, null);

export const cacheItems = (tripId, items) => writeJSON(`${CACHE}items.${tripId}`, items);
export const readCachedItems = (tripId) => readJSON(`${CACHE}items.${tripId}`, null);

export const readOutbox = () => readJSON(OUTBOX, []);

const writeOutbox = (ops) => {
  writeJSON(OUTBOX, ops);
  window.dispatchEvent(new Event("packsmart:queued"));
};

export const queueOp = (op) => writeOutbox([...readOutbox(), op]);
export const pendingCount = () => readOutbox().length;
export const makeTempId = () => `tmp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

let flushing = null;

export async function flushOutbox() {
  if (flushing) return flushing;
  if (!navigator.onLine || readOutbox().length === 0) {
    return { synced: 0, pending: readOutbox().length };
  }

  flushing = (async () => {
    const ops = readOutbox();
    const cancelledTemps = new Set(
      ops.filter((op) => op.type === "packing_delete" && String(op.id).startsWith("tmp_")).map((op) => op.id)
    );
    const idMap = {};
    const remaining = [];
    let synced = 0;

    for (const op of ops) {
      const targetId = idMap[op.id] || op.id;
      try {
        if (op.type === "packing_create") {
          if (cancelledTemps.has(op.tempId)) continue;
          const created = await base44.entities.PackingItem.create(op.data);
          idMap[op.tempId] = created.id;
        } else if (op.type === "packing_update") {
          if (String(targetId).startsWith("tmp_")) throw new Error("waiting for the item to be created");
          await base44.entities.PackingItem.update(targetId, op.data);
        } else if (op.type === "packing_delete") {
          if (String(targetId).startsWith("tmp_")) continue;
          await base44.entities.PackingItem.delete(targetId);
        }
        synced += 1;
      } catch {
        remaining.push(op);
      }
    }

    writeOutbox(remaining);
    if (synced > 0) window.dispatchEvent(new Event("packsmart:synced"));
    return { synced, pending: remaining.length };
  })();

  try {
    return await flushing;
  } finally {
    flushing = null;
  }
}