import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Manage collections and tags for the current user.
// Body: { action, collectionId?, name?, description?, color?, entryId?, tagName?, tagColor? }
// Actions: create_collection, delete_collection, add_to_collection, remove_from_collection,
//          create_tag, delete_tag, tag_entry, untag_entry

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, collectionId, tagId, name, description, color, entryId, tagName, tagColor } = body;

    if (action === 'create_collection') {
      const existing = await base44.asServiceRole.entities.Collection.filter({ user_id: user.id, name });
      if (existing.length > 0) {
        return Response.json({ error: 'A collection with this name already exists' }, { status: 409 });
      }
      const col = await base44.asServiceRole.entities.Collection.create({
        user_id: user.id, name, description: description || '', color: color || null, entry_ids: []
      });
      await base44.asServiceRole.entities.ActivityLog.create({
        actor_user_id: user.id, action_type: 'collection_created',
        details: `Created collection: ${name}`, metadata: { collection_id: col.id }, status: 'success'
      });
      return Response.json({ collection: col });
    }

    if (action === 'delete_collection') {
      const cols = await base44.asServiceRole.entities.Collection.filter({ id: collectionId, user_id: user.id });
      if (!cols.length) return Response.json({ error: 'Not found' }, { status: 404 });
      await base44.asServiceRole.entities.Collection.delete(collectionId);
      return Response.json({ success: true });
    }

    if (action === 'add_to_collection') {
      const cols = await base44.asServiceRole.entities.Collection.filter({ id: collectionId, user_id: user.id });
      if (!cols.length) return Response.json({ error: 'Not found' }, { status: 404 });
      const col = cols[0];
      const current = col.entry_ids || [];
      if (!current.includes(entryId)) {
        await base44.asServiceRole.entities.Collection.update(collectionId, {
          entry_ids: [...current, entryId]
        });
      }
      return Response.json({ success: true });
    }

    if (action === 'remove_from_collection') {
      const cols = await base44.asServiceRole.entities.Collection.filter({ id: collectionId, user_id: user.id });
      if (!cols.length) return Response.json({ error: 'Not found' }, { status: 404 });
      const col = cols[0];
      await base44.asServiceRole.entities.Collection.update(collectionId, {
        entry_ids: (col.entry_ids || []).filter(id => id !== entryId)
      });
      return Response.json({ success: true });
    }

    if (action === 'create_tag') {
      const existing = await base44.asServiceRole.entities.Tag.filter({ user_id: user.id, name: tagName });
      if (existing.length > 0) {
        return Response.json({ tag: existing[0] }); // idempotent
      }
      const tag = await base44.asServiceRole.entities.Tag.create({
        user_id: user.id, name: tagName, color: tagColor || '#6366f1', entry_ids: []
      });
      await base44.asServiceRole.entities.ActivityLog.create({
        actor_user_id: user.id, action_type: 'tag_created',
        details: `Created tag: ${tagName}`, metadata: { tag_id: tag.id }, status: 'success'
      });
      return Response.json({ tag });
    }

    if (action === 'delete_tag') {
      const tags = await base44.asServiceRole.entities.Tag.filter({ id: tagId, user_id: user.id });
      if (!tags.length) return Response.json({ error: 'Not found' }, { status: 404 });
      await base44.asServiceRole.entities.Tag.delete(tagId);
      return Response.json({ success: true });
    }

    if (action === 'tag_entry') {
      const tags = await base44.asServiceRole.entities.Tag.filter({ id: tagId, user_id: user.id });
      if (!tags.length) return Response.json({ error: 'Tag not found' }, { status: 404 });
      const tag = tags[0];
      const current = tag.entry_ids || [];
      if (!current.includes(entryId)) {
        await base44.asServiceRole.entities.Tag.update(tagId, { entry_ids: [...current, entryId] });
      }
      return Response.json({ success: true });
    }

    if (action === 'untag_entry') {
      const tags = await base44.asServiceRole.entities.Tag.filter({ id: tagId, user_id: user.id });
      if (!tags.length) return Response.json({ error: 'Tag not found' }, { status: 404 });
      const tag = tags[0];
      await base44.asServiceRole.entities.Tag.update(tagId, {
        entry_ids: (tag.entry_ids || []).filter(id => id !== entryId)
      });
      return Response.json({ success: true });
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});