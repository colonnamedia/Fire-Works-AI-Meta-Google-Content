import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const {
      email, full_name, business_name, industry, offer_type,
      target_audience, location_type, unique_selling_point, biggest_challenge,
      content_type, goal, budget, clerk_user_id
    } = req.body;

    if (clerk_user_id) {
      await pool.query(`
        INSERT INTO user_profiles (clerk_user_id, email, full_name, business_name, industry, offer_type, target_audience, location_type, unique_selling_point, biggest_challenge, goal, budget, content_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (clerk_user_id) DO UPDATE SET
          email = $2, full_name = $3, business_name = $4,
          industry = $5, offer_type = $6, target_audience = $7,
          location_type = $8, unique_selling_point = $9,
          biggest_challenge = $10, goal = $11, budget = $12,
          content_type = $13, updated_at = NOW()
      `, [clerk_user_id, email, full_name, business_name, industry, offer_type,
          target_audience, location_type, unique_selling_point, biggest_challenge,
          goal, budget, content_type]);
    }

    const businessContext = `
Business Name: ${business_name}
Industry: ${industry}
Main Offer: ${offer_type || 'Not specified'}
Ideal Customer: ${target_audience || 'Not specified'}
Service Area: ${location_type || 'local'}
Unique Selling Point: ${unique_selling_point || 'Not specified'}
Biggest Challenge: ${biggest_challenge || 'Not specified'}
Primary Goal: ${goal}
Monthly Budget: ${budget || 'Not specified'}`;

    const includeGoogle = content_type === 'google_ads' || content_type === 'google_meta' || content_type === 'everything';
    const includeMeta = content_type === 'meta_ads' || content_type === 'google_meta' || content_type === 'everything';
    const includeSocial = content_type === 'organic_social' || content_type === 'everything';

    const prompt = `You are an expert digital advertising strategist specializing in small and medium businesses. Generate a comprehensive, highly specific ad campaign setup based on the following business details.

${businessContext}

IMPORTANT: Make everything highly specific to this exact business. Reference their industry, offer, and unique selling point directly. Never use generic placeholder copy.

Return ONLY a valid JSON object with this exact structure, no other text, no markdown:
{
${includeGoogle ? `"google": {
    "campaign_type": "recommended campaign type (Search, Performance Max, or Local) with one sentence explanation",
    "campaign_objective": "specific objective for this business",
    "budget_recommendation": "specific daily budget recommendation based on their monthly budget",
    "bidding_strategy": "recommended bidding strategy with explanation",
    "location_targeting": "specific cities, regions, or radius recommendation based on their service area type",
    "location_exclusions": "any locations to exclude if applicable, or 'None recommended'",
    "audience_targeting": "specific audience targeting recommendations",
    "headlines": [
      "headline 1 max 30 chars",
      "headline 2 max 30 chars",
      "headline 3 max 30 chars",
      "headline 4 max 30 chars",
      "headline 5 max 30 chars",
      "headline 6 max 30 chars",
      "headline 7 max 30 chars",
      "headline 8 max 30 chars",
      "headline 9 max 30 chars",
      "headline 10 max 30 chars",
      "headline 11 max 30 chars",
      "headline 12 max 30 chars",
      "headline 13 max 30 chars",
      "headline 14 max 30 chars",
      "headline 15 max 30 chars"
    ],
    "descriptions": [
      "description 1 max 90 chars",
      "description 2 max 90 chars",
      "description 3 max 90 chars",
      "description 4 max 90 chars"
    ],
    "sitelinks": [
      { "title": "sitelink 1 title", "description": "sitelink 1 description max 35 chars" },
      { "title": "sitelink 2 title", "description": "sitelink 2 description max 35 chars" },
      { "title": "sitelink 3 title", "description": "sitelink 3 description max 35 chars" },
      { "title": "sitelink 4 title", "description": "sitelink 4 description max 35 chars" }
    ],
    "callouts": ["callout 1 max 25 chars", "callout 2", "callout 3", "callout 4"],
    "keywords": [
      { "keyword": "keyword 1", "match_type": "Exact" },
      { "keyword": "keyword 2", "match_type": "Phrase" },
      { "keyword": "keyword 3", "match_type": "Broad" },
      { "keyword": "keyword 4", "match_type": "Exact" },
      { "keyword": "keyword 5", "match_type": "Phrase" },
      { "keyword": "keyword 6", "match_type": "Exact" },
      { "keyword": "keyword 7", "match_type": "Phrase" },
      { "keyword": "keyword 8", "match_type": "Broad" },
      { "keyword": "keyword 9", "match_type": "Exact" },
      { "keyword": "keyword 10", "match_type": "Phrase" }
    ],
    "negative_keywords": ["negative 1", "negative 2", "negative 3", "negative 4", "negative 5", "negative 6", "negative 7", "negative 8", "negative 9", "negative 10"],
    "campaign_tip": "one specific actionable tip for this business"
  }${includeMeta || includeSocial ? ',' : ''}` : ''}
${includeMeta ? `"meta": {
    "campaign_objective": "recommended Meta campaign objective with explanation",
    "budget_recommendation": "specific daily budget recommendation",
    "ad_set_structure": "recommended ad set structure explanation",
    "placement_recommendation": "specific placement recommendations (Feed, Stories, Reels, etc.)",
    "audience": {
      "age_range": "recommended age range",
      "gender": "All, Male, or Female with reasoning",
      "interests": ["interest 1", "interest 2", "interest 3", "interest 4", "interest 5"],
      "behaviors": ["behavior 1", "behavior 2", "behavior 3"],
      "exclusions": "audiences to exclude or 'None'"
    },
    "geographic_targeting": "specific geographic targeting recommendation",
    "creative_direction": "image vs video recommendation with reasoning",
    "creative_format": "specific format recommendation (single image, carousel, video, etc.)",
    "primary_texts": [
      "primary text option 1 - 2 to 3 sentences specific to their offer",
      "primary text option 2",
      "primary text option 3"
    ],
    "headlines": ["headline 1", "headline 2", "headline 3"],
    "hooks": ["scroll-stopping hook 1", "hook 2", "hook 3"],
    "cta_recommendation": "specific CTA button recommendation",
    "creative_angles": ["angle 1 based on USP", "angle 2", "angle 3"],
    "retargeting_recommendation": "specific retargeting strategy for this business",
    "warning": "specific risk warning for this business type and goal"
  }${includeSocial ? ',' : ''}` : ''}
${includeSocial ? `"social": {
    "content_strategy": "one paragraph content strategy specific to this business",
    "captions": [
      "caption 1 - engaging, specific to their business and audience",
      "caption 2",
      "caption 3",
      "caption 4",
      "caption 5"
    ],
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10"],
    "best_time_to_post": "specific recommendation for this business type",
    "content_angles": ["angle 1", "angle 2", "angle 3"],
    "story_ideas": ["story idea 1", "story idea 2", "story idea 3"],
    "reel_concepts": ["reel concept 1", "reel concept 2", "reel concept 3"]
  }` : ''}
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return res.status(500).json({ error: 'Groq failed', detail: err });
    }

    const groqData = await groqRes.json();
    const rawText = groqData.choices[0].message.content;

    let results;
    try {
      results = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse results', detail: rawText });
    }

    const result = await pool.query(
      `INSERT INTO ad_generations (
        email, full_name, business_name, industry, offer_type,
        target_audience, location_type, unique_selling_point, biggest_challenge,
        platform, goal, budget, results, clerk_user_id, content_type
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
      [email, full_name, business_name, industry, offer_type,
       target_audience, location_type, unique_selling_point, biggest_challenge,
       content_type, goal, budget, JSON.stringify(results), clerk_user_id || null, content_type]
    );

    return res.status(200).json({ id: result.rows[0].id, results });

  } catch (err) {
    console.error('generate-ads error:', err);
    return res.status(500).json({ error: err.message });
  }
}
