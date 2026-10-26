import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const query = String(body.query || '').trim().slice(0, 100);
    if (query.length < 3) return Response.json({ results: [] });

    const url =
      'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) +
      '&format=jsonv2&addressdetails=1&limit=5&accept-language=en';
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Packlight/1.0 (packing-assistant-app)', 'Accept-Language': 'en' }
    });
    if (!resp.ok) return Response.json({ results: [] });
    const data = await resp.json();

    const results = (Array.isArray(data) ? data : [])
      .map((place) => ({
        id: place.place_id,
        label: String(place.display_name || '').slice(0, 140),
        country: place.address && place.address.country ? String(place.address.country).slice(0, 80) : ''
      }))
      .filter((r) => r.label);

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}