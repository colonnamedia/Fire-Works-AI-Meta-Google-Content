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
      platform, goal, budget, clerk_user_id
    } = req.body;

    // Save or update user profile
    if (clerk_user_id) {
      await pool.query(`
        INSERT INTO user_profiles (clerk_user_id, email, full_name, business_name, industry, offer_type, target_audience, location_type, unique_selling_point, biggest_challenge, goal, budget)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (clerk_user_id) DO UPDATE SET
          email = $2, full_name = $3, business_name = $4,
          industry = $5, offer_type = $6, target_audience = $7,
          location_type = $8, unique_selling_point = $9,
          biggest_challenge = $10, goal = $11, budget = $12,
          updated_at = NOW()
      `, [clerk_user_id, email, full_name, business_name, industry, offer_type,
          target_audience, location_type, unique_selling_point, biggest_challenge, goal, budget]);
    }

    const platformLabel = platform === 'both' ? 'Google Ads, Meta Ads, and Organic Social Posts' :
      platform === 'google' ? 'Google Ads' : 'Meta Ads and Organic Social Posts';

    const prompt = `You are an expert digital advertising strategist specializing in small and medium businesses. Generate highly specific, conversion-focused ad copy based on the following business details.

Business Name: ${business_name}
Industry: ${industry}
Main Offer: ${offer_type || 'Not specified'}
Ideal Customer: ${target_audience || 'Not specified'}
Service Area: ${location_type || 'local'}
Unique Selling Point: ${unique_selling_point || 'Not specified'}
Biggest Challenge: ${biggest_challenge || 'Not specified'}
Primary Goal: ${goal}
Monthly Budget: ${budget || 'Not specified'}
Platforms: ${platformLabel}

IMPORTANT: Make the copy highly specific to this business. Use the industry, offer, target audience, and unique selling point to write copy that feels custom — not generic. Reference their specific service or product directly in headlines and hooks.

Return ONLY a JSON object with this exact structure, no other text:
{
  ${platform === 'google' || platform === 'both' ? `"google": {
    "headlines": ["headline 1 max 30 chars", "headline 2", "headline 3", "headline 4", "headline 5", "headline 6", "headline 7", "headline 8", "headline 9", "headline 10", "headline 11", "headline 12", "headline 13", "headline 14", "headline 15"],
    "descriptions": ["description 1 max 90 chars", "description 2", "description 3", "description 4"],
    "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5", "keyword 6", "keyword 7", "keyword 8", "keyword 9", "keyword 10"],
    "match_type_recommendation": "specific recommendation for this business type",
    "campaign_tip": "one specific actionable tip for this business"
  }${platform === 'both' ? ',' : ''}` : ''}
  ${platform === 'meta' || platform === 'both' ? `"meta": {
    "primary_texts": ["primary text option 1 2-3 sentences specific to their offer", "primary text option 2", "primary text option 3"],
    "headlines": ["headline 1", "headline 2", "headline 3"],
    "hooks": ["scroll-stopping hook 1 specific to their audience", "hook 2", "hook 3"],
    "cta_recommendation": "specific CTA for their goal",
    "audience_direction": "detailed targeting recommendation for this specific business and location type",
    "creative_angles": ["specific angle 1 based on their USP", "angle 2", "angle 3"],
    "warning": "specific risk warning for this business type and goal"
  },
  "social": {
    "captions": ["caption 1 specific to their business and audience", "caption 2", "caption 3", "caption 4", "caption 5"],
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10"],
    "best_time_to_post": "specific recommendation for this business type and audience",
    "content_angles": ["specific angle 1", "angle 2", "angle 3"]
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

    const result = await pool.query(
      `INSERT INTO ad_generations (
        email, full_name, business_name, industry, offer_type,
        target_audience, location_type, unique_selling_point, biggest_challenge,
        platform, goal, budget, results, clerk_user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
      [email, full_name, business_name, industry, offer_type,
       target_audience, location_type, unique_selling_point, biggest_challenge,
       platform, goal, budget, JSON.stringify(results), clerk_user_id || null]
    );

    return res.status(200).json({ id: result.rows[0].id, results });

  } catch (err) {
    console.error('generate-ads error:', err);
    return res.status(500).json({ error: err.message });
  }
}
