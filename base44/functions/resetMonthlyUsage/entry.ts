import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// This function is called by a scheduled automation to reset monthly usage
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Use service role for scheduled tasks
    const now = new Date();

    // Get all active subscriptions where billing period has ended
    const allSubs = await base44.asServiceRole.entities.Subscription.list();
    const expiredSubs = allSubs.filter(sub => {
      if (sub.status !== 'active') return false;
      const periodEnd = new Date(sub.billing_period_end);
      return now > periodEnd;
    });

    let resetCount = 0;

    for (const sub of expiredSubs) {
      // Calculate new period
      const oldEnd = new Date(sub.billing_period_end);
      const newStart = new Date(oldEnd);
      const newEnd = new Date(oldEnd);
      newEnd.setMonth(newEnd.getMonth() + 1);

      // Update subscription billing period
      await base44.asServiceRole.entities.Subscription.update(sub.id, {
        billing_period_start: newStart.toISOString(),
        billing_period_end: newEnd.toISOString()
      });

      // Get current usage counter for this period
      const usages = await base44.asServiceRole.entities.UsageCounter.filter({ subscription_id: sub.id });
      const oldUsage = usages.find(u => {
        const start = new Date(u.billing_period_start);
        const end = new Date(u.billing_period_end);
        return now >= start && now <= end;
      }) || usages[usages.length - 1];

      // Create new usage counter for new period
      await base44.asServiceRole.entities.UsageCounter.create({
        user_id: sub.user_id,
        subscription_id: sub.id,
        billing_period_start: newStart.toISOString(),
        billing_period_end: newEnd.toISOString(),
        included_entries_used: 0,
        overage_entries_used: 0,
        included_entries_remaining: 5,
        overage_amount_accrued: 0,
        last_reset_at: now.toISOString()
      });

      // Log billing event for renewal
      await base44.asServiceRole.entities.BillingEvent.create({
        user_id: sub.user_id,
        subscription_id: sub.id,
        type: 'subscription_renewed',
        amount: 4.99,
        status: 'completed',
        billing_period_start: newStart.toISOString(),
        billing_period_end: newEnd.toISOString(),
        notes: `Monthly renewal. Previous overage: $${oldUsage?.overage_amount_accrued?.toFixed(2) || '0.00'}`
      });

      resetCount++;
    }

    return Response.json({ success: true, resetCount, processedAt: now.toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});