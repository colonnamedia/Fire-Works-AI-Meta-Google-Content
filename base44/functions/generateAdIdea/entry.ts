import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SYSTEM_PROMPT = `You are an expert Meta (Facebook & Instagram) advertising strategist with 10+ years of performance marketing experience. You help small businesses, local businesses, service providers, and ecommerce brands build high-converting ad campaigns.

Your role is to analyze the business details provided and give a complete, actionable Meta Ads strategy. Always be specific, direct, and data-driven. Avoid generic advice.

RULES:
- Recommend based on the actual goal and budget
- Give realistic expectations
- Tailor copy to the tone requested
- Provide multiple creative and copy options
- Always output valid JSON only, no markdown, no extra text`;

function buildPrompt(data) {
  return `Analyze this business and generate a complete Meta Ads strategy:

BUSINESS DETAILS:
- Business Name: ${data.businessName || 'N/A'}
- Industry: ${data.industry || 'N/A'}
- Business Type: ${data.businessType || 'N/A'}
- Local or Online: ${data.localOrOnline || 'N/A'}
- Offer/Product: ${data.offerType || 'N/A'}
- Campaign Goal: ${data.goal || 'N/A'}
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

Return ONLY this JSON structure:
{
  "recommendedObjective": "string",
  "recommendedOptimizationGoal": "string",
  "whyThisMakesSense": "string",
  "campaignSetup": "string",
  "adSetStrategy": "string",
  "placements": "string",
  "audienceDirection": "string",
  "hooks": ["string", "string", "string"],
  "headlines": ["string", "string", "string"],
  "primaryTextOptions": ["string", "string"],
  "ctaSuggestions": ["string", "string"],
  "creativeAngleIdeas": ["string", "string", "string"],
  "risksWarnings": ["string", "string", "string"],
  "finalRecommendation": "string"
}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const isAdmin = user.role === 'admin';

    // --- Usage check for non-admins ---
    let subscription = null;
    let usageCounter = null;
    let wasOverage = false;

    if (!isAdmin) {
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: user.id });
      subscription = subs.find(s => s.status === 'active') || null;

      if (!subscription) {
        return Response.json({ error: 'No active subscription. Please subscribe to generate ad ideas.' }, { status: 403 });
      }

      // Get current usage counter
      const now = new Date();
      const usages = await base44.asServiceRole.entities.UsageCounter.filter({ user_id: user.id, subscription_id: subscription.id });
      usageCounter = usages.find(u => {
        const start = new Date(u.billing_period_start);
        const end = new Date(u.billing_period_end);
        return now >= start && now <= end;
      }) || null;

      if (!usageCounter) {
        // Create a usage counter for this period
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

    // --- Generate AI strategy ---
    const prompt = buildPrompt(data);
    let aiResult;

    try {
      // Try OpenRouter free model first
      const apiKeyData = await base44.asServiceRole.entities.ApiSetting.filter({});
      const apiConfig = apiKeyData[0];

      if (apiConfig?.api_key && apiConfig?.provider_name === 'openrouter') {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiConfig.api_key}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://meta-ad-strategist.app',
            'X-Title': 'Meta Ad Strategist AI'
          },
          body: JSON.stringify({
            model: apiConfig.model_name || 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7
          })
        });
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content || '';
        aiResult = JSON.parse(content);
      } else {
        throw new Error('No external API key, using built-in');
      }
    } catch {
      // Fallback to built-in LLM
      console.log('[INFO] Using built-in LLM');
      aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\n${prompt}`,
        response_json_schema: {
          type: 'object',
          properties: {
            recommendedObjective: { type: 'string' },
            recommendedOptimizationGoal: { type: 'string' },
            whyThisMakesSense: { type: 'string' },
            campaignSetup: { type: 'string' },
            adSetStrategy: { type: 'string' },
            placements: { type: 'string' },
            audienceDirection: { type: 'string' },
            hooks: { type: 'array', items: { type: 'string' } },
            headlines: { type: 'array', items: { type: 'string' } },
            primaryTextOptions: { type: 'array', items: { type: 'string' } },
            ctaSuggestions: { type: 'array', items: { type: 'string' } },
            creativeAngleIdeas: { type: 'array', items: { type: 'string' } },
            risksWarnings: { type: 'array', items: { type: 'string' } },
            finalRecommendation: { type: 'string' }
          }
        }
      });
    }

    // --- Save entry ---
    const entryData = {
      user_id: user.id,
      subscription_id: subscription?.id || null,
      usage_counter_id: usageCounter?.id || null,
      title: data.title || `${data.businessName || 'Business'} - ${data.goal || 'Campaign'}`,
      business_name: data.businessName,
      industry: data.industry,
      business_type: data.businessType,
      local_or_online: data.localOrOnline,
      offer_type: data.offerType,
      goal: data.goal,
      budget: data.budget,
      landing_page_url: data.landingPageUrl,
      lead_form_or_website: data.leadFormOrWebsite,
      geographic_targeting: data.geographicTargeting,
      audience_description: data.audienceDescription,
      traffic_temperature: data.trafficTemperature,
      creative_preference: data.creativePreference,
      tone_of_voice: data.toneOfVoice,
      notes: data.notes,
      cta_preference: data.ctaPreference,
      ai_response_json: aiResult,
      recommended_objective: aiResult.recommendedObjective,
      recommended_optimization_goal: aiResult.recommendedOptimizationGoal,
      was_included_credit: !wasOverage,
      was_overage_charge: wasOverage,
      overage_charge_amount: wasOverage ? 1.99 : 0,
      status: 'generated'
    };

    const entry = await base44.asServiceRole.entities.AdIdeaEntry.create(entryData);

    // --- Update usage counters ---
    if (!isAdmin && usageCounter) {
      if (wasOverage) {
        await base44.asServiceRole.entities.UsageCounter.update(usageCounter.id, {
          overage_entries_used: (usageCounter.overage_entries_used || 0) + 1,
          overage_amount_accrued: (usageCounter.overage_amount_accrued || 0) + 1.99
        });
        // Log overage billing event
        await base44.asServiceRole.entities.BillingEvent.create({
          user_id: user.id,
          subscription_id: subscription.id,
          type: 'overage_charge',
          amount: 1.99,
          status: 'pending',
          billing_period_start: subscription.billing_period_start,
          billing_period_end: subscription.billing_period_end,
          notes: `Overage charge for ad idea entry: ${entry.id}`
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

    return Response.json({ entry, aiResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});