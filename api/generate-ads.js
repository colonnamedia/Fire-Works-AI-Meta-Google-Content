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
      monthly_revenue, avg_ticket_value, has_tracking, main_cta,
      has_reviews, currently_running_ads, biggest_competitor,
      content_type, goal, budget, website_url, clerk_user_id
    } = req.body;

    if (clerk_user_id) {
     const result = await pool.query(
      `INSERT INTO ad_generations (
        email, full_name, business_name, industry, offer_type,
        target_audience, location_type, unique_selling_point, biggest_challenge,
        platform, goal, budget, results, clerk_user_id, content_type, website_url,
        monthly_revenue, avg_ticket_value, has_tracking, main_cta,
        has_reviews, currently_running_ads, biggest_competitor
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING id`,
      [email, full_name, business_name, industry, offer_type,
       target_audience, location_type, unique_selling_point, biggest_challenge,
       content_type, goal, budget, JSON.stringify(results), clerk_user_id || null,
       content_type, website_url || null,
       monthly_revenue || null, avg_ticket_value || null, has_tracking || null,
       main_cta || null, has_reviews || null, currently_running_ads || null,
       biggest_competitor || null]
    );

   const businessContext = `
Business Name: ${business_name}
Industry: ${industry}
Main Offer: ${offer_type || 'Not specified'}
Ideal Customer: ${target_audience || 'Not specified'}
Service Area: ${location_type || 'local'}
Unique Selling Point: ${unique_selling_point || 'Not specified'}
Biggest Challenge: ${biggest_challenge || 'Not specified'}
Primary Goal: ${goal}
Monthly Ad Budget: ${budget || 'Not specified'}
Website URL: ${website_url || 'Not provided'}
Monthly Revenue Range: ${monthly_revenue || 'Not specified'}
Average Ticket Value: ${avg_ticket_value || 'Not specified'}
Tracking Setup: ${has_tracking || 'Not specified'}
Primary Call to Action: ${main_cta || 'Not specified'}
Has Reviews/Testimonials: ${has_reviews || 'Not specified'}
Currently Running Ads: ${currently_running_ads || 'Not specified'}
Biggest Competitor: ${biggest_competitor || 'Not specified'}`;

    const includeGoogle = content_type === 'google_ads' || content_type === 'google_meta' || content_type === 'everything';
    const includeMeta = content_type === 'meta_ads' || content_type === 'google_meta' || content_type === 'everything';
    const includeSocial = content_type === 'organic_social' || content_type === 'everything';
    const includeKeywords = content_type === 'keyword_research' || content_type === 'everything';

    const prompt = `You are an expert digital advertising strategist. Generate comprehensive, highly specific ad content for this business. Every headline must be close to 30 characters. Every description must be close to 90 characters. Be specific to this exact business — never use generic copy.

${businessContext}

CRITICAL RULES:
- Headlines: aim for 25-30 characters each. Never under 15 characters.
- Descriptions: aim for 75-90 characters each. Never under 50 characters.
- Sitelinks: use the website URL to suggest real page paths if provided. Each sitelink needs 2 descriptions.
- All copy must directly reference the business name, offer, or location.

Return ONLY valid JSON, no markdown, no extra text:
{
${includeGoogle ? `"google": {
    "campaign_type": "recommended campaign type with one sentence explanation",
    "campaign_objective": "specific objective for this business",
    "budget_recommendation": "specific daily budget based on their monthly budget",
    "bidding_strategy": "recommended bidding strategy with explanation",
    "location_targeting": "specific location recommendation based on service area",
    "location_exclusions": "locations to exclude or None recommended",
    "audience_targeting": "specific audience targeting recommendation",
    "headlines": [
      "headline 1 — 25-30 chars",
      "headline 2 — 25-30 chars",
      "headline 3 — 25-30 chars",
      "headline 4 — 25-30 chars",
      "headline 5 — 25-30 chars",
      "headline 6 — 25-30 chars",
      "headline 7 — 25-30 chars",
      "headline 8 — 25-30 chars",
      "headline 9 — 25-30 chars",
      "headline 10 — 25-30 chars",
      "headline 11 — 25-30 chars",
      "headline 12 — 25-30 chars",
      "headline 13 — 25-30 chars",
      "headline 14 — 25-30 chars",
      "headline 15 — 25-30 chars"
    ],
    "descriptions": [
      "description 1 — aim for 80-90 characters, specific to the business offer",
      "description 2 — aim for 80-90 characters, specific to the business offer",
      "description 3 — aim for 80-90 characters, specific to the business offer",
      "description 4 — aim for 80-90 characters, specific to the business offer"
    ],
    "sitelinks": [
      { "title": "sitelink 1 title", "description1": "first description max 35 chars", "description2": "second description max 35 chars", "suggested_url": "/page-path" },
      { "title": "sitelink 2 title", "description1": "first description max 35 chars", "description2": "second description max 35 chars", "suggested_url": "/page-path" },
      { "title": "sitelink 3 title", "description1": "first description max 35 chars", "description2": "second description max 35 chars", "suggested_url": "/page-path" },
      { "title": "sitelink 4 title", "description1": "first description max 35 chars", "description2": "second description max 35 chars", "suggested_url": "/page-path" }
    ],
    "callouts": ["callout 1 max 25 chars", "callout 2", "callout 3", "callout 4", "callout 5", "callout 6"],
    "keywords": [
      { "keyword": "keyword 1", "match_type": "Exact", "intent": "commercial" },
      { "keyword": "keyword 2", "match_type": "Phrase", "intent": "navigational" },
      { "keyword": "keyword 3", "match_type": "Broad", "intent": "informational" },
      { "keyword": "keyword 4", "match_type": "Exact", "intent": "commercial" },
      { "keyword": "keyword 5", "match_type": "Phrase", "intent": "commercial" },
      { "keyword": "keyword 6", "match_type": "Exact", "intent": "commercial" },
      { "keyword": "keyword 7", "match_type": "Phrase", "intent": "commercial" },
      { "keyword": "keyword 8", "match_type": "Broad", "intent": "informational" },
      { "keyword": "keyword 9", "match_type": "Exact", "intent": "commercial" },
      { "keyword": "keyword 10", "match_type": "Phrase", "intent": "commercial" }
    ],
    "negative_keywords": ["negative 1", "negative 2", "negative 3", "negative 4", "negative 5", "negative 6", "negative 7", "negative 8", "negative 9", "negative 10"],
    "campaign_tip": "specific actionable tip for this exact business"
  }${includeMeta || includeSocial || includeKeywords ? ',' : ''}` : ''}
${includeMeta ? `"meta": {
    "campaign_objective": "recommended Meta objective with explanation",
    "budget_recommendation": "specific daily budget recommendation",
    "ad_set_structure": "recommended ad set structure",
    "placement_recommendation": "specific placements (Feed, Stories, Reels etc)",
    "audience": {
      "age_range": "recommended age range",
      "gender": "All Male or Female with reasoning",
      "interests": ["interest 1", "interest 2", "interest 3", "interest 4", "interest 5"],
      "behaviors": ["behavior 1", "behavior 2", "behavior 3"],
      "exclusions": "audiences to exclude or None"
    },
    "geographic_targeting": "specific geographic targeting",
    "creative_direction": "image vs video recommendation with reasoning",
    "creative_format": "specific format recommendation",
    "primary_texts": [
      "primary text 1 — 2 to 3 sentences specific to their offer",
      "primary text 2",
      "primary text 3"
    ],
    "headlines": ["headline 1", "headline 2", "headline 3"],
    "hooks": ["hook 1", "hook 2", "hook 3"],
    "cta_recommendation": "specific CTA button",
    "creative_angles": ["angle 1", "angle 2", "angle 3"],
    "retargeting_recommendation": "specific retargeting strategy",
    "warning": "specific risk warning"
  }${includeSocial || includeKeywords ? ',' : ''}` : ''}
${includeSocial ? `"social": {
    "content_strategy": "one paragraph content strategy",
    "captions": ["caption 1", "caption 2", "caption 3", "caption 4", "caption 5"],
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10"],
    "best_time_to_post": "specific recommendation",
    "content_angles": ["angle 1", "angle 2", "angle 3"],
    "story_ideas": ["story 1", "story 2", "story 3"],
    "reel_concepts": ["reel 1", "reel 2", "reel 3"]
  }${includeKeywords ? ',' : ''}` : ''}
${includeKeywords ? `"keywords": {
    "primary_keywords": [
      { "keyword": "keyword 1", "match_type": "Exact", "intent": "commercial", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 2", "match_type": "Phrase", "intent": "commercial", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 3", "match_type": "Exact", "intent": "commercial", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 4", "match_type": "Phrase", "intent": "navigational", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 5", "match_type": "Broad", "intent": "informational", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 6", "match_type": "Exact", "intent": "commercial", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 7", "match_type": "Phrase", "intent": "commercial", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 8", "match_type": "Exact", "intent": "commercial", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 9", "match_type": "Broad", "intent": "informational", "estimated_competition": "High/Medium/Low" },
      { "keyword": "keyword 10", "match_type": "Phrase", "intent": "commercial", "estimated_competition": "High/Medium/Low" }
    ],
    "long_tail_keywords": [
      { "keyword": "long tail 1", "intent": "commercial" },
      { "keyword": "long tail 2", "intent": "commercial" },
      { "keyword": "long tail 3", "intent": "commercial" },
      { "keyword": "long tail 4", "intent": "informational" },
      { "keyword": "long tail 5", "intent": "commercial" },
      { "keyword": "long tail 6", "intent": "commercial" },
      { "keyword": "long tail 7", "intent": "commercial" },
      { "keyword": "long tail 8", "intent": "informational" },
      { "keyword": "long tail 9", "intent": "commercial" },
      { "keyword": "long tail 10", "intent": "commercial" }
    ],
    "negative_keywords": ["negative 1", "negative 2", "negative 3", "negative 4", "negative 5", "negative 6", "negative 7", "negative 8", "negative 9", "negative 10"],
    "competitor_terms": ["competitor term 1", "competitor term 2", "competitor term 3", "competitor term 4", "competitor term 5"],
    "seo_opportunities": ["seo opportunity 1", "seo opportunity 2", "seo opportunity 3"],
    "keyword_strategy": "specific keyword strategy recommendation for this business"
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
        platform, goal, budget, results, clerk_user_id, content_type, website_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id`,
      [email, full_name, business_name, industry, offer_type,
       target_audience, location_type, unique_selling_point, biggest_challenge,
       content_type, goal, budget, JSON.stringify(results), clerk_user_id || null,
       content_type, website_url || null]
    );

    return res.status(200).json({ id: result.rows[0].id, results });

  } catch (err) {
    console.error('generate-ads error:', err);
    return res.status(500).json({ error: err.message });
  }
}
