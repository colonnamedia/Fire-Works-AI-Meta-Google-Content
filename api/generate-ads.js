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
      platform, goal, budget, clerk_user_id
    } = req.body;

    // Save or update user profile
    if (clerk_user_id) {
      await pool.query(`
        INSERT INTO user_profiles (clerk_user_id, email, full_name, business_name, industry, offer_type, goal, budget)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (clerk_user_id) DO UPDATE SET
          email = $2, full_name = $3, business_name = $4,
          industry = $5, offer_type = $6, goal = $7, budget = $8,
          updated_at = NOW()
      `, [clerk_user_id, email, full_name, business_name, industry, offer_type, goal, budget]);
    }

    // Build prompt based on platform
    const platformLabel = platform === 'both' ? 'Google Ads, Meta Ads, and Organic Social Posts' :
      platform === 'google' ? 'Google Ads' :
      platform === 'meta' ? 'Meta Ads and Organic Social Posts' : 'Meta Ads';

    const prompt = `You are an expert digital advertising strategist. Generate ad copy for the following business.

Business: ${business_name}
Industry: ${industry}
Offer: ${offer_type}
Goal: ${goal}
Budget: ${budget || 'Not specified'}
Platforms: ${platformLabel}

Return ONLY a JSON object with this exact structure, no other text:
{
  ${platform === 'google' || platform === 'both' ? `"google": {
    "headlines": ["headline 1 (max 30 chars)", "headline 2", "headline 3", "headline 4", "headline 5", "headline 6", "headline 7", "headline 8", "headline 9", "headline 10", "headline 11", "headline 12", "headline 13", "headline 14", "headline 15"],
    "descriptions": ["description 1 (max 90 chars)", "description 2", "description 3", "description 4"],
    "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5", "keyword 6", "keyword 7", "keyword 8", "keyword 9", "keyword 10"],
    "match_type_recommendation": "recommendation text",
    "campaign_tip": "one actionable tip"
  },` : ''}
  ${platform === 'meta' || platform === 'both' ? `"meta": {
    "primary_texts": ["primary text option 1 (2-3 sentences)", "primary text option 2", "primary text option 3"],
    "headlines": ["headline 1", "headline 2", "headline 3"],
    "hooks": ["hook idea 1", "hook idea 2", "hook idea 3"],
    "cta_recommendation": "recommended CTA button",
    "audience_direction": "targeting recommendation paragraph",
    "creative_angles": ["angle 1", "angle 2", "angle 3"],
    "warning": "one risk warning to watch for"
  },` : ''}
  ${platform === 'meta' || platform === 'both' ? `"social": {
    "captions": ["caption 1", "caption 2", "caption 3", "caption 4", "caption 5"],
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10"],
    "best_time_to_post": "recommendation",
    "content_angles": ["angle 1", "angle 2", "angle 3"]
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
        temperature: 0.8,
        max_tokens: 3000
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

    // Save to Neon
    const result = await pool.query(
      `INSERT INTO ad_generations (
        email, full_name, business_name, industry, offer_type,
        platform, goal, budget, results, clerk_user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [email, full_name, business_name, industry, offer_type,
       platform, goal, budget, JSON.stringify(results), clerk_user_id || null]
    );

    return res.status(200).json({ id: result.rows[0].id, results });

  } catch (err) {
    console.error('generate-ads error:', err);
    return res.status(500).json({ error: err.message });
  }
}
