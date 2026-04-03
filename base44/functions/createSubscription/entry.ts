import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Check for existing active subscription
    const existing = await base44.asServiceRole.entities.Subscription.filter({ user_id: user.id });
    const activeSub = existing.find(s => s.status === 'active');
    if (activeSub) {
      return Response.json({ subscription: activeSub, message: 'Already subscribed' });
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // Create subscription
    const subscription = await base44.asServiceRole.entities.Subscription.create({
      user_id: user.id,
      plan_name: 'Starter Plan',
      monthly_price: 4.99,
      included_entries_per_month: 5,
      overage_price_per_entry: 1.99,
      status: 'active',
      billing_period_start: now.toISOString(),
      billing_period_end: periodEnd.toISOString(),
      auto_renew: true,
      payment_provider: 'manual'
    });

    // Create initial usage counter
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

    // Log billing event
    await base44.asServiceRole.entities.BillingEvent.create({
      user_id: user.id,
      subscription_id: subscription.id,
      type: 'subscription_created',
      amount: 4.99,
      status: 'completed',
      billing_period_start: now.toISOString(),
      billing_period_end: periodEnd.toISOString(),
      notes: 'Starter Plan subscription created'
    });

    return Response.json({ subscription, message: 'Subscription created successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});