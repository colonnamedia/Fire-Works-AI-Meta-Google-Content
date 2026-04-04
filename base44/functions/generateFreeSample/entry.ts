import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SYSTEM_PROMPT = `You are an expert digital advertising strategist. Generate a brief but compelling ad strategy sample that gives real value but leaves the user wanting more. Be specific and actionable.`;

function buildSamplePrompt(data) {
  return `Generate a FREE SAMPLE ad strategy for this business. Give real, specific value — but this is just a teaser of the full strategy.

BUSINESS DETAILS:
- Business Name: ${data.businessName || 'N/A'}
- Industry: ${data.industry || 'N/A'}
- Business Type: ${data.businessType || 'N/A'}
- Platform: ${data.platformInterest || 'meta'}
- Offer/Product: ${data.offerType || 'N/A'}
- Goal: ${data.goal || 'N/A'}
- Budget: ${data.budget || 'N/A'}

Return ONLY this JSON (no markdown, no extra text):
{
  "campaignDirection": "1-2 sentence campaign direction recommendation",
  "recommendedObjective": "the single best campaign objective for this business",
  "sampleHeadline": "one compelling ad headline",
  "sampleDescription": "one strong primary text / description (2-3 sentences)",
  "audienceSuggestion": "one specific audience targeting suggestion",
  "lockedPreview": {
    "additionalHeadlines": 4,
    "audienceAngles": 4,
    "hooks": 5,
    "fullCopyOptions": 3,
    "ctaSuggestions": 4,
    "targetingIdeas": true,
    "campaignSetup": true,
    "competitorInsight": true,
    "riskWarnings": true
  }
}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.email || !data.businessName) {
      return Response.json({ error: 'Email and business name are required' }, { status: 400 });
    }

    // Save lead first
    const leadData = {
      full_name: data.fullName || '',
      email: data.email,
      business_name: data.businessName,
      industry: data.industry || '',
      platform_interest: data.platformInterest || 'meta',
      offer_type: data.offerType || '',
      goal: data.goal || '',
      business_type: data.businessType || '',
      ad_criteria_json: data,
      has_seen_free_sample: false,
      has_registered: false,
      has_purchased: false,
      funnel_stage: 'submitted_query'
    };

    const lead = await base44.asServiceRole.entities.Lead.create(leadData);

    // Generate free sample via Base44 built-in LLM
    const freeSample = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\n${buildSamplePrompt(data)}`,
      response_json_schema: {
        type: 'object',
        properties: {
          campaignDirection: { type: 'string' },
          recommendedObjective: { type: 'string' },
          sampleHeadline: { type: 'string' },
          sampleDescription: { type: 'string' },
          audienceSuggestion: { type: 'string' },
          lockedPreview: { type: 'object' }
        }
      }
    });

    // Update lead with free sample
    await base44.asServiceRole.entities.Lead.update(lead.id, {
      free_sample_json: freeSample,
      has_seen_free_sample: true,
      funnel_stage: 'sample_viewed'
    });

    return Response.json({ leadId: lead.id, freeSample });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});