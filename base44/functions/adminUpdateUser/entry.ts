import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { targetUserId, action, value, notes } = await req.json();

    if (!targetUserId || !action) {
      return Response.json({ error: 'targetUserId and action are required' }, { status: 400 });
    }

    let result = {};
    let logActionType = action;

    if (action === 'set_role') {
      await base44.asServiceRole.entities.User.update(targetUserId, { role: value });
      result = { updated: 'role', value };
      logActionType = 'role_change';
    } else if (action === 'set_active') {
      await base44.asServiceRole.entities.User.update(targetUserId, { is_active: value });
      result = { updated: 'is_active', value };
      logActionType = value ? 'user_activated' : 'user_deactivated';
    } else if (action === 'adjust_credits') {
      // Find current usage counter
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: targetUserId });
      const sub = subs.find(s => s.status === 'active') || subs[0];
      if (!sub) return Response.json({ error: 'No subscription found for user' }, { status: 404 });

      const now = new Date();
      const usages = await base44.asServiceRole.entities.UsageCounter.filter({ user_id: targetUserId, subscription_id: sub.id });
      const usage = usages.find(u => {
        const start = new Date(u.billing_period_start);
        const end = new Date(u.billing_period_end);
        return now >= start && now <= end;
      }) || usages[usages.length - 1];

      if (!usage) return Response.json({ error: 'No usage counter found' }, { status: 404 });

      const newRemaining = Math.max(0, parseInt(value));
      await base44.asServiceRole.entities.UsageCounter.update(usage.id, {
        included_entries_remaining: newRemaining
      });

      // Log billing event for manual credit
      await base44.asServiceRole.entities.BillingEvent.create({
        user_id: targetUserId,
        subscription_id: sub.id,
        type: 'manual_credit',
        amount: 0,
        status: 'completed',
        notes: notes || `Admin manually set credits to ${newRemaining}`
      });

      result = { updated: 'credits', newRemaining };
      logActionType = 'credit_adjustment';
    } else if (action === 'override_subscription') {
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: targetUserId });
      const sub = subs[0];
      if (!sub) return Response.json({ error: 'No subscription found' }, { status: 404 });
      await base44.asServiceRole.entities.Subscription.update(sub.id, { status: value });
      result = { updated: 'subscription_status', value };
      logActionType = 'subscription_override';
    } else if (action === 'reset_usage') {
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: targetUserId });
      const sub = subs.find(s => s.status === 'active') || subs[0];
      if (!sub) return Response.json({ error: 'No subscription found' }, { status: 404 });

      const now = new Date();
      const usages = await base44.asServiceRole.entities.UsageCounter.filter({ user_id: targetUserId });
      const usage = usages.find(u => {
        const start = new Date(u.billing_period_start);
        const end = new Date(u.billing_period_end);
        return now >= start && now <= end;
      }) || usages[usages.length - 1];

      if (usage) {
        await base44.asServiceRole.entities.UsageCounter.update(usage.id, {
          included_entries_used: 0,
          overage_entries_used: 0,
          included_entries_remaining: 5,
          overage_amount_accrued: 0,
          last_reset_at: now.toISOString()
        });
      }
      result = { updated: 'usage_reset' };
      logActionType = 'manual_reset';
    }

    // Log admin action
    await base44.asServiceRole.entities.AdminLog.create({
      admin_user_id: user.id,
      action_type: logActionType,
      target_user_id: targetUserId,
      notes: notes || `Admin action: ${action} = ${value}`,
      after_value: String(value)
    });

    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});