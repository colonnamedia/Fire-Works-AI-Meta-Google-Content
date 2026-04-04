import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Returns a user's full history: entries, versions, collections, tags, business profiles, billing events.
// Body: { limit?, includeArchived? }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 50;
    const includeArchived = body.includeArchived || false;

    // Fetch in parallel
    const [entries, versions, collections, tags, profiles, billingEvents, activityLogs] = await Promise.all([
      base44.asServiceRole.entities.AdIdeaEntry.filter({ user_id: user.id }, '-created_date', limit),
      base44.asServiceRole.entities.GenerationVersion.filter({ user_id: user.id }, '-created_date', 100),
      base44.asServiceRole.entities.Collection.filter({ user_id: user.id }),
      base44.asServiceRole.entities.Tag.filter({ user_id: user.id }),
      base44.asServiceRole.entities.BusinessProfile.filter({ created_by: user.email }),
      base44.asServiceRole.entities.BillingEvent.filter({ user_id: user.id }, '-created_date', 50),
      base44.asServiceRole.entities.ActivityLog.filter({ actor_user_id: user.id }, '-created_date', 30)
    ]);

    // Enrich entries with version info
    const enrichedEntries = entries
      .filter(e => includeArchived || e.status !== 'archived')
      .map(entry => {
        const entryVersions = versions.filter(v => v.parent_entry_id === entry.id || v.new_entry_id === entry.id);
        const entryTags = tags.filter(t => (t.entry_ids || []).includes(entry.id)).map(t => t.name);
        const entryCollections = collections.filter(c => (c.entry_ids || []).includes(entry.id)).map(c => c.name);
        return { ...entry, versions: entryVersions, tags: entryTags, collections: entryCollections };
      });

    // Stats
    const totalGenerated = entries.filter(e => e.status === 'generated').length;
    const totalFavorites = entries.filter(e => e.is_favorite).length;
    const totalOverage = entries.filter(e => e.was_overage_charge).length;
    const platformBreakdown = { meta: 0, google: 0, both: 0 };
    entries.forEach(e => { if (platformBreakdown[e.platform_type] !== undefined) platformBreakdown[e.platform_type]++; });

    return Response.json({
      entries: enrichedEntries,
      collections,
      tags,
      businessProfiles: profiles,
      billingEvents,
      recentActivity: activityLogs,
      stats: {
        totalEntries: entries.length,
        totalGenerated,
        totalFavorites,
        totalVersions: versions.length,
        totalOverageEntries: totalOverage,
        platformBreakdown
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});