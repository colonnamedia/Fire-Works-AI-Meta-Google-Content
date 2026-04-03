import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SYSTEM_PROMPT = `You are an expert Meta advertising strategist focused on Facebook and Instagram campaigns for small and medium-sized businesses.

Your job is to recommend the best campaign objective, optimization goal, ad structure, and ad copy based on the user's business inputs.

You must think like a performance marketer, not just a copywriter.

Always do the following:
1. Evaluate the business type, offer, audience, budget, and goal
2. Recommend the best campaign objective even if it differs from what the user expected
3. Explain why the recommendation makes sense
4. Keep strategy practical and simple
5. Avoid overly complex campaign structures for small budgets
6. Generate ad ideas that fit the business and the likely buyer journey
7. Output concise, useful recommendations that a business owner can act on immediately

Recommendation logic:
- Awareness objective is for visibility, not direct results
- Traffic is better for clicks than lead quality
- Leads is often best for quick inquiry generation, especially for local service businesses
- Sales/conversions is best when the business has a strong conversion path and tracking
- Messaging can work well when the sales process is conversational
- For small budgets (under $1000/month), prefer simple structures with fewer moving parts
- For local businesses, avoid over-segmentation unless the budget supports it
- When the user's selected objective is weak for their situation, explain why and suggest a stronger one
- If the offer is a free trial, compare lead form vs website conversion and explain the tradeoff
- If the business is service-based and local, prioritize simple campaign structures

You MUST return valid JSON matching the exact schema specified. No markdown, no code blocks, just JSON.`;

function buildUserPrompt(inputs) {
  return `Analyze this business and create a complete Meta ad strategy recommendation.

Business Details:
- Business Name: ${inputs.businessName || 'Not specified'}
- Industry: ${inputs.industry || 'Not specified'}
- Business Type: ${inputs.businessType || 'Not specified'}
- Local or Online: ${inputs.localOrOnline || 'Not specified'}
- Offer Type: ${inputs.offerType || 'Not specified'}
- Main Goal: ${inputs.goal || 'Not specified'}
- Monthly Budget: ${inputs.budget || 'Not specified'}
- Landing Page URL: ${inputs.landingPageUrl || 'None provided'}
- Lead Form or Website: ${inputs.leadFormOrWebsite || 'Not specified'}
- Geographic Targeting: ${inputs.geographicTargeting || 'Not specified'}
- Audience Description: ${inputs.audienceDescription || 'Not specified'}
- Traffic Temperature: ${inputs.trafficTemperature || 'Not specified'}
- Preferred Creative Type: ${inputs.creativePreference || 'Not specified'}
- Tone of Voice: ${inputs.toneOfVoice || 'Not specified'}
- Special Notes: ${inputs.notes || 'None'}
- CTA Preference: ${inputs.ctaPreference || 'Not specified'}

Return your recommendation as a JSON object with this exact structure:
{
  "recommendedObjective": "string - the best campaign objective",
  "recommendedOptimizationGoal": "string - the best optimization goal",
  "whyThisMakesSense": "string - 2-3 sentences explaining why",
  "campaignSetup": "string - recommended campaign structure and settings",
  "adSetStrategy": "string - recommended ad set configuration",
  "placements": "string - recommended placements",
  "audienceDirection": "string - audience targeting approach",
  "hooks": ["3 hook ideas as strings"],
  "headlines": ["3 headline ideas as strings"],
  "primaryTextOptions": ["2 primary text options as strings"],
  "ctaSuggestions": ["2 CTA suggestions as strings"],
  "creativeAngleIdeas": ["3 creative angle ideas as strings"],
  "risksWarnings": ["array of risk/warning strings, especially if user's goal doesn't match recommendation"],
  "finalRecommendation": "string - 2-3 sentence final summary"
}

Be practical, clear, and conversion-focused. Do not blindly repeat the user's chosen objective if a better one exists.`;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  const user = await base44.auth.me();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const inputs = body;

  // Get user's API settings
  let apiSettings;
  const settings = await base44.entities.ApiSetting.filter({ created_by: user.email });
  if (settings && settings.length > 0) {
    apiSettings = settings[0];
  }

  // Determine provider config
  const provider = apiSettings?.provider_name || 'openrouter';
  const apiKey = apiSettings?.api_key;
  const useFree = apiSettings?.use_free_router !== false;
  let model = apiSettings?.model_name || '';

  if (!apiKey && provider !== 'builtin') {
    // Use built-in InvokeLLM as fallback
    console.log('No API key configured, using built-in LLM');
    
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: buildUserPrompt(inputs),
      response_json_schema: {
        type: "object",
        properties: {
          recommendedObjective: { type: "string" },
          recommendedOptimizationGoal: { type: "string" },
          whyThisMakesSense: { type: "string" },
          campaignSetup: { type: "string" },
          adSetStrategy: { type: "string" },
          placements: { type: "string" },
          audienceDirection: { type: "string" },
          hooks: { type: "array", items: { type: "string" } },
          headlines: { type: "array", items: { type: "string" } },
          primaryTextOptions: { type: "array", items: { type: "string" } },
          ctaSuggestions: { type: "array", items: { type: "string" } },
          creativeAngleIdeas: { type: "array", items: { type: "string" } },
          risksWarnings: { type: "array", items: { type: "string" } },
          finalRecommendation: { type: "string" }
        }
      }
    });

    console.log('Built-in LLM response received');
    return Response.json(result);
  }

  // Use external provider
  let apiUrl, headers, requestBody;

  if (provider === 'openrouter') {
    if (!model) {
      model = useFree ? 'google/gemma-3-1b-it:free' : 'google/gemini-2.0-flash-001';
    }
    apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://meta-ad-strategist.app',
    };
    requestBody = {
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(inputs) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    };
  } else if (provider === 'openai') {
    if (!model) model = 'gpt-4o-mini';
    apiUrl = 'https://api.openai.com/v1/chat/completions';
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
    requestBody = {
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(inputs) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    };
  } else if (provider === 'anthropic') {
    if (!model) model = 'claude-sonnet-4-20250514';
    apiUrl = 'https://api.anthropic.com/v1/messages';
    headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    };
    requestBody = {
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildUserPrompt(inputs) + '\n\nReturn ONLY valid JSON, no markdown.' }
      ],
    };
  }

  console.log(`Using provider: ${provider}, model: ${model}`);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Provider error: ${response.status} - ${errorText}`);
    return Response.json({ 
      error: `AI provider returned an error. Please check your API key and settings.`,
      details: errorText 
    }, { status: 502 });
  }

  const data = await response.json();
  let content;

  if (provider === 'anthropic') {
    content = data.content?.[0]?.text;
  } else {
    content = data.choices?.[0]?.message?.content;
  }

  if (!content) {
    console.error('Empty response from provider');
    return Response.json({ error: 'AI returned an empty response. Please try again.' }, { status: 502 });
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      console.error('Failed to parse AI response:', content.substring(0, 500));
      return Response.json({ error: 'AI returned an invalid format. Please try again.' }, { status: 502 });
    }
  }

  console.log('Strategy generated successfully');
  return Response.json(parsed);
});