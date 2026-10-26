import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SEEDS = [
  ['nice dinner', 'Nice dinner'],
  ['hiking', 'Hiking'],
  ['biking', 'Biking'],
  ['walking around the city', 'City walking'],
  ['lounging by the pool or beach', 'Pool or beach'],
  ['sightseeing and museums', 'Sightseeing'],
  ['nightlife', 'Nightlife'],
  ['business meetings', 'Business meetings'],
  ['gym or workout', 'Gym / workout'],
  ['running', 'Running'],
  ['skiing or snow sports', 'Skiing / snow'],
  ['working remotely', 'Working remotely']
];

const labelFor = (id) => id.replace(/\b\w/g, (c) => c.toUpperCase());

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const trips = await base44.entities.Trip.filter({ created_by_id: user.id }, '-created_date', 100);

    // Count how often each activity shows up across this traveler's trips
    const counts = new Map();
    for (const trip of trips || []) {
      for (const activity of trip.activities || []) {
        const id = String(activity).slice(0, 60).trim().toLowerCase();
        if (id) counts.set(id, (counts.get(id) || 0) + 1);
      }
    }

    const tripCount = (trips || []).length;
    const seedIds = new Set(SEEDS.map((s) => s[0]));
    const tags = [];

    // Starter tags stay until the traveler has real history; after 3 trips,
    // unused starters drop off and keep only proven ones.
    for (const [id, label] of SEEDS) {
      const count = counts.get(id) || 0;
      if (tripCount < 3 || count > 0) tags.push({ id, label, count });
    }

    // Custom tags the traveler added that recur become part of the mix
    for (const [id, count] of counts) {
      if (!seedIds.has(id) && count >= 2) tags.push({ id, label: labelFor(id), count });
    }

    tags.sort((a, b) => b.count - a.count);

    return Response.json({ tags: tags.slice(0, 16) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}