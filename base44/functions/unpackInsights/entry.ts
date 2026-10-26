import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const responseSchema = {
  type: "object",
  properties: {
    insights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          insight: { type: "string" },
          category: { type: "string" }
        },
        required: ["insight", "category"]
      }
    }
  },
  required: ["insights"]
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const tripId = String(body.trip_id || '').slice(0, 64);
    if (!tripId) return Response.json({ error: 'trip_id is required' }, { status: 400 });

    const feedback = await base44.entities.UnpackFeedback.filter({ trip_id: tripId });
    const meaningful = (feedback || []).filter(f => f.is_extra || (f.quantity_unused || 0) > 0 || (f.quantity_repeated || 0) > 0);
    if (!meaningful.length) return Response.json({ insights: [] });

    // Notes added after the first pass replace that trip's earlier lessons.
    if (body.replace === true) {
      await base44.entities.LearnedPreference.deleteMany({ created_trip_id: tripId });
    }

    let existing = [];
    try {
      const prefs = await base44.entities.LearnedPreference.list('-created_date', 30);
      existing = (prefs || []).map(p => p.insight);
    } catch (e) {
      existing = [];
    }

    const lines = meaningful.map(f => {
      if (f.is_extra) {
        const why = f.extra_reason === 'forgot_to_pack'
          ? 'they forgot to pack it and had to get it during the trip'
          : f.extra_reason === 'bought_for_fun'
            ? 'they bought it for fun during the trip, not out of necessity'
            : 'they acquired it during the trip';
        return `- EXTRA ITEM: ${f.item_name} — ${why}${f.reason ? '. Traveler note: "' + f.reason + '"' : ''}`;
      }
      return `- ${f.item_name} (${f.category}${f.is_sports ? ', sports' : ''}): packed ${f.packed_quantity}, didn't use ${f.quantity_unused}, rewore ${f.quantity_repeated} extra times${f.reason ? '. Traveler note: "' + f.reason + '"' : ''}`;
    }).join('\n');

    const prompt = `A frequent traveler just unpacked after a trip and reported what they actually packed vs. wore.

ITEM FEEDBACK:
${lines}

WHAT WE ALREADY LEARNED ABOUT THIS TRAVELER (do not restate these; refine or add):
${existing.length ? existing.map(l => '- ' + l).join('\n') : '- (nothing yet)'}

EXTRA ITEM entries mean the traveler acquired something mid-trip. Read them together with the unused/rewore counts on similar items and reason about the ambiguity yourself — e.g. an unused jacket plus a hoodie bought for fun likely means they run warm or prefer buying fresh layers locally, while the same kind of item forgotten to pack on repeat trips is a recurring gap that should become a default suggestion.

Derive 1-6 durable, generalizable insights about how THIS traveler packs and wears clothes — things that should silently change future packing suggestions. Be specific and actionable, e.g. "Prefers short-sleeve over long-sleeve even in mild weather — pack 2 extra short-sleeve shirts and skip long-sleeve", "Overpacks jeans: 2 is enough for a 7-day trip", "Never wears more than one dressy outfit — one set is enough", "Repeated athletic t-shirts — pack fewer, they rewear them".

Each insight: a short standalone sentence the packing assistant can apply to any future trip, and a category: one of "clothing", "shoes", "accessories", "toiletries", "electronics", "sports_gear", "nutrition", "general".

Return ONLY the JSON.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: responseSchema
    });

    const insights = (result && result.insights) ? result.insights.slice(0, 6) : [];
    let created = 0;
    if (insights.length) {
      const records = insights.map(i => ({
        insight: String(i.insight || '').slice(0, 400),
        category: String(i.category || 'general').slice(0, 40),
        created_trip_id: tripId
      })).filter(r => r.insight);
      if (records.length) {
        await base44.entities.LearnedPreference.bulkCreate(records);
        created = records.length;
      }
    }

    return Response.json({ created, insights });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}