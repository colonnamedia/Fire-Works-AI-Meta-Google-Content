import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SCHEMA = {
  type: 'object',
  properties: {
    concepts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          format: { type: 'string' },
          visualStyle: { type: 'string' },
          colorPalette: { type: 'string' },
          imageDescription: { type: 'string' },
          layoutIdea: { type: 'string' },
          textOverlay: { type: 'string' },
          mood: { type: 'string' },
          bestFor: { type: 'string' }
        }
      }
    },
    generalStyleGuide: { type: 'string' },
    dosList: { type: 'array', items: { type: 'string' } },
    dontsList: { type: 'array', items: { type: 'string' } },
    platformNotes: { type: 'string' }
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { entryId, businessName, industry, businessType, offerType, goal, toneOfVoice, creativePreference, audienceDescription, platformType } = data;

    if (!entryId) return Response.json({ error: 'entryId is required' }, { status: 400 });

    const prompt = `You are an expert visual ad creative director specializing in paid social and search advertising. Generate 3 distinct, detailed visual ad creative concepts for this business.

BUSINESS DETAILS:
- Business Name: ${businessName || 'N/A'}
- Industry: ${industry || 'N/A'}
- Business Type: ${businessType || 'N/A'}
- Offer/Product: ${offerType || 'N/A'}
- Campaign Goal: ${goal || 'N/A'}
- Tone of Voice: ${toneOfVoice || 'professional'}
- Creative Format Preference: ${creativePreference || 'image'}
- Target Audience: ${audienceDescription || 'N/A'}
- Platform: ${platformType || 'meta'}

For each concept provide:
- title: Short concept name (e.g. "Problem/Solution Split", "Lifestyle Hero Shot")
- format: e.g. "Single Image", "Carousel", "Video (15s)", "Story", "Square 1:1"
- visualStyle: e.g. "Clean minimalist", "Bold and energetic", "Warm and authentic UGC-style"
- colorPalette: e.g. "Deep navy #1a2b4a + bright white #ffffff + accent orange #ff6b35"
- imageDescription: Detailed description of exactly what should appear in the image/video — specific enough to brief a designer or use as an AI image prompt
- layoutIdea: How elements are arranged (e.g. "Text on left 40%, product hero on right 60%, gradient overlay")
- textOverlay: What text/copy should appear directly on the creative
- mood: The emotional feel (e.g. "Urgent and trustworthy", "Aspirational and warm")
- bestFor: Which placement or audience this concept works best for

Also provide:
- generalStyleGuide: Overall visual direction for this brand's ads
- dosList: 4 visual dos for this industry/goal
- dontsList: 4 visual don'ts to avoid
- platformNotes: Specific sizing/format advice for ${platformType || 'meta'}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: SCHEMA
    });

    // Save the creative concepts back to the AdIdeaEntry
    const entry = await base44.asServiceRole.entities.AdIdeaEntry.filter({ id: entryId });
    if (entry[0]) {
      const existing = entry[0].ai_response_json || {};
      await base44.asServiceRole.entities.AdIdeaEntry.update(entryId, {
        ai_response_json: { ...existing, creativeConcepts: result }
      });
    }

    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});