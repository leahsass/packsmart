import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const CATEGORIES = ["clothing", "shoes", "accessories", "toiletries", "electronics", "documents", "sports_gear", "nutrition", "other"];

const responseSchema = {
  type: "object",
  properties: {
    weather: {
      type: "object",
      properties: {
        summary: { type: "string" },
        high_c: { type: "number" },
        low_c: { type: "number" },
        conditions: { type: "string" }
      },
      required: ["summary", "high_c", "low_c", "conditions"]
    },
    is_international: { type: "boolean" },
    adapter_type: { type: "string" },
    voltage: { type: "string" },
    time_difference: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          category: { type: "string", enum: CATEGORIES },
          quantity: { type: "integer" },
          checked_bag_only: { type: "boolean" },
          is_sports: { type: "boolean" },
          note: { type: "string" }
        },
        required: ["name", "category", "quantity", "checked_bag_only", "is_sports"]
      }
    }
  },
  required: ["weather", "is_international", "adapter_type", "voltage", "time_difference", "items"]
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const destination = String(body.destination || '').slice(0, 120).trim();
    const country = String(body.country || '').slice(0, 80).trim();
    const startDate = String(body.start_date || '').slice(0, 10);
    const endDate = String(body.end_date || '').slice(0, 10);
    const homeCountry = String(body.home_country || '').slice(0, 80).trim();
    const homeLocation = String(body.home_location || '').slice(0, 120).trim();
    const bagType = ['carry_on', 'suitcase', 'bike_case'].includes(body.bag_type) ? body.bag_type : 'carry_on';
    const laundry = Boolean(body.laundry);
    const sportsEvent = Boolean(body.sports_event);
    const withBike = bagType === 'bike_case' || Boolean(body.traveling_with_bike);
    const activities = Array.isArray(body.activities) ? body.activities.slice(0, 15).map(a => String(a).slice(0, 60)) : [];
    const tripPurpose = String(body.trip_purpose || '').slice(0, 600).trim();
    const eventDetails = String(body.event_details || '').slice(0, 600).trim();
    const closetItems = Array.isArray(body.closet_items)
      ? body.closet_items.slice(0, 20).map(c => ({
          name: String(c?.name || '').slice(0, 80).trim(),
          category: String(c?.category || 'clothing').slice(0, 30),
          color: String(c?.color || '').slice(0, 40),
          warmth: String(c?.warmth || '').slice(0, 20),
          formality: String(c?.formality || '').slice(0, 30)
        })).filter(c => c.name)
      : [];

    if (!destination || !country || !startDate || !endDate) {
      return Response.json({ error: 'destination, country, start_date and end_date are required' }, { status: 400 });
    }

    const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1);

    let learned = [];
    try {
      const prefs = await base44.entities.LearnedPreference.list('-created_date', 30);
      learned = (prefs || []).map(p => p.insight);
    } catch (e) {
      learned = [];
    }

    const luggageLine = bagType === 'carry_on'
      ? 'Carry-on ONLY (personal item + cabin suitcase). No checked bag.'
      : bagType === 'bike_case'
        ? 'Carry-on PLUS a checked bike case (traveling with their bike).'
        : 'Carry-on PLUS one checked regular suitcase.';

    const sportsLine = (withBike || sportsEvent)
      ? `Sports gear IS needed${withBike ? ' (traveling with their bike)' : ''}${sportsEvent ? ' (packing for an athletic event/race)' : ''}: include cycling/athletic clothing for each riding or event day (jerseys, bibs, socks, gloves), athletic nutrition (energy gels, bars, electrolyte tabs), safety gear (helmet, lights, reflective wear) and bike tools/spares — anything with blades or restricted must be checked_bag_only=true. Mark ALL sports items is_sports=true: they are counted SEPARATELY from regular clothes. If event details are provided, extract concrete needs from them (discipline, distance, number of event days, kit changes, dress code) and tailor the sports gear, nutrition and clothing precisely to that event.`
      : 'No sports gear needed: set is_sports=false on every item.';

    const closetLine = closetItems.length
      ? closetItems.map(c => `- ${c.name} (${[c.category, c.color, c.warmth && `${c.warmth} weight`, c.formality].filter(Boolean).join(', ')})`).join('\n')
      : '- (none selected — recommend everything fresh)';

    const prompt = `You are an expert packing assistant for a frequent traveler who wants to look put-together without overpacking.

TRIP DETAILS
- Destination: ${destination}, ${country}
- Dates: ${startDate} to ${endDate} (${days} days)
- Traveler's home: ${homeLocation || homeCountry}${homeCountry && homeLocation && homeLocation !== homeCountry ? ` (country: ${homeCountry})` : ''}
- Planned activities: ${activities.length ? activities.join(', ') : 'general travel'}
- Trip purpose, in the traveler's own words: ${tripPurpose || 'not specified'}${eventDetails ? `
- Event details, in the traveler's own words: ${eventDetails}` : ''}
- Luggage: ${luggageLine}
- Can do laundry during the trip: ${laundry ? 'YES, at least one load' : 'no'}
- ${sportsLine}

PIECES THE TRAVELER ALREADY OWNS AND CHOSE TO PACK (from their own closet):
${closetLine}

LEARNED PREFERENCES from this traveler's past-trip feedback — silently apply these to quantities and specific item choices:
${learned.length ? learned.map(l => '- ' + l).join('\n') : '- (none yet, this is their first tracked trip)'}

YOUR TASK
1. Use web search to find the real weather forecast for ${destination} between ${startDate} and ${endDate}. If dates are beyond reliable forecast range, rely on seasonal climate norms for that place and time of year. Capture typical daytime high and nighttime low in Celsius and the overall conditions.
2. Build a complete packing list that follows ALL the rules below, then return it as JSON.

RULES
- TSA carry-on compliance is mandatory. The traveler ALWAYS has a carry-on. If luggage is carry-on ONLY, include ONLY items legal in the cabin: toiletries/aerosols must be travel size (max 100ml, quart-size bag), no knives, no multitools, no flammables. If they also have a CHECKED bag, you may include cabin-forbidden items (full-size toiletries over 100ml, bike tools with blades, trekking poles, etc.) but MUST set checked_bag_only=true on exactly those items.
- Quantities: give a specific number for EVERY item (e.g. 4 short-sleeve shirts, 2 long bottoms, 1 pair sneakers). Use item names specific enough to act on ("Short-sleeve shirts", "Dressy outfit for dinner", "Rain jacket") rather than vague categories.
- Balance: never overpack, but enough outfits and options to dress well for the planned activities. If laundry is available, reduce clothing by roughly one third since they can rewash.
- Activities: include activity-specific items (nice dinner -> one dressy outfit and shoes; hiking -> hiking boots, layers, daypack; biking/city walking -> comfortable shoes; pool/beach -> swimwear and sunscreen; business -> polished outfits).
- Closet pieces: every piece listed above is one they actually own and chose to bring. Include each one as its own item using its exact name, and never add a generic duplicate of the same garment (if they picked "Midwash skinny jeans", do not also add "Jeans"). Use the color, warmth and formality to decide quantity and how it pairs with the rest.
- Trip purpose: if the traveler described their purpose in their own words, weigh it heavily — it is the most reliable signal of what they will actually do. Extract concrete needs from it (events, dress codes, gear, pace of the trip) and add or trim items accordingly.
- Weather: choose clothing weights and layers that fit the forecast (warm/cold/rain).
- Sports gear counts separately from regular clothing (is_sports=true).
- Electronics: charging cables for their devices, power bank, and the correct power adapter for ${country} — name the plug type in the item (e.g. "Power adapter (Type C, 2-pin)") — plus voltage info for the country.
- Documents: passport (and entry docs) ONLY if ${country} differs from the traveler's home (${homeLocation || homeCountry}); set is_international accordingly.
- Time zone: state the current time difference between ${destination} and the traveler's home (${homeLocation || homeCountry}), accounting for daylight saving — e.g. "5 hours ahead of home" or "Same time zone as home".
- Toiletries: a complete personal bathroom kit.

Return ONLY the JSON.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_1_pro',
      response_json_schema: responseSchema
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}