import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// --- Google Ads OAuth token refresh ---
async function getAccessToken() {
  const clientId = Deno.env.get('GOOGLE_ADS_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_ADS_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GOOGLE_ADS_REFRESH_TOKEN');

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google Ads OAuth credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const json = await res.json();
  if (!json.access_token) throw new Error(`Token refresh failed: ${json.error_description || json.error || 'unknown'}`);
  return json.access_token;
}

// --- Build seed keywords from input ---
function buildSeedKeywords(data) {
  const seeds = [];
  if (data.businessType) seeds.push(data.businessType.replace(/_/g, ' '));
  if (data.industry) seeds.push(data.industry);
  if (data.offerType) seeds.push(data.offerType);
  if (data.businessName) seeds.push(data.businessName);
  if (data.seedKeywords) {
    const extras = data.seedKeywords.split(',').map(s => s.trim()).filter(Boolean);
    seeds.push(...extras);
  }
  // Deduplicate and limit
  return [...new Set(seeds)].slice(0, 10);
}

// --- Call Google Ads KeywordPlanIdeaService ---
async function callKeywordPlanIdeaService(data, accessToken) {
  const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');
  const customerId = Deno.env.get('GOOGLE_ADS_CUSTOMER_ID');
  const loginCustomerId = Deno.env.get('GOOGLE_ADS_LOGIN_CUSTOMER_ID');

  if (!developerToken || !customerId) {
    throw new Error('Missing GOOGLE_ADS_DEVELOPER_TOKEN or GOOGLE_ADS_CUSTOMER_ID');
  }

  const cleanCustomerId = customerId.replace(/-/g, '');
  const seedKeywords = buildSeedKeywords(data);

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': developerToken,
    'Content-Type': 'application/json',
  };
  if (loginCustomerId) {
    headers['login-customer-id'] = loginCustomerId.replace(/-/g, '');
  }

  // Location: default to US (1023191 = United States criterion ID)
  // If location string is provided we still use US as default since we'd need geocoding to get criterion IDs
  const geoTargets = ['geoTargetConstants/1023191'];

  const body = {
    keywordSeed: { keywords: seedKeywords },
    language: 'languageConstants/1000', // English
    geoTargetConstants: geoTargets,
    keywordPlanNetwork: 'GOOGLE_SEARCH_AND_PARTNERS',
    pageSize: 20,
  };

  const url = `https://googleads.googleapis.com/v17/customers/${cleanCustomerId}:generateKeywordIdeas`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (json.error) {
    throw new Error(`Google Ads API error: ${json.error.message || JSON.stringify(json.error)}`);
  }

  const results = json.results || [];

  return results.slice(0, 20).map(r => ({
    keyword: r.text || '',
    avgMonthlySearches: r.keywordIdeaMetrics?.avgMonthlySearches
      ? parseInt(r.keywordIdeaMetrics.avgMonthlySearches)
      : null,
    competition: r.keywordIdeaMetrics?.competition || null,
  })).filter(k => k.keyword);
}

// --- AI fallback keyword generation ---
async function generateAIFallbackKeywords(data) {
  const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
  if (!apiKey) return [];

  const prompt = `Generate 15 strong Google Ads search keywords for this business. Return ONLY a JSON array of objects.

Business: ${data.businessName || 'N/A'}
Industry: ${data.industry || 'N/A'}
Offer: ${data.offerType || 'N/A'}
Goal: ${data.goal || 'N/A'}
Location: ${data.location || 'general'}

Return format (no markdown):
[
  {"keyword": "string", "avgMonthlySearches": null, "competition": "LOW|MEDIUM|HIGH"},
  ...
]

Include a mix of: branded, generic, location-based (if location given), long-tail, and service-specific keywords. 15 keywords max.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
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
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
}

// --- Simple in-memory cache (per function instance) ---
const cache = new Map();

function getCacheKey(data) {
  return `${data.businessName}|${data.industry}|${data.offerType}|${data.location}`.toLowerCase();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { platformType } = data;

    // Skip if not Google-related
    if (platformType !== 'google' && platformType !== 'both') {
      return Response.json({ keywords: [], source: 'skipped' });
    }

    // Check cache (5 min TTL)
    const cacheKey = getCacheKey(data);
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < 5 * 60 * 1000) {
      return Response.json({ ...cached.result, cached: true });
    }

    // Try Google Ads API
    try {
      const accessToken = await getAccessToken();
      const keywords = await callKeywordPlanIdeaService(data, accessToken);

      if (keywords.length > 0) {
        const result = { keywords, source: 'google_ads_api' };
        cache.set(cacheKey, { result, ts: Date.now() });
        return Response.json(result);
      }
      // Empty response — fall through to AI fallback
      throw new Error('Empty keyword response from Google Ads API');
    } catch (apiError) {
      console.error('Google Ads API failed, using AI fallback:', apiError.message);

      const keywords = await generateAIFallbackKeywords(data);
      const result = { keywords, source: 'ai_fallback', fallbackReason: apiError.message };
      cache.set(cacheKey, { result, ts: Date.now() });
      return Response.json(result);
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});