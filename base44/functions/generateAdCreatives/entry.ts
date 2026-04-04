import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const PLATFORMS = {
  google: {
    limits: { headline: 30, description: 90, cta: 15 },
    count: { headline: 5, description: 3, cta: 4 },
  },
  meta: {
    limits: { primaryText: 125, headline: 40, description: 30, cta: 20 },
    count: { primaryText: 3, headline: 5, description: 3, cta: 4 },
  },
};

function buildPrompt(platform, formData) {
  const p = PLATFORMS[platform];
  const googleInstructions = `Generate ad creatives for Google Ads. Follow these STRICT character limits:
- Headlines: max ${p.limits.headline} characters each — generate ${p.count.headline} variations
- Descriptions: max ${p.limits.description} characters each — generate ${p.count.description} variations
- CTAs: max ${p.limits.cta} characters each — generate ${p.count.cta} variations`;
  const metaInstructions = `Generate ad creatives for Meta (Facebook/Instagram) Ads. Follow these STRICT character limits:
- Primary Text: max ${p.limits.primaryText} characters each — generate ${p.count.primaryText} variations
- Headlines: max ${p.limits.headline} characters each — generate ${p.count.headline} variations
- Descriptions: max ${p.limits.description} characters each — generate ${p.count.description} variations
- CTAs: max ${p.limits.cta} characters each — generate ${p.count.cta} variations`;
  return `You are an expert digital advertising copywriter.
${platform === "google" ? googleInstructions : metaInstructions}
Business details:
- Business Name: ${formData.businessName}
- Product / Service: ${formData.product}
- Target Audience: ${formData.audience}
- Key Benefit / USP: ${formData.usp}
- Tone: ${formData.tone}
- Goal: ${formData.goal}
Return ONLY a valid JSON object. No explanation, no markdown, no backticks.
${platform === "google" ? `{"headlines":["...","...","...","...","..."],"descriptions":["...","...","..."],"ctas":["...","...","...","..."]}` : `{"primaryTexts":["...","...","..."],"headlines":["...","...","...","...","..."],"descriptions":["...","...","..."],"ctas":["...","...","...","..."]}`}
Every single item MUST be within the character limit. Count carefully.`;
}

const SCHEMA = {
  type: 'object',
  properties: {
    headlines: { type: 'array', items: { type: 'string' } },
    primaryTexts: { type: 'array', items: { type: 'string' } },
    descriptions: { type: 'array', items: { type: 'string' } },
    ctas: { type: 'array', items: { type: 'string' } },
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { platform, formData } = await req.json();
    if (!platform || !formData) {
      return Response.json({ error: 'Missing platform or formData' }, { status: 400 });
    }

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: buildPrompt(platform, formData),
      response_json_schema: SCHEMA,
      model: 'claude_sonnet_4_6',
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});