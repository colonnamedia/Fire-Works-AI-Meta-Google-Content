import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, businessName, strategy } = await req.json();

    if (!email || !strategy) {
      return Response.json({ error: 'Missing email or strategy' }, { status: 400 });
    }

    // Format strategy for email
    const strategyText = `
CAMPAIGN DIRECTION:
${strategy.campaignDirection}

RECOMMENDED OBJECTIVE: ${strategy.recommendedObjective}

SAMPLE HEADLINE:
"${strategy.sampleHeadline}"

SAMPLE AD COPY:
${strategy.sampleDescription}

TARGET AUDIENCE:
${strategy.audienceSuggestion}

---

To see your complete strategy including all headlines, hooks, full copy options, targeting ideas, competitor analysis and more, subscribe at Fire-Works AI.
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `Your ${businessName} Ad Strategy from Fire-Works AI`,
      body: strategyText,
      from_name: 'Fire-Works AI'
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});