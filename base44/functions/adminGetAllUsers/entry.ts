import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const users = await base44.asServiceRole.entities.User.list();
    const subscriptions = await base44.asServiceRole.entities.Subscription.list();
    const usageCounters = await base44.asServiceRole.entities.UsageCounter.list();
    const entries = await base44.asServiceRole.entities.AdIdeaEntry.list();

    // Enrich user data
    const enriched = users.map(u => {
      const sub = subscriptions.find(s => s.user_id === u.id);
      const now = new Date();
      const usages = usageCounters.filter(c => c.user_id === u.id);
      const usage = usages.find(c => {
        const start = new Date(c.billing_period_start);
        const end = new Date(c.billing_period_end);
        return now >= start && now <= end;
      }) || usages[usages.length - 1] || null;

      const userEntries = entries.filter(e => e.user_id === u.id);

      return {
        ...u,
        subscription: sub || null,
        usage: usage || null,
        totalEntries: userEntries.length
      };
    });

    return Response.json({ users: enriched });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});