import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ hasAccess: false, reason: 'not_authenticated' });
    }

    if (user.role === 'admin') {
      return Response.json({ hasAccess: true, reason: 'admin' });
    }

    // Check for active subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({
      user_id: user.id,
      status: 'active'
    });

    if (subs && subs.length > 0) {
      return Response.json({ hasAccess: true, reason: 'subscription' });
    }

    // Check for available credits
    const now = new Date();
    const counters = await base44.asServiceRole.entities.UsageCounter.filter({
      user_id: user.id
    });

    const activeCounter = counters?.find(u => {
      const start = new Date(u.billing_period_start);
      const end = new Date(u.billing_period_end);
      return now >= start && now <= end;
    });

    if (activeCounter && (activeCounter.included_entries_remaining || 0) > 0) {
      return Response.json({ hasAccess: true, reason: 'credits' });
    }

    return Response.json({ hasAccess: false, reason: 'no_entitlement' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});