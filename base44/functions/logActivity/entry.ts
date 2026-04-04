import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Utility: log an activity event. Can be called internally or from frontend.
// Body: { action_type, details, target_user_id?, metadata?, status? }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action_type, details, target_user_id, metadata, status } = body;

    if (!action_type) {
      return Response.json({ error: 'action_type is required' }, { status: 400 });
    }

    const log = await base44.asServiceRole.entities.ActivityLog.create({
      actor_user_id: user.id,
      target_user_id: target_user_id || null,
      action_type,
      details: details || null,
      metadata: metadata || null,
      status: status || 'success'
    });

    return Response.json({ log });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});