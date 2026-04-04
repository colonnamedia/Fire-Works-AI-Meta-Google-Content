import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SYSTEM_PROMPT = `You are an expert paid advertising copywriter and strategist. You specialize in Meta Ads (Facebook/Instagram) and Google Ads.

Your job is to analyze an existing ad and provide a detailed, actionable critique and improved version. Be direct, specific, and focus only on paid advertising performance — not branding, SEO, or general marketing.

Always output valid JSON only, no markdown, no extra text.`;

function buildPrompt(adCopy, platform, context) {
  return `Analyze this existing ${platform} ad and provide a complete improvement breakdown.

AD COPY TO ANALYZE:
${adCopy}

${context ? `ADDITIONAL CONTEXT (business/offer): ${context}` : ''}

Platform: ${platform}

Return ONLY this JSON structure:
{
  "overallScore": number (0-100, honest assessment of the ad quality),
  "whatIsWeak": ["string", "string", "string", "string"],
  "improvedVersion": "string (complete rewritten ad copy)",
  "strongerHooks": ["string", "string", "string"],
  "strongerHeadlines": ["string", "string", "string", "string"],
  "betterCTA": ["string", "string", "string"],
  "whyItUnderperforms": "string",
  "keyFixes": ["string", "string", "string"],
  "finalNote": "string"
}`;
}

const SCHEMA = {
  type: 'object',
  properties: {
    overallScore: { type: 'number' },
    whatIsWeak: { type: 'array', items: { type: 'string' } },
    improvedVersion: { type: 'string' },
    strongerHooks: { type: 'array', items: { type: 'string' } },
    strongerHeadlines: { type: 'array', items: { type: 'string' } },
    betterCTA: { type: 'array', items: { type: 'string' } },
    whyItUnderperforms: { type: 'string' },
    keyFixes: { type: 'array', items: { type: 'string' } },
    finalNote: { type: 'string' }
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { adCopy, platform = 'Meta', context = '' } = data;

    if (!adCopy || adCopy.trim().length < 10) {
      return Response.json({ error: 'Please provide an ad copy to analyze.' }, { status: 400 });
    }

    // Check subscription for non-admins
    if (user.role !== 'admin') {
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_id: user.id });
      const activeSub = subs.find(s => s.status === 'active');
      if (!activeSub) {
        return Response.json({ error: 'SUBSCRIPTION_REQUIRED', message: 'Fix My Ad requires an active subscription.' }, { status: 403 });
      }
    }

    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: buildPrompt(adCopy, platform, context) }] }],
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json' }
      })
    });
    const geminiJson = await geminiRes.json();
    if (geminiJson.error) throw new Error(geminiJson.error.message);
    const aiResult = JSON.parse(geminiJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}');

    // Save as an AdIdeaEntry so it's tracked
    const entry = await base44.asServiceRole.entities.AdIdeaEntry.create({
      user_id: user.id,
      title: `Fix My Ad — ${platform} (${new Date().toLocaleDateString()})`,
      business_name: context ? context.substring(0, 50) : 'Ad Review',
      platform_type: platform.toLowerCase() === 'google' ? 'google' : 'meta',
      goal: 'sales',
      status: 'generated',
      ai_response_json: { fix_my_ad: aiResult, original_ad: adCopy, platform },
      notes: `Original ad: ${adCopy}`,
    });

    await base44.asServiceRole.entities.ActivityLog.create({
      actor_user_id: user.id,
      action_type: 'generation_created',
      details: `Fix My Ad analysis for ${platform}`,
      status: 'success'
    });

    return Response.json({ result: aiResult, entry });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});