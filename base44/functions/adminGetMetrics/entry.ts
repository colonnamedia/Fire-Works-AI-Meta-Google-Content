import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Admin-only: returns platform-wide summary metrics and filterable user data.
// Query params (in body): { search, planFilter, statusFilter, limit }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { search, planFilter, statusFilter, limit = 100 } = body;

    // Fetch all data in parallel
    const [users, subscriptions, usageCounters, entries, billingEvents, activityLogs] = await Promise.all([
      base44.asServiceRole.entities.User.list('-created_date', 500),
      base44.asServiceRole.entities.Subscription.list('-created_date', 500),
      base44.asServiceRole.entities.UsageCounter.list('-created_date', 500),
      base44.asServiceRole.entities.AdIdeaEntry.list('-created_date', 1000),
      base44.asServiceRole.entities.BillingEvent.list('-created_date', 500),
      base44.asServiceRole.entities.ActivityLog.list('-created_date', 200)
    ]);

    // Summary metrics
    const now = new Date();
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const totalOverage = billingEvents
      .filter(e => e.type === 'overage_charge' && e.status !== 'refunded')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const planDistribution = { meta: 0, google: 0, both: 0 };
    activeSubscriptions.forEach(s => { if (planDistribution[s.plan_type] !== undefined) planDistribution[s.plan_type]++; });

    // Enrich user data
    let enriched = users.map(u => {
      const userSubs = subscriptions.filter(s => s.user_id === u.id);
      const sub = userSubs.find(s => s.status === 'active') || userSubs[0] || null;

      const userUsages = usageCounters.filter(c => c.user_id === u.id);
      const usage = userUsages.find(c => {
        const start = new Date(c.billing_period_start);
        const end = new Date(c.billing_period_end);
        return now >= start && now <= end;
      }) || userUsages[userUsages.length - 1] || null;

      const userEntries = entries.filter(e => e.user_id === u.id);
      const userOverage = billingEvents
        .filter(e => e.user_id === u.id && e.type === 'overage_charge')
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      return {
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        created_date: u.created_date,
        subscription: sub ? {
          id: sub.id,
          status: sub.status,
          plan_type: sub.plan_type,
          plan_name: sub.plan_name,
          monthly_price: sub.monthly_price,
          billing_period_end: sub.billing_period_end
        } : null,
        usage: usage ? {
          included_entries_used: usage.included_entries_used,
          included_entries_remaining: usage.included_entries_remaining,
          overage_entries_used: usage.overage_entries_used,
          overage_amount_accrued: usage.overage_amount_accrued
        } : null,
        totalEntries: userEntries.length,
        totalOverage: userOverage
      };
    });

    // Filtering
    if (search) {
      const q = search.toLowerCase();
      enriched = enriched.filter(u =>
        u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q)
      );
    }
    if (planFilter && planFilter !== 'all') {
      enriched = enriched.filter(u => u.subscription?.plan_type === planFilter);
    }
    if (statusFilter === 'active') {
      enriched = enriched.filter(u => u.subscription?.status === 'active');
    } else if (statusFilter === 'inactive') {
      enriched = enriched.filter(u => !u.subscription || u.subscription.status !== 'active');
    } else if (statusFilter === 'high_usage') {
      enriched = enriched.filter(u => (u.usage?.overage_entries_used || 0) > 0);
    }

    // Sort by most active
    enriched.sort((a, b) => b.totalEntries - a.totalEntries);

    // Most active users
    const topUsers = [...enriched].slice(0, 10);

    return Response.json({
      metrics: {
        totalUsers: users.length,
        activeSubscriptions: activeSubscriptions.length,
        totalGenerations: entries.length,
        totalOverage: Math.round(totalOverage * 100) / 100,
        planDistribution,
        recentActivityCount: activityLogs.length
      },
      users: enriched.slice(0, limit),
      topUsers,
      recentActivity: activityLogs.slice(0, 20),
      allEntries: entries.map(e => ({ id: e.id, platform_type: e.platform_type, goal: e.goal, business_name: e.business_name, created_date: e.created_date, user_id: e.user_id }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});