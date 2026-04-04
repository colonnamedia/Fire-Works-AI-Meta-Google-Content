import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Admin-only: adjust user credits, subscription status, or role.
// Body: { targetUserId, action: 'adjust_credits' | 'set_role' | 'set_subscription_status' | 'deactivate' | 'activate', value, notes }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, action, value, notes } = body;

    if (!targetUserId || !action) {
      return Response.json({ error: 'targetUserId and action are required' }, { status: 400 });
    }

    let result = {};
    let logDetails = '';

    if (action === 'adjust_credits') {
      // value = number of credits to set (remaining)
      const usages = await base44.asServiceRole.entities.UsageCounter.filter({ user_id: targetUserId });
      const now = new Date();
      const usage = usages.find(u => {
        const start = new Date(u.billing_period_start);
        const end = new Date(u.billing_period_end);
        return now >= start && now <= end;
      }) || usages[usages.length - 1];

      if (!usage) {
        return Response.json({ error: 'No usage counter found for this user' }, { status: 404 });
      }

      const creditValue = parseInt(value, 10);
      result = await base44.asServiceRole.entities.UsageCounter.update(usage.id, {
        included_entries_remaining: creditValue,
        included_entries_used: Math.max(0, 5 - creditValue)
      });

      await base44.asServiceRole.entities.BillingEvent.create({
        user_id: targetUserId,
        type: 'manual_credit',
        amount: 0,
        status: 'completed',
        notes: `Admin ${user.id} manually set credits to ${creditValue}. ${notes || ''}`
      });

      logDetails = `Set credits to ${creditValue} for user ${targetUserId}`;

    } else if (action === 'set_role') {
      // value = 'admin' | 'user'
      result = await base44.asServiceRole.entities.User.update(targetUserId, { role: value });
      logDetails = `Changed role of user ${targetUserId} to ${value}`;

    } else if (action === 'set_subscription_status') {
      // value = 'active' | 'inactive' | 'cancelled'
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: targetUserId });
      const sub = subs.find(s => s.status === 'active') || subs[0];
      if (!sub) return Response.json({ error: 'No subscription found' }, { status: 404 });

      result = await base44.asServiceRole.entities.Subscription.update(sub.id, { status: value });
      logDetails = `Changed subscription status of user ${targetUserId} to ${value}`;

    } else if (action === 'set_plan_type') {
      // value = 'meta' | 'google' | 'both'
      const prices = { meta: 14.99, google: 14.99, both: 19.99 };
      const planNames = { meta: 'Single Platform — Meta', google: 'Single Platform — Google', both: 'Both Platforms — Unlimited' };
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: targetUserId });
      const sub = subs.find(s => s.status === 'active') || subs[0];
      if (!sub) return Response.json({ error: 'No subscription found' }, { status: 404 });

      result = await base44.asServiceRole.entities.Subscription.update(sub.id, {
        plan_type: value,
        plan_name: planNames[value] || value,
        monthly_price: prices[value] || 14.99
      });
      logDetails = `Changed plan type of user ${targetUserId} to ${value}`;

    } else if (action === 'deactivate') {
      result = await base44.asServiceRole.entities.User.update(targetUserId, { role: 'user' });
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: targetUserId });
      const activeSub = subs.find(s => s.status === 'active');
      if (activeSub) {
        await base44.asServiceRole.entities.Subscription.update(activeSub.id, { status: 'inactive' });
      }
      logDetails = `Deactivated user ${targetUserId}`;

    } else {
      return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    // Write audit log
    await base44.asServiceRole.entities.ActivityLog.create({
      actor_user_id: user.id,
      target_user_id: targetUserId,
      action_type: action === 'set_role' ? 'admin_role_changed'
        : action === 'adjust_credits' ? 'admin_credits_adjusted'
        : action === 'deactivate' ? 'user_deactivated'
        : 'admin_subscription_override',
      details: logDetails + (notes ? ` | Notes: ${notes}` : ''),
      metadata: { action, value, notes },
      status: 'success'
    });

    // Write AdminLog for backwards compat
    await base44.asServiceRole.entities.AdminLog.create({
      admin_user_id: user.id,
      action_type: action === 'set_role' ? 'role_change'
        : action === 'adjust_credits' ? 'credit_adjustment'
        : action === 'deactivate' ? 'user_deactivated'
        : 'subscription_override',
      target_user_id: targetUserId,
      notes: logDetails,
      after_value: String(value)
    });

    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});