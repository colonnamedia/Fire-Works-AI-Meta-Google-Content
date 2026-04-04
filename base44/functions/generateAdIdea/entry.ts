import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

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

Return ONLY this JSON structure (no markdown, no extra text):
{
  "recommendedObjective": "string",
  "alternativeObjectives": [
    { "objective": "string", "when": "string" },
    { "objective": "string", "when": "string" }
  ],
  "recommendedOptimizationGoal": "string",
  "whyThisMakesSense": "string",
  "campaignSetup": "string",
  "budgetGuidance": "string",
  "adSetStrategy": "string",
  "targetingIdeas": {
    "interests": ["string", "string", "string", "string", "string"],
    "behaviors": ["string", "string", "string"],
    "demographics": ["string", "string", "string"]
  },
  "audienceAngles": ["string", "string", "string", "string"],
  "placements": "string",
  "hooks": ["string", "string", "string", "string", "string"],
  "headlines": ["string", "string", "string", "string", "string"],
  "primaryTextOptions": {
    "short": "string",
    "medium": "string",
    "long": "string"
  },
  "ctaSuggestions": ["string", "string", "string", "string"],
  "creativeIdeas": ["string", "string", "string", "string"],
  "offerPositioningIdeas": ["string", "string", "string"],
  "competitorInsight": {
    "whatCompetitorsDo": "string",
    "commonMessaging": "string",
    "howToStandOut": "string"
  },
  "offerOptimization": {
    "offerStrength": "Strong or Weak",
    "whyItWorksOrDoesnt": "string",
    "improvedOffers": ["string", "string", "string"]
  },
  "adConversionCheck": {
    "messageMatch": { "verdict": "yes/no/partial", "suggestion": "string" },
    "offerClarity": { "verdict": "yes/no/partial", "suggestion": "string" },
    "strongCTA": { "verdict": "yes/no/partial", "suggestion": "string" },
    "wouldConvert": { "verdict": "yes/no/partial", "suggestion": "string" }
  },
  "risksWarnings": ["string", "string", "string"],
  "finalRecommendation": "string"
}`;
}

function buildGooglePrompt(data, keywordData = null) {
  const keywordSection = keywordData?.keywords?.length
    ? `\nREAL KEYWORD DATA (from Google Ads Keyword Planner — source: ${keywordData.source}):\n${keywordData.keywords.map(k => `  - "${k.keyword}"${k.avgMonthlySearches ? ` (${k.avgMonthlySearches.toLocaleString()} avg monthly searches, ${k.competition || 'unknown'} competition)` : ''}`).join('\n')}\nUse these real keywords in your keywordIdeas output. Prioritize by search volume if available.\n`
    : '';
  return buildGooglePromptInner(data, keywordSection);
}

function buildGooglePromptInner(data, keywordSection = '') {
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
${keywordSection}
Return ONLY this JSON structure (no markdown, no extra text):
{
  "recommendedCampaignType": "string",
  "campaignGoal": "string",
  "whyThisMakesSense": "string",
  "suggestedCampaignStructure": "string",
  "keywordIdeas": ["string", "string", "string", "string", "string", "string", "string", "string", "string", "string"],
  "matchTypeSuggestions": "string",
  "audienceSignals": "string",
  "searchHeadlines": ["string", "string", "string", "string", "string", "string", "string"],
  "descriptions": ["string", "string", "string", "string"],
  "ctaSuggestions": ["string", "string", "string", "string"],
  "extensionsIdeas": ["string", "string", "string", "string"],
  "biddingStrategy": "string",
  "budgetGuidance": "string",
  "risksWarnings": ["string", "string", "string"],
  "finalRecommendation": "string"
}`;
}

function buildGooglePromptExtended(data, keywordData = null) {
  return buildGooglePrompt(data, keywordData).replace(
    '"finalRecommendation": "string"\n}',
    `"competitorInsight": {
    "whatCompetitorsDo": "string describing what competitors typically do in this industry on Google Ads",
    "commonMessaging": "string describing common ad messaging patterns",
    "howToStandOut": "string with specific advice on how to differentiate on Google Ads"
  },
  "offerOptimization": {
    "offerStrength": "Strong or Weak",
    "whyItWorksOrDoesnt": "string",
    "improvedOffers": ["string", "string", "string"]
  },
  "risksWarnings": ["string", "string", "string"],
  "finalRecommendation": "string"
}`
  );
}

async function invokeAI(systemPrompt, userPrompt) {
  const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
  const model = 'gemini-2.0-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    })
  });

  const json = await response.json();
  if (json.error) throw new Error(json.error.message);
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return JSON.parse(text);
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
    competitorInsight: { type: 'object', properties: { whatCompetitorsDo: { type: 'string' }, commonMessaging: { type: 'string' }, howToStandOut: { type: 'string' } } },
    offerOptimization: { type: 'object', properties: { offerStrength: { type: 'string' }, whyItWorksOrDoesnt: { type: 'string' }, improvedOffers: { type: 'array', items: { type: 'string' } } } },
    adConversionCheck: { type: 'object' },
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
    const platformType = data.platformType || 'meta';
    const isAdmin = user.role === 'admin';

    // --- Usage & plan check for non-admins ---
    let subscription = null;
    let usageCounter = null;
    let wasOverage = false;

    if (!isAdmin) {
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: user.id });
      subscription = subs.find(s => s.status === 'active') || null;

      if (!subscription) {
        return Response.json({ error: 'No active subscription. Please subscribe to generate ad ideas.' }, { status: 403 });
      }

      // Plan type enforcement
      const planType = subscription.plan_type || 'meta';
      if (platformType === 'both' && planType !== 'both') {
        return Response.json({ error: 'UPGRADE_REQUIRED', message: 'Your current plan only supports one platform. Upgrade to the Both Platforms plan ($8.99/month) to generate strategies for both Meta and Google.' }, { status: 403 });
      }
      if (platformType === 'google' && planType === 'meta') {
        return Response.json({ error: 'PLATFORM_NOT_INCLUDED', message: 'Your current plan does not include Google Ads. Please upgrade or switch plans.' }, { status: 403 });
      }
      if (platformType === 'meta' && planType === 'google') {
        return Response.json({ error: 'PLATFORM_NOT_INCLUDED', message: 'Your current plan does not include Meta Ads. Please upgrade or switch plans.' }, { status: 403 });
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

    // --- Fetch Google keyword ideas if relevant ---
    let googleKeywordData = null;
    if (platformType === 'google' || platformType === 'both') {
      try {
        const kwRes = await base44.asServiceRole.functions.invoke('generateGoogleKeywordIdeas', {
          businessName: data.businessName,
          industry: data.industry,
          businessType: data.businessType,
          offerType: data.offerType,
          goal: data.goal,
          websiteUrl: data.landingPageUrl,
          landingPageUrl: data.landingPageUrl,
          location: data.geographicTargeting,
          platformType,
        });
        googleKeywordData = kwRes;
      } catch (kwErr) {
        console.error('Keyword ideas fetch failed (non-fatal):', kwErr.message);
      }
    }

    // --- Generate AI strategy based on platform ---
    let aiResult = {};

    if (platformType === 'meta') {
      const metaResult = await invokeAI(META_SYSTEM_PROMPT, buildMetaPrompt(data));
      aiResult = { meta: metaResult };
    } else if (platformType === 'google') {
      const googleResult = await invokeAI(GOOGLE_SYSTEM_PROMPT, buildGooglePrompt(data, googleKeywordData));
      aiResult = { google: googleResult, keywordData: googleKeywordData };
    } else if (platformType === 'both') {
      const [metaResult, googleResult] = await Promise.all([
        invokeAI(META_SYSTEM_PROMPT, buildMetaPrompt(data)),
        invokeAI(GOOGLE_SYSTEM_PROMPT, buildGooglePromptExtended(data, googleKeywordData))
      ]);
      aiResult = { meta: metaResult, google: googleResult, keywordData: googleKeywordData };
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
      platform_type: platformType,
      ai_response_json: aiResult,
      recommended_objective: aiResult.meta?.recommendedObjective || aiResult.google?.recommendedCampaignType || null,
      recommended_optimization_goal: aiResult.meta?.recommendedOptimizationGoal || null,
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

    // Log activity
    await base44.asServiceRole.entities.ActivityLog.create({
      actor_user_id: user.id,
      action_type: 'generation_created',
      details: `Generated ${platformType} strategy: ${entryData.title}`,
      metadata: { entry_id: entry.id, platform_type: platformType, was_overage: wasOverage },
      status: 'success'
    });

    if (wasOverage) {
      await base44.asServiceRole.entities.ActivityLog.create({
        actor_user_id: user.id,
        action_type: 'overage_triggered',
        details: `Overage charge $1.99 for entry ${entry.id}`,
        metadata: { entry_id: entry.id, amount: 1.99 },
        status: 'warning'
      });
    }

    return Response.json({ entry, aiResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});