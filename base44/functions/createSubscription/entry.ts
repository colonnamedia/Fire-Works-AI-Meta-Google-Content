import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const planType = body.planType || 'meta'; // 'meta', 'google', or 'both'
    const monthlyPrice = planType === 'both' ? 19.99 : 14.99;
    const planNames = { meta: 'Single Platform — Meta', google: 'Single Platform — Google', both: 'Both Platforms — Unlimited' };
    const planName = planNames[planType] || 'Single Platform Plan';

    // Check for existing active subscription
    const existing = await base44.asServiceRole.entities.Subscription.filter({ user_id: user.id });
    const activeSub = existing.find(s => s.status === 'active');
    if (activeSub) {
      // If upgrading plan type, update it
      if (activeSub.plan_type !== planType) {
        const updated = await base44.asServiceRole.entities.Subscription.update(activeSub.id, {
          plan_type: planType,
          plan_name: planName,
          monthly_price: monthlyPrice
        });
        return Response.json({ subscription: updated, message: 'Plan updated successfully' });
      }
      return Response.json({ subscription: activeSub, message: 'Already subscribed' });
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const subscription = await base44.asServiceRole.entities.Subscription.create({
      user_id: user.id,
      plan_name: planName,
      plan_type: planType,
      monthly_price: monthlyPrice,
      included_entries_per_month: 5,
      overage_price_per_entry: 1.99,
      status: 'active',
      billing_period_start: now.toISOString(),
      billing_period_end: periodEnd.toISOString(),
      auto_renew: true,
      payment_provider: 'manual'
    });

    await base44.asServiceRole.entities.UsageCounter.create({
      user_id: user.id,
      subscription_id: subscription.id,
      billing_period_start: now.toISOString(),
      billing_period_end: periodEnd.toISOString(),
      included_entries_used: 0,
      overage_entries_used: 0,
      included_entries_remaining: 5,
      overage_amount_accrued: 0,
      last_reset_at: now.toISOString()
    });

    await base44.asServiceRole.entities.BillingEvent.create({
      user_id: user.id,
      subscription_id: subscription.id,
      type: 'subscription_created',
      amount: monthlyPrice,
      status: 'completed',
      billing_period_start: now.toISOString(),
      billing_period_end: periodEnd.toISOString(),
      notes: `${planName} subscription created`
    });

    // Log activity
    await base44.asServiceRole.entities.ActivityLog.create({
      actor_user_id: user.id,
      action_type: 'subscription_created',
      details: `Created ${planName} at $${monthlyPrice}/month`,
      metadata: { subscription_id: subscription.id, plan_type: planType, price: monthlyPrice },
      status: 'success'
    });

    return Response.json({ subscription, message: 'Subscription created successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});