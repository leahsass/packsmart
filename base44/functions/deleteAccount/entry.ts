import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const service = base44.asServiceRole;

    // Delete the user record first: if this is refused (e.g. the app owner),
    // abort before touching any of their data.
    try {
      await service.entities.User.delete(user.id);
    } catch (err) {
      return Response.json({ error: err.message }, { status: 400 });
    }

    const owned = [
      service.entities.Trip,
      service.entities.PackingItem,
      service.entities.UnpackFeedback,
      service.entities.LearnedPreference
    ];

    for (const entity of owned) {
      let hasMore = true;
      while (hasMore) {
        const res = await entity.deleteMany({ created_by_id: user.id });
        hasMore = !!(res && res.has_more);
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}