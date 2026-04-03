import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (user.role === 'admin') {
      return Response.json({
        isAdmin: true,
        subscription: null,
        usage: null,
        canGenerate: true,
        includedRemaining: 999,
        includedUsed: 0,
        overageUsed: 0,
        overageAmount: 0
      });
    }

    // Get subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: user.id });
    const sub = subs.find(s => s.status === 'active') || subs[0] || null;

    // Get usage counter for current period
    let usage = null;
    if (sub) {
      const usages = await base44.asServiceRole.entities.UsageCounter.filter({ user_id: user.id, subscription_id: sub.id });
      // Find counter for current billing period
      const now = new Date();
      usage = usages.find(u => {
        const start = new Date(u.billing_period_start);
        const end = new Date(u.billing_period_end);
        return now >= start && now <= end;
      }) || usages[usages.length - 1] || null;
    }

    const canGenerate = sub?.status === 'active';
    const includedRemaining = usage?.included_entries_remaining ?? 5;
    const includedUsed = usage?.included_entries_used ?? 0;
    const overageUsed = usage?.overage_entries_used ?? 0;
    const overageAmount = usage?.overage_amount_accrued ?? 0;

    return Response.json({
      isAdmin: false,
      subscription: sub,
      usage,
      canGenerate,
      includedRemaining,
      includedUsed,
      overageUsed,
      overageAmount,
      billingPeriodEnd: sub?.billing_period_end || null
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});