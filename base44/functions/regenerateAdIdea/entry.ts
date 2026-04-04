import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Re-uses the same AI logic but creates a new entry linked to the parent via GenerationVersion.
// Body: same as generateAdIdea but with parentEntryId + optional regenerationReason + changedFields

const META_SYSTEM_PROMPT = `You are an expert Meta (Facebook & Instagram) advertising strategist with 10+ years of performance marketing experience. You specialize in helping small and local businesses run practical, cost-effective ad campaigns that actually get results.

YOUR CORE ROLE:
Analyze the business details and recommend the BEST campaign objective — not just echo back what the user guessed. Think critically.

OBJECTIVE SELECTION RULES (apply these strictly):
- Local service businesses wanting inquiries/calls/bookings → LEADS or MESSAGES (not traffic)
- Businesses with a strong website AND proper conversion tracking → SALES/CONVERSIONS
- Brand new businesses needing visibility → AWARENESS or REACH
- Ecommerce with a product catalog and purchase tracking → SALES
- Webinar, event, or free trial signups → LEADS
- App downloads → APP INSTALLS

BUDGET RULES:
- Under $500/month: recommend ONE campaign, ONE ad set, 2–3 ads max
- $500–$1500/month: can support 2 ad sets
- Over $1500/month: can suggest A/B testing, broader audience layering

Always be specific, direct, and actionable. Avoid generic advice.
Always output valid JSON only, no markdown, no extra text.`;

const GOOGLE_SYSTEM_PROMPT = `You are an expert Google Ads strategist with 10+ years of experience running Search, Display, YouTube, and Performance Max campaigns for small and local businesses.

YOUR CORE ROLE:
Analyze the business details and recommend the BEST Google Ads campaign type and structure. Be specific, practical, and immediately actionable.

CAMPAIGN TYPE RULES:
- Local service businesses → Search campaigns with location targeting
- Ecommerce with products → Shopping or Performance Max
- Brand awareness for a wider audience → Display or YouTube
- High-intent lead gen → Search with lead form extensions
- App downloads → App campaigns

KEYWORD RULES:
- Always recommend a mix of match types
- Include branded, generic, and long-tail keywords
- Be specific to the business/industry
- 10-20 keyword ideas minimum

Always output valid JSON only, no markdown, no extra text.`;

function buildMetaPrompt(data) {
  return `Analyze this business and generate a complete, expert Meta Ads strategy.

BUSINESS DETAILS:
- Business Name: ${data.businessName || 'N/A'}
- Industry: ${data.industry || 'N/A'}
- Business Type: ${data.businessType || 'N/A'}
- Local or Online: ${data.localOrOnline || 'N/A'}
- Offer/Product: ${data.offerType || 'N/A'}
- User's Stated Goal: ${data.goal || 'N/A'}
- Monthly Budget: ${data.budget || 'N/A'}
- Landing Page: ${data.landingPageUrl || 'N/A'}
- Conversion Destination: ${data.leadFormOrWebsite || 'N/A'}
- Geographic Targeting: ${data.geographicTargeting || 'N/A'}
- Audience Description: ${data.audienceDescription || 'N/A'}
- Traffic Temperature: ${data.trafficTemperature || 'N/A'}
- Creative Preference: ${data.creativePreference || 'N/A'}
- Tone of Voice: ${data.toneOfVoice || 'N/A'}
- CTA Preference: ${data.ctaPreference || 'N/A'}
- Additional Notes: ${data.notes || 'None'}
${data.regenerationReason ? `- Regeneration Focus: ${data.regenerationReason}` : ''}

Return ONLY this JSON structure (no markdown, no extra text):
{
  "recommendedObjective": "string",
  "alternativeObjectives": [{ "objective": "string", "when": "string" }],
  "recommendedOptimizationGoal": "string",
  "whyThisMakesSense": "string",
  "campaignSetup": "string",
  "budgetGuidance": "string",
  "adSetStrategy": "string",
  "targetingIdeas": {
    "interests": ["string"],
    "behaviors": ["string"],
    "demographics": ["string"]
  },
  "audienceAngles": ["string"],
  "placements": "string",
  "hooks": ["string"],
  "headlines": ["string"],
  "primaryTextOptions": { "short": "string", "medium": "string", "long": "string" },
  "ctaSuggestions": ["string"],
  "creativeIdeas": ["string"],
  "offerPositioningIdeas": ["string"],
  "risksWarnings": ["string"],
  "finalRecommendation": "string"
}`;
}

function buildGooglePrompt(data) {
  return `Analyze this business and generate a complete, expert Google Ads strategy.

BUSINESS DETAILS:
- Business Name: ${data.businessName || 'N/A'}
- Industry: ${data.industry || 'N/A'}
- Business Type: ${data.businessType || 'N/A'}
- Local or Online: ${data.localOrOnline || 'N/A'}
- Offer/Product: ${data.offerType || 'N/A'}
- Goal: ${data.goal || 'N/A'}
- Monthly Budget: ${data.budget || 'N/A'}
- Landing Page: ${data.landingPageUrl || 'N/A'}
- Geographic Targeting: ${data.geographicTargeting || 'N/A'}
- Audience Description: ${data.audienceDescription || 'N/A'}
- Tone of Voice: ${data.toneOfVoice || 'N/A'}
- Additional Notes: ${data.notes || 'None'}
${data.regenerationReason ? `- Regeneration Focus: ${data.regenerationReason}` : ''}

Return ONLY this JSON structure (no markdown, no extra text):
{
  "recommendedCampaignType": "string",
  "campaignGoal": "string",
  "whyThisMakesSense": "string",
  "suggestedCampaignStructure": "string",
  "keywordIdeas": ["string"],
  "matchTypeSuggestions": "string",
  "audienceSignals": "string",
  "searchHeadlines": ["string"],
  "descriptions": ["string"],
  "ctaSuggestions": ["string"],
  "extensionsIdeas": ["string"],
  "biddingStrategy": "string",
  "budgetGuidance": "string",
  "risksWarnings": ["string"],
  "finalRecommendation": "string"
}`;
}

async function invokeAI(base44, systemPrompt, userPrompt, apiConfig, responseSchema) {
  if (apiConfig?.api_key && apiConfig?.provider_name === 'openrouter') {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.api_key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fireworks-ai.app',
        'X-Title': 'Fire-Works AI'
      },
      body: JSON.stringify({
        model: apiConfig.model_name || 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    });
    const json = await response.json();
    const content = json.choices?.[0]?.message?.content || '';
    return JSON.parse(content);
  }
  return await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `${systemPrompt}\n\n${userPrompt}`,
    response_json_schema: responseSchema
  });
}

const META_SCHEMA = {
  type: 'object',
  properties: {
    recommendedObjective: { type: 'string' },
    alternativeObjectives: { type: 'array', items: { type: 'object', properties: { objective: { type: 'string' }, when: { type: 'string' } } } },
    recommendedOptimizationGoal: { type: 'string' },
    whyThisMakesSense: { type: 'string' },
    campaignSetup: { type: 'string' },
    budgetGuidance: { type: 'string' },
    adSetStrategy: { type: 'string' },
    targetingIdeas: { type: 'object', properties: { interests: { type: 'array', items: { type: 'string' } }, behaviors: { type: 'array', items: { type: 'string' } }, demographics: { type: 'array', items: { type: 'string' } } } },
    audienceAngles: { type: 'array', items: { type: 'string' } },
    placements: { type: 'string' },
    hooks: { type: 'array', items: { type: 'string' } },
    headlines: { type: 'array', items: { type: 'string' } },
    primaryTextOptions: { type: 'object', properties: { short: { type: 'string' }, medium: { type: 'string' }, long: { type: 'string' } } },
    ctaSuggestions: { type: 'array', items: { type: 'string' } },
    creativeIdeas: { type: 'array', items: { type: 'string' } },
    offerPositioningIdeas: { type: 'array', items: { type: 'string' } },
    risksWarnings: { type: 'array', items: { type: 'string' } },
    finalRecommendation: { type: 'string' }
  }
};

const GOOGLE_SCHEMA = {
  type: 'object',
  properties: {
    recommendedCampaignType: { type: 'string' },
    campaignGoal: { type: 'string' },
    whyThisMakesSense: { type: 'string' },
    suggestedCampaignStructure: { type: 'string' },
    keywordIdeas: { type: 'array', items: { type: 'string' } },
    matchTypeSuggestions: { type: 'string' },
    audienceSignals: { type: 'string' },
    searchHeadlines: { type: 'array', items: { type: 'string' } },
    descriptions: { type: 'array', items: { type: 'string' } },
    ctaSuggestions: { type: 'array', items: { type: 'string' } },
    extensionsIdeas: { type: 'array', items: { type: 'string' } },
    biddingStrategy: { type: 'string' },
    budgetGuidance: { type: 'string' },
    risksWarnings: { type: 'array', items: { type: 'string' } },
    finalRecommendation: { type: 'string' }
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { parentEntryId, regenerationReason, changedFields, ...formData } = data;
    const platformType = formData.platformType || 'meta';
    const isAdmin = user.role === 'admin';

    if (!parentEntryId) {
      return Response.json({ error: 'parentEntryId is required' }, { status: 400 });
    }

    // Verify the parent entry belongs to this user (or admin)
    const parentEntries = await base44.asServiceRole.entities.AdIdeaEntry.filter({ id: parentEntryId });
    const parentEntry = parentEntries[0];
    if (!parentEntry) return Response.json({ error: 'Parent entry not found' }, { status: 404 });
    if (!isAdmin && parentEntry.user_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Count existing versions to determine version number
    const existingVersions = await base44.asServiceRole.entities.GenerationVersion.filter({ parent_entry_id: parentEntryId });
    const nextVersion = existingVersions.length + 2; // original is v1

    // --- Usage & plan check for non-admins (same as generateAdIdea) ---
    let subscription = null;
    let usageCounter = null;
    let wasOverage = false;

    if (!isAdmin) {
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: user.id });
      subscription = subs.find(s => s.status === 'active') || null;
      if (!subscription) {
        return Response.json({ error: 'No active subscription.' }, { status: 403 });
      }

      const planType = subscription.plan_type || 'meta';
      if (platformType === 'both' && planType !== 'both') {
        return Response.json({ error: 'UPGRADE_REQUIRED' }, { status: 403 });
      }

      const now = new Date();
      const usages = await base44.asServiceRole.entities.UsageCounter.filter({ user_id: user.id, subscription_id: subscription.id });
      usageCounter = usages.find(u => {
        const start = new Date(u.billing_period_start);
        const end = new Date(u.billing_period_end);
        return now >= start && now <= end;
      }) || usages[usages.length - 1] || null;

      if (!usageCounter) {
        usageCounter = await base44.asServiceRole.entities.UsageCounter.create({
          user_id: user.id,
          subscription_id: subscription.id,
          billing_period_start: subscription.billing_period_start,
          billing_period_end: subscription.billing_period_end,
          included_entries_used: 0,
          overage_entries_used: 0,
          included_entries_remaining: 5,
          overage_amount_accrued: 0,
          last_reset_at: new Date().toISOString()
        });
      }

      wasOverage = (usageCounter.included_entries_remaining || 0) <= 0;
    }

    // --- Generate AI ---
    const apiKeyData = await base44.asServiceRole.entities.ApiSetting.filter({});
    const apiConfig = apiKeyData[0] || null;
    let aiResult = {};

    if (platformType === 'meta') {
      const metaResult = await invokeAI(base44, META_SYSTEM_PROMPT, buildMetaPrompt({ ...formData, regenerationReason }), apiConfig, META_SCHEMA);
      aiResult = { meta: metaResult };
    } else if (platformType === 'google') {
      const googleResult = await invokeAI(base44, GOOGLE_SYSTEM_PROMPT, buildGooglePrompt({ ...formData, regenerationReason }), apiConfig, GOOGLE_SCHEMA);
      aiResult = { google: googleResult };
    } else {
      const [metaResult, googleResult] = await Promise.all([
        invokeAI(base44, META_SYSTEM_PROMPT, buildMetaPrompt({ ...formData, regenerationReason }), apiConfig, META_SCHEMA),
        invokeAI(base44, GOOGLE_SYSTEM_PROMPT, buildGooglePrompt({ ...formData, regenerationReason }), apiConfig, GOOGLE_SCHEMA)
      ]);
      aiResult = { meta: metaResult, google: googleResult };
    }

    // --- Save new entry ---
    const entryData = {
      user_id: user.id,
      subscription_id: subscription?.id || null,
      usage_counter_id: usageCounter?.id || null,
      title: formData.title || `${formData.businessName || 'Business'} - ${formData.goal || 'Campaign'} (v${nextVersion})`,
      business_name: formData.businessName,
      industry: formData.industry,
      business_type: formData.businessType,
      local_or_online: formData.localOrOnline,
      offer_type: formData.offerType,
      goal: formData.goal,
      budget: formData.budget,
      landing_page_url: formData.landingPageUrl,
      lead_form_or_website: formData.leadFormOrWebsite,
      geographic_targeting: formData.geographicTargeting,
      audience_description: formData.audienceDescription,
      traffic_temperature: formData.trafficTemperature,
      creative_preference: formData.creativePreference,
      tone_of_voice: formData.toneOfVoice,
      notes: formData.notes,
      cta_preference: formData.ctaPreference,
      business_profile_id: formData.businessProfileId || null,
      platform_type: platformType,
      ai_response_json: aiResult,
      recommended_objective: aiResult.meta?.recommendedObjective || aiResult.google?.recommendedCampaignType || null,
      recommended_optimization_goal: aiResult.meta?.recommendedOptimizationGoal || null,
      was_included_credit: !wasOverage,
      was_overage_charge: wasOverage,
      overage_charge_amount: wasOverage ? 1.99 : 0,
      status: 'generated'
    };

    const newEntry = await base44.asServiceRole.entities.AdIdeaEntry.create(entryData);

    // --- Create version record ---
    await base44.asServiceRole.entities.GenerationVersion.create({
      user_id: user.id,
      parent_entry_id: parentEntryId,
      new_entry_id: newEntry.id,
      version_number: nextVersion,
      generation_type: 'regenerated',
      regeneration_reason: regenerationReason || null,
      changed_fields: changedFields || [],
      platform_type: platformType
    });

    // --- Update usage ---
    if (!isAdmin && usageCounter) {
      if (wasOverage) {
        await base44.asServiceRole.entities.UsageCounter.update(usageCounter.id, {
          overage_entries_used: (usageCounter.overage_entries_used || 0) + 1,
          overage_amount_accrued: (usageCounter.overage_amount_accrued || 0) + 1.99
        });
        await base44.asServiceRole.entities.BillingEvent.create({
          user_id: user.id,
          subscription_id: subscription.id,
          type: 'overage_charge',
          amount: 1.99,
          status: 'pending',
          billing_period_start: subscription.billing_period_start,
          billing_period_end: subscription.billing_period_end,
          notes: `Overage charge for regeneration v${nextVersion}: ${newEntry.id}`
        });
      } else {
        const newUsed = (usageCounter.included_entries_used || 0) + 1;
        const newRemaining = Math.max(0, (usageCounter.included_entries_remaining || 5) - 1);
        await base44.asServiceRole.entities.UsageCounter.update(usageCounter.id, {
          included_entries_used: newUsed,
          included_entries_remaining: newRemaining
        });
      }
    }

    // --- Log activity ---
    await base44.asServiceRole.entities.ActivityLog.create({
      actor_user_id: user.id,
      action_type: 'regeneration_created',
      details: `Regenerated entry v${nextVersion} from parent ${parentEntryId}`,
      metadata: { parent_entry_id: parentEntryId, new_entry_id: newEntry.id, version_number: nextVersion, was_overage: wasOverage },
      status: 'success'
    });

    return Response.json({ entry: newEntry, version: nextVersion, aiResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});