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
      target_audience, location_type, unique_selling_point, biggest_competitor,
      monthly_revenue, avg_ticket_value, has_tracking, main_cta,
      has_reviews, currently_running_ads, website_url,
      content_type, goal, budget, clerk_user_id,
      // New platform-specific
      campaign_type, has_landing_page, has_pixel,
      audience_temperature, creative_preference,
      google_budget, meta_budget,
      social_platforms, posting_frequency, content_style,
      meta_objective,
      add_on_keywords, add_on_social,
    } = req.body;

    if (clerk_user_id) {
      await pool.query(`
        INSERT INTO user_profiles (clerk_user_id, email, full_name, business_name, industry, offer_type, target_audience, location_type, unique_selling_point, biggest_competitor, goal, budget, content_type, website_url, monthly_revenue, avg_ticket_value, has_tracking, main_cta, has_reviews, currently_running_ads, campaign_type, has_landing_page, has_pixel, creative_preference)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
        ON CONFLICT (clerk_user_id) DO UPDATE SET
          email=$2, full_name=$3, business_name=$4, industry=$5, offer_type=$6,
          target_audience=$7, location_type=$8, unique_selling_point=$9, biggest_competitor=$10,
          goal=$11, budget=$12, content_type=$13, website_url=$14,
          monthly_revenue=$15, avg_ticket_value=$16, has_tracking=$17, main_cta=$18,
          has_reviews=$19, currently_running_ads=$20, campaign_type=$21,
          has_landing_page=$22, has_pixel=$23, creative_preference=$24,
          updated_at=NOW()
      `, [clerk_user_id, email, full_name, business_name, industry, offer_type,
          target_audience, location_type, unique_selling_point, biggest_competitor,
          goal || meta_objective || 'leads', budget || google_budget || meta_budget,
          content_type, website_url, monthly_revenue, avg_ticket_value,
          has_tracking, main_cta, has_reviews, currently_running_ads,
          campaign_type, has_landing_page, has_pixel, creative_preference]);
    }

    const includeGoogle = content_type === 'google_ads' || content_type === 'google_meta' || content_type === 'everything';
    const includeMeta = content_type === 'meta_ads' || content_type === 'google_meta' || content_type === 'everything';
    const includeSocial = content_type === 'organic_social' || content_type === 'everything' || add_on_social;
    const includeKeywords = content_type === 'everything' || add_on_keywords;

    const businessContext = `
Business Name: ${business_name}
Industry: ${industry}
Main Offer: ${offer_type || 'Not specified'}
Ideal Customer: ${target_audience || 'Not specified'}
Service Area: ${location_type || 'local'}
Unique Selling Point: ${unique_selling_point || 'Not specified'}
Biggest Competitor: ${biggest_competitor || 'Not specified'}
Website: ${website_url || 'Not provided'}
Average Ticket Value: ${avg_ticket_value || 'Not specified'}
Monthly Revenue: ${monthly_revenue || 'Not specified'}
${includeGoogle ? `
--- GOOGLE ADS ---
Campaign Type Requested: ${campaign_type || 'Not specified'}
Monthly Google Budget: ${google_budget || budget || 'Not specified'}
Has Landing Page: ${has_landing_page || 'Not specified'}
Has Conversion Tracking: ${has_tracking || 'Not specified'}
Primary CTA: ${main_cta || 'Not specified'}
` : ''}
${includeMeta ? `
--- META ADS ---
Campaign Objective: ${meta_objective || goal || 'leads'}
Monthly Meta Budget: ${meta_budget || budget || 'Not specified'}
Has Meta Pixel: ${has_pixel || 'Not specified'}
Audience Temperature: ${audience_temperature || 'cold'}
Creative Preference: ${creative_preference || 'Not specified'}
` : ''}
${includeSocial && (content_type === 'organic_social' || add_on_social) ? `
--- ORGANIC SOCIAL ---
Platforms: ${social_platforms || 'Facebook + Instagram'}
Posting Frequency: ${posting_frequency || 'Not specified'}
Content Style: ${content_style || 'mixed'}
` : ''}`;

    const prompt = `You are an expert digital advertising strategist. Generate comprehensive, highly specific ad content for this business. Every piece of copy must directly reference the business name, offer, or location. Never use generic placeholder content.

CRITICAL RULES:
- Google headlines: aim for 25-30 characters. Never under 15.
- Google descriptions: aim for 80-90 characters. Never under 50.
- Sitelinks: use website URL to suggest real page paths. Each needs 2 descriptions.
- Meta copy: be conversational, benefit-driven, specific to their offer and audience.
- All copy must feel custom-written for THIS specific business.

${businessContext}

Return ONLY valid JSON, no markdown, no extra text:
{
${includeGoogle ? `"google": {
    "campaign_type": "recommended campaign type with one sentence explanation",
    "campaign_objective": "specific objective for this business",
    "budget_recommendation": "specific daily budget based on ${google_budget || budget || 'their budget'}",
    "bidding_strategy": "recommended bidding strategy with explanation",
    "location_targeting": "specific location recommendation",
    "location_exclusions": "locations to exclude or None recommended",
    "audience_targeting": "specific audience targeting recommendation",
    "headlines": ["h1 25-30 chars","h2","h3","h4","h5","h6","h7","h8","h9","h10","h11","h12","h13","h14","h15 25-30 chars"],
    "descriptions": ["desc1 80-90 chars","desc2 80-90 chars","desc3 80-90 chars","desc4 80-90 chars"],
    "sitelinks": [
      {"title":"sitelink1","description1":"desc max 35 chars","description2":"desc2 max 35 chars","suggested_url":"/page"},
      {"title":"sitelink2","description1":"desc","description2":"desc2","suggested_url":"/page"},
      {"title":"sitelink3","description1":"desc","description2":"desc2","suggested_url":"/page"},
      {"title":"sitelink4","description1":"desc","description2":"desc2","suggested_url":"/page"}
    ],
    "callouts": ["callout1 max 25 chars","callout2","callout3","callout4","callout5","callout6"],
    "keywords": [
      {"keyword":"kw1","match_type":"Exact","intent":"commercial"},
      {"keyword":"kw2","match_type":"Phrase","intent":"commercial"},
      {"keyword":"kw3","match_type":"Broad","intent":"informational"},
      {"keyword":"kw4","match_type":"Exact","intent":"commercial"},
      {"keyword":"kw5","match_type":"Phrase","intent":"commercial"},
      {"keyword":"kw6","match_type":"Exact","intent":"commercial"},
      {"keyword":"kw7","match_type":"Phrase","intent":"commercial"},
      {"keyword":"kw8","match_type":"Broad","intent":"informational"},
      {"keyword":"kw9","match_type":"Exact","intent":"commercial"},
      {"keyword":"kw10","match_type":"Phrase","intent":"commercial"}
    ],
    "negative_keywords": ["neg1","neg2","neg3","neg4","neg5","neg6","neg7","neg8","neg9","neg10"],
    "tracking_recommendation": "specific tracking setup recommendation based on their current setup",
    "campaign_tip": "one specific actionable tip for this exact business"
  }${includeMeta || includeSocial || includeKeywords ? ',' : ''}` : ''}
${includeMeta ? `"meta": {
    "campaign_objective": "${meta_objective || 'leads'} — recommended objective with explanation",
    "budget_recommendation": "specific daily budget based on ${meta_budget || budget || 'their budget'}",
    "ad_set_structure": "recommended ad set structure",
    "placement_recommendation": "specific placements Feed Stories Reels etc",
    "audience": {
      "age_range": "recommended age range",
      "gender": "All Male or Female with reasoning",
      "interests": ["interest1","interest2","interest3","interest4","interest5"],
      "behaviors": ["behavior1","behavior2","behavior3"],
      "exclusions": "audiences to exclude or None"
    },
    "geographic_targeting": "specific geographic targeting",
    "creative_direction": "recommendation based on ${creative_preference || 'their preference'} with reasoning",
    "creative_format": "specific format recommendation",
    "primary_texts": ["primary text 1 2-3 sentences","primary text 2","primary text 3"],
    "headlines": ["headline1","headline2","headline3"],
    "hooks": ["hook1","hook2","hook3"],
    "cta_recommendation": "specific CTA button",
    "creative_angles": ["angle1","angle2","angle3"],
    "retargeting_recommendation": "specific retargeting strategy",
    "pixel_recommendation": "tracking setup recommendation based on pixel status: ${has_pixel}",
    "warning": "specific risk warning"
  }${includeSocial || includeKeywords ? ',' : ''}` : ''}
${includeSocial ? `"social": {
    "content_strategy": "one paragraph content strategy specific to this business",
    "captions": ["caption1","caption2","caption3","caption4","caption5"],
    "hashtags": ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5","hashtag6","hashtag7","hashtag8","hashtag9","hashtag10"],
    "best_time_to_post": "specific recommendation for this business type",
    "content_angles": ["angle1","angle2","angle3"],
    "story_ideas": ["story1","story2","story3"],
    "reel_concepts": ["reel1","reel2","reel3"]
  }${includeKeywords ? ',' : ''}` : ''}
${includeKeywords ? `"keywords": {
    "primary_keywords": [
      {"keyword":"kw1","match_type":"Exact","intent":"commercial","estimated_competition":"High"},
      {"keyword":"kw2","match_type":"Phrase","intent":"commercial","estimated_competition":"Medium"},
      {"keyword":"kw3","match_type":"Exact","intent":"commercial","estimated_competition":"Low"},
      {"keyword":"kw4","match_type":"Phrase","intent":"navigational","estimated_competition":"Medium"},
      {"keyword":"kw5","match_type":"Broad","intent":"informational","estimated_competition":"Low"},
      {"keyword":"kw6","match_type":"Exact","intent":"commercial","estimated_competition":"High"},
      {"keyword":"kw7","match_type":"Phrase","intent":"commercial","estimated_competition":"Medium"},
      {"keyword":"kw8","match_type":"Exact","intent":"commercial","estimated_competition":"Low"},
      {"keyword":"kw9","match_type":"Broad","intent":"informational","estimated_competition":"Medium"},
      {"keyword":"kw10","match_type":"Phrase","intent":"commercial","estimated_competition":"High"}
    ],
    "long_tail_keywords": [
      {"keyword":"lt1","intent":"commercial"},
      {"keyword":"lt2","intent":"commercial"},
      {"keyword":"lt3","intent":"commercial"},
      {"keyword":"lt4","intent":"informational"},
      {"keyword":"lt5","intent":"commercial"},
      {"keyword":"lt6","intent":"commercial"},
      {"keyword":"lt7","intent":"commercial"},
      {"keyword":"lt8","intent":"informational"},
      {"keyword":"lt9","intent":"commercial"},
      {"keyword":"lt10","intent":"commercial"}
    ],
    "negative_keywords": ["neg1","neg2","neg3","neg4","neg5","neg6","neg7","neg8","neg9","neg10"],
    "competitor_terms": ["comp1","comp2","comp3","comp4","comp5"],
    "seo_opportunities": ["seo1","seo2","seo3"],
    "keyword_strategy": "specific keyword strategy for this business"
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
        target_audience, location_type, unique_selling_point, biggest_competitor,
        platform, goal, budget, results, clerk_user_id, content_type, website_url,
        monthly_revenue, avg_ticket_value, has_tracking, main_cta,
        has_reviews, currently_running_ads, campaign_type, has_landing_page,
        has_pixel, creative_preference, add_on_keywords, add_on_social
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28) RETURNING id`,
      [email, full_name, business_name, industry, offer_type,
       target_audience, location_type, unique_selling_point, biggest_competitor,
       content_type, goal || meta_objective || 'leads',
       budget || google_budget || meta_budget,
       JSON.stringify(results), clerk_user_id || null,
       content_type, website_url || null,
       monthly_revenue || null, avg_ticket_value || null,
       has_tracking || null, main_cta || null,
       has_reviews || null, currently_running_ads || null,
       campaign_type || null, has_landing_page || null,
       has_pixel || null, creative_preference || null,
       add_on_keywords || false, add_on_social || false]
    );

    return res.status(200).json({ id: result.rows[0].id, results });

  } catch (err) {
    console.error('generate-ads error:', err);
    return res.status(500).json({ error: err.message });
  }
}
