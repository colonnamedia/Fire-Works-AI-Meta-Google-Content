import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// --- FEATURE FLAG ---
// Set to true to re-enable Google Ads Keyword Planner when ready.
// When false, AI-generated keywords are used exclusively.
const USE_KEYWORD_PLANNER = false;

// --- AI keyword generation using Gemini ---
async function generateAIKeywords(data) {
  const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
  if (!apiKey) throw new Error('Missing GOOGLE_AI_API_KEY');

  const prompt = `Generate 15 high-intent Google Ads keyword ideas for this business. Focus on ad campaign keywords, NOT SEO.

Business: ${data.businessName || 'N/A'}
Industry: ${data.industry || 'N/A'}
Business Type: ${data.businessType || 'N/A'}
Offer: ${data.offerType || 'N/A'}
Goal: ${data.goal || 'N/A'}
Location: ${data.location || 'not specified'}

Include a mix of:
- Service/product keywords (e.g. "emergency plumber")
- Local intent keywords if location given (e.g. "plumber near me", "plumber in [city]")
- High-intent buyer keywords (e.g. "hire a plumber", "plumber cost")
- Problem/solution keywords (e.g. "leaking pipe fix")
- Result-oriented keywords (e.g. "fast pipe repair")

Return ONLY a JSON array, no markdown:
[
  {"keyword": "string", "avgMonthlySearches": null, "competition": null},
  ...
]

15 keywords max. Keep them practical for Google Ads search campaigns.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, responseMimeType: 'application/json' },
      }),
    }
  );

  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed.slice(0, 15) : [];
}

// --- Google Ads Keyword Planner (disabled, ready to re-enable) ---
async function callKeywordPlanner(data) {
  const clientId = Deno.env.get('GOOGLE_ADS_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_ADS_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GOOGLE_ADS_REFRESH_TOKEN');
  const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');
  const customerId = Deno.env.get('GOOGLE_ADS_CUSTOMER_ID');

  if (!clientId || !clientSecret || !refreshToken || !developerToken || !customerId) {
    throw new Error('Missing Google Ads credentials');
  }

  // Refresh OAuth token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }),
  });
  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) throw new Error(`Token refresh failed: ${tokenJson.error_description || 'unknown'}`);

  const cleanCustomerId = customerId.replace(/-/g, '');
  const loginCustomerId = Deno.env.get('GOOGLE_ADS_LOGIN_CUSTOMER_ID');
  const headers = {
    'Authorization': `Bearer ${tokenJson.access_token}`,
    'developer-token': developerToken,
    'Content-Type': 'application/json',
  };
  if (loginCustomerId) headers['login-customer-id'] = loginCustomerId.replace(/-/g, '');

  const seeds = [data.businessType, data.industry, data.offerType, data.businessName].filter(Boolean).map(s => s.replace(/_/g, ' ')).slice(0, 5);

  const res = await fetch(`https://googleads.googleapis.com/v17/customers/${cleanCustomerId}:generateKeywordIdeas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      keywordSeed: { keywords: seeds },
      language: 'languageConstants/1000',
      geoTargetConstants: ['geoTargetConstants/1023191'],
      keywordPlanNetwork: 'GOOGLE_SEARCH_AND_PARTNERS',
      pageSize: 20,
    }),
  });

  const json = await res.json();
  if (json.error) throw new Error(`Google Ads API: ${json.error.message}`);

  return (json.results || []).slice(0, 20).map(r => ({
    keyword: r.text || '',
    avgMonthlySearches: r.keywordIdeaMetrics?.avgMonthlySearches ? parseInt(r.keywordIdeaMetrics.avgMonthlySearches) : null,
    competition: r.keywordIdeaMetrics?.competition || null,
  })).filter(k => k.keyword);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();

    if (data.platformType !== 'google' && data.platformType !== 'both') {
      return Response.json({ keywords: [], source: 'skipped' });
    }

    if (USE_KEYWORD_PLANNER) {
      try {
        const keywords = await callKeywordPlanner(data);
        if (keywords.length > 0) return Response.json({ keywords, source: 'google_ads_api' });
        throw new Error('Empty response from Keyword Planner');
      } catch (err) {
        console.error('Keyword Planner failed, falling back to AI:', err.message);
        const keywords = await generateAIKeywords(data);
        return Response.json({ keywords, source: 'ai_generated', fallbackReason: err.message });
      }
    } else {
      // Keyword Planner disabled — use AI only
      const keywords = await generateAIKeywords(data);
      return Response.json({ keywords, source: 'ai_generated' });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});